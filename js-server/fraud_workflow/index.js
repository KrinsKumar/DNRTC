
// import my functions
const detectCallIntent = require("./openai");
const { handUpCall, createCall, updateCall} = require("./twilio");

async function fraud_check_run(callDetails) {
  detectCallIntent(callDetails.inbound_transcript, callDetails.call_timestamp).then((response) => {
    console.log(response);
    if (response.scam_detected) {
      handleFraud(callDetails, response.description);
      return true;
    }
    return false;
  });
}
// let callDetails = {
//   inbound_transcript: "",
//   call_id: "",
//   phone_number: "",
//   call_timestamp: "",
//   guardian: "4373440438"
// };

async function handleFraud(callDetails, content) {
  // const fraudPhoneNumber = handUpCall(callId);


  // call the victim again and let them know that this is harmful
  updateCall(callDetails.call_id, content);

  // report the incident to the guardian
  createCall(callDetails.guardian, content);

  // update the frontend dashboard

}

module.exports = fraud_check_run;
