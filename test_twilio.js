const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const toNumber = process.env.TWILIO_TO_NUMBER;

if (!accountSid || !authToken || !fromNumber || !toNumber) {
	console.error('Missing Twilio env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, TWILIO_TO_NUMBER');
	process.exit(1);
}

const client = twilio(accountSid, authToken);
client.messages
	.create({ body: 'test', from: fromNumber, to: toNumber })
	.then(console.log)
	.catch(console.error);
