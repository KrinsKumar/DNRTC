const twilio = require("twilio");

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.log(
    "Please set your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables."
  );
  process.exit(1);
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function handUpCall(callId) {
  const call = await client.calls(callId).update({ status: "completed" });
  return call.from;
}

async function createCall(phone_number, content) {
  phone_number = phone_number.replace(/\D/g, "");
  phone_number = `+1${phone_number}`;
  const call = await client.calls.create({
    from: "+16183284945",
    to: phone_number,
    twiml: `<Response><Say>${content}</Say></Response>`,
  });
}

async function updateCall(callId, content) {
  const call = await client
    .calls(callId)
    .update({ twiml: `<Response><Pause length="1" /><Say>${content}</Say></Response>` });
}

module.exports = { handUpCall, createCall, updateCall };
