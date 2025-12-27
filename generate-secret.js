#!/usr/bin/env node
// Quick script to generate a secure SESSION_SECRET
// Usage: node generate-secret.js

import crypto from 'crypto';

const secret = crypto.randomBytes(32).toString('hex');
console.log('\n🔐 Generated SESSION_SECRET:');
console.log(secret);
console.log('\n📋 Copy this and add it to Vercel environment variables as SESSION_SECRET\n');

