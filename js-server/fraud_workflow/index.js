
// import my functions
const detectCallIntent = require("./openai");
const { handUpCall, createCall, updateCall} = require("./twilio");

let isFraud = false;

async function fraud_check_run(callDetails) {
  if (isFraud) {
    return;
  }
  const adjustedTimestamp = new Date(callDetails.call_timestamp);
  adjustedTimestamp.setHours(adjustedTimestamp.getHours() - 5);
  console.log(adjustedTimestamp);
  console.log(adjustedTimestamp.toTimeString().split(' ')[0].slice(0, 5));
  callDetails.call_timestamp = adjustedTimestamp.toTimeString().split(' ')[0].slice(0, 5);
  console.log(callDetails.call_timestamp);
  detectCallIntent(callDetails.inbound_transcript, callDetails.call_timestamp, callDetails.name).then((response) => {
    console.log(response);
    if (response.scam_detected) {
      isFraud = true;
      handleFraud(callDetails, response.explanation);
      setResponseObject(response.explanation, callDetails.call_timestamp);
    }
  });
}

let response_object = {
  explaination: "",
  timeStamp: "",
};

function getResponseObject() {
  return response_object;
}

function setResponseObject(explaination, timeStamp) {
  response_object.explaination = explaination;
  response_object.timeStamp = timeStamp;
}

async function handleFraud(callDetails, content) {
  // const fraudPhoneNumber = handUpCall(callId);
  // call the victim again and let them know that this is harmful
  updateCall(callDetails.call_id, content);

  // report the incident to the guardian
  createCall(callDetails.guardian, content);
}

function resetFlag() {
  isFraud = false;
}

module.exports = {fraud_check_run, getResponseObject, setResponseObject, resetFlag};
