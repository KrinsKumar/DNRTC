const twilio = require("twilio");

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log("Please set your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.");
    process.exit(1);
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function handUpCall(callId) {
    const call = await client
        .calls(callId)
        .update({ status: "completed" });

    console.log(call.to);
}

module.exports = handUpCall;

