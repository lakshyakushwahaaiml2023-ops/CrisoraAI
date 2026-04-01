import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;
const targetPhone = process.env.TWILIO_TARGET_NUMBER || '+918109927290';

export async function POST(req: Request) {
  try {
    if (!accountSid || !authToken || !fromPhone) {
      console.warn('Twilio credentials missing. Call skipped.');
      return NextResponse.json({ success: false, error: 'NO_CREDENTIALS' }, { status: 400 });
    }

    const client = twilio(accountSid, authToken);
    
    // We need to provide an absolute URL for the webhook from Twilio to our app.
    // In production, use the actual domain. For local testing without ngrok, Twilio won't be able to reach localhost.
    // We will use Twilio's inline TwiML feature (twiml parameter) to avoid needing a public URL for this demo.
    
    const twimlMessage = `
      <Response>
          <Say voice="alice" language="en-US">
             Emergency Broadcast from the National Disaster Relief System.
             You are located in an active high-risk zone. 
             Evacuate immediately. Previous warnings have not been heeded.
             Seek higher ground and follow evacuation routes immediately.
             This is not a drill.
          </Say>
          <Pause length="1"/>
          <Say voice="alice" language="en-US">Repeating. Evacuate immediately.</Say>
      </Response>
    `;

    const result = await client.calls.create({
       twiml: twimlMessage,
       from: fromPhone,
       to: targetPhone
    });

    return NextResponse.json({ success: true, sid: result.sid });
  } catch (err: any) {
    console.error('Twilio Voice Call Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
