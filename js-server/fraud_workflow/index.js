
// import my functions
const {detectCallIntent} = require("./openai");
const { createCall, updateCall} = require("./twilio");

let isFraud = false;

async function fraud_check_run(callDetails) {
  if (isFraud) {
    return;
  }

  // format the timestamp
  const adjustedTimestamp = new Date(callDetails.call_timestamp);
  let smaller_stamp = adjustedTimestamp.toTimeString().split(' ')[0].slice(0, 5);

  detectCallIntent(callDetails.inbound_transcript, smaller_stamp, callDetails.name).then((response) => {
    console.log(response);
    if (response.scam_detected) {
      isFraud = true;
      handleFraud(callDetails, response.explanation);
      callDetails.setResponseObject(response.explanation, callDetails.call_timestamp, callDetails.phone_number);
    }
  });
}

async function handleFraud(callId, guardianPhone, content) {
  // call the victim again and let them know that this is harmful
  updateCall(callId, content);

  // report the incident to the guardian
  createCall(guardianPhone, content);
}

function resetFlag() {
  isFraud = false;
}

module.exports = {fraud_check_run, resetFlag};
