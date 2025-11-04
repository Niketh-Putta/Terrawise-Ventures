import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { storage } from './storage';
import type { InsertEmail } from '@shared/schema';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  tls: boolean;
}

class EmailService {
  private imap: any;
  private config: EmailConfig | null = null;
  private isConnected = false;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    // Load email configuration from environment variables
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USER;
    const password = process.env.EMAIL_PASSWORD;

    if (host && port && user && password) {
      this.config = {
        host,
        port: parseInt(port),
        user,
        password,
        tls: true,
      };
      console.log('Email service configured for:', user);
    } else {
      console.log('Email service not configured. Missing environment variables:');
      if (!host) console.log('- EMAIL_HOST');
      if (!port) console.log('- EMAIL_PORT');
      if (!user) console.log('- EMAIL_USER');
      if (!password) console.log('- EMAIL_PASSWORD');
    }
  }

  async connect(): Promise<boolean> {
    if (!this.config) {
      console.log('Email service not configured');
      return false;
    }

    return new Promise((resolve) => {
      this.imap = new Imap({
        host: this.config!.host,
        port: this.config!.port,
        tls: this.config!.tls,
        user: this.config!.user,
        password: this.config!.password,
      });

      this.imap.once('ready', () => {
        console.log('Email service connected successfully');
        this.isConnected = true;
        resolve(true);
      });

      this.imap.once('error', (err: Error) => {
        console.error('Email service connection error:', err.message);
        this.isConnected = false;
        resolve(false);
      });

      this.imap.once('end', () => {
        console.log('Email service connection ended');
        this.isConnected = false;
      });

      this.imap.connect();
    });
  }

  async disconnect() {
    if (this.imap && this.isConnected) {
      this.imap.end();
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  async checkForNewEmails(): Promise<void> {
    if (!this.isConnected || !this.imap) {
      console.log('Email service not connected');
      return;
    }

    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', false, (err: Error, box: any) => {
        if (err) {
          console.error('Error opening inbox:', err.message);
          reject(err);
          return;
        }

        // Search for unread emails from the last 7 days
        const searchCriteria = ['UNSEEN', ['SINCE', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)]];
        
        this.imap.search(searchCriteria, (err: Error, results: number[]) => {
          if (err) {
            console.error('Error searching emails:', err.message);
            reject(err);
            return;
          }

          if (results.length === 0) {
            console.log('No new emails found');
            resolve();
            return;
          }

          console.log(`Found ${results.length} new emails`);

          const fetch = this.imap.fetch(results, { bodies: '' });
          
          fetch.on('message', (msg: any) => {
            msg.on('body', (stream: any) => {
              simpleParser(stream, async (err: Error, parsed: any) => {
                if (err) {
                  console.error('Error parsing email:', err.message);
                  return;
                }

                try {
                  await this.saveEmail(parsed);
                } catch (saveErr) {
                  console.error('Error saving email:', saveErr);
                }
              });
            });
          });

          fetch.once('error', (err: Error) => {
            console.error('Fetch error:', err.message);
            reject(err);
          });

          fetch.once('end', () => {
            console.log('Finished processing emails');
            resolve();
          });
        });
      });
    });
  }

  private async saveEmail(parsed: any): Promise<void> {
    try {
      const emailData: InsertEmail = {
        messageId: parsed.messageId || `${Date.now()}-${Math.random()}`,
        from: parsed.from?.value?.[0]?.address || parsed.from?.text || 'unknown',
        fromName: parsed.from?.value?.[0]?.name || null,
        to: this.config?.user || 'unknown',
        subject: parsed.subject || 'No Subject',
        textContent: parsed.text || null,
        htmlContent: parsed.html || null,
        receivedAt: parsed.date || new Date(),
        priority: this.determinePriority(parsed.subject || ''),
        attachments: parsed.attachments ? parsed.attachments.map((att: any) => ({
          filename: att.filename,
          contentType: att.contentType,
          size: att.size,
        })) : null,
      };

      await storage.createEmail(emailData);
      console.log(`Saved email: ${emailData.subject}`);
    } catch (error) {
      console.error('Error saving email to database:', error);
    }
  }

  private determinePriority(subject: string): string {
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('urgent') || lowerSubject.includes('asap') || lowerSubject.includes('emergency')) {
      return 'high';
    }
    if (lowerSubject.includes('inquiry') || lowerSubject.includes('booking') || lowerSubject.includes('visit')) {
      return 'normal';
    }
    return 'normal';
  }

  async startMonitoring(): Promise<void> {
    if (!this.config) {
      console.log('Email monitoring not started - no configuration');
      return;
    }

    const connected = await this.connect();
    if (!connected) {
      console.log('Email monitoring not started - connection failed');
      return;
    }

    // Check for new emails every 5 minutes
    this.checkInterval = setInterval(async () => {
      try {
        await this.checkForNewEmails();
      } catch (error) {
        console.error('Error during email check:', error);
      }
    }, 5 * 60 * 1000);

    // Initial check
    try {
      await this.checkForNewEmails();
    } catch (error) {
      console.error('Error during initial email check:', error);
    }

    console.log('Email monitoring started - checking every 5 minutes');
  }

  async stopMonitoring(): Promise<void> {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    await this.disconnect();
    console.log('Email monitoring stopped');
  }

  getStatus(): { configured: boolean; connected: boolean; monitoring: boolean } {
    return {
      configured: !!this.config,
      connected: this.isConnected,
      monitoring: !!this.checkInterval,
    };
  }
}

export const emailService = new EmailService();