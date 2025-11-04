// Free SMS service for India using Fast2SMS (offers free credits)
export class SMSService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.FAST2SMS_API_KEY || '';
    
    if (this.apiKey) {
      console.log('Fast2SMS service initialized successfully');
    } else {
      console.log('Fast2SMS API key not found. Using development mode.');
    }
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      // Clean phone number (remove +91 prefix if present)
      const cleanPhone = phoneNumber.replace(/^\+91\s*/, '').replace(/\s+/g, '');
      
      // If Fast2SMS is configured, send real SMS
      if (this.apiKey) {
        const message = `Your Terrawise agent login OTP is: ${otp}. This code expires in 10 minutes. Do not share this code.`;
        
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'Authorization': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'otp',
            message: message,
            language: 'english',
            flash: 0,
            numbers: cleanPhone,
          }),
        });

        const result = await response.json();
        
        if (result.return && result.return === true) {
          console.log(`SMS sent successfully to ${phoneNumber}. Request ID: ${result.request_id}`);
          return true;
        } else {
          throw new Error(`Fast2SMS API error: ${result.message || 'Unknown error'}`);
        }
      } else {
        // Development fallback
        console.log(`📱 SMS TO ${phoneNumber}: Your Terrawise agent login OTP is: ${otp}. This code expires in 10 minutes.`);
        console.log(`🔔 DEVELOPMENT MODE: Use OTP code ${otp} to login`);
        return true;
      }
    } catch (error) {
      console.error('Failed to send SMS:', error);
      // Fallback to console logging if SMS fails
      console.log(`📱 BACKUP - OTP for ${phoneNumber}: ${otp}`);
      return false;
    }
  }
}

export const smsService = new SMSService();