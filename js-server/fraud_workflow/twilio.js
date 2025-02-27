const twilio = require("twilio");
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function handUpCall(callId) {
  const call = await client.calls(callId).update({ status: "completed" });
  return call.from;
}

async function createCall(phone_number, content) {
  phone_number = phone_number.replace(/\D/g, "");
  phone_number = `+1${phone_number}`;
  const call = await client.calls.create({
    from: process.env.PHONE_NUMBER,
    to: phone_number,
    twiml: `<Response><Pause length="2" /><Say>${content}</Say></Response>`,
  });
}

async function updateCall(callId, content) {
  const call = await client
    .calls(callId)
    .update({ twiml: `<Response><Pause length="2" /><Say>${content}</Say></Response>` });
}

module.exports = { handUpCall, createCall, updateCall };
