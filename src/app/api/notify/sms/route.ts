import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;
// Target all simulated SMS and Calls to this test number
const targetPhone = process.env.TWILIO_TARGET_NUMBER || '+918109927290';

export async function POST(req: Request) {
  try {
    const { type, message, location } = await req.json();
    
    if (!accountSid || !authToken || !fromPhone) {
      console.warn('Twilio credentials missing. SMS skipped.');
      return NextResponse.json({ success: false, error: 'NO_CREDENTIALS' }, { status: 400 });
    }

    const client = twilio(accountSid, authToken);
    
    let smsBody = '';
    
    if (type === 'warning') {
      smsBody = `[NDRS ALERT] ${message}\nEvacuate low-lying areas. Stay safe.`;
    } else if (type === 'panic') {
      smsBody = `[NDRS URGENT] PANIC SIGNAL DETECTED. Officer dispatch requested.\nLocation: ${location?.lat || 'N/A'}, ${location?.lng || 'N/A'}\nMessage: ${message || 'Immediate help needed'}`;
    } else {
      smsBody = `[NDRS NOTIFICATION] ${message}`;
    }

    const result = await client.messages.create({
       body: smsBody,
       from: fromPhone,
       to: targetPhone
    });

    return NextResponse.json({ success: true, sid: result.sid });
  } catch (err: any) {
    console.error('Twilio SMS Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
