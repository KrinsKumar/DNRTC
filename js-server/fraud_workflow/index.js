
// import my functions
const detectCallIntent = require("./openai");
const handUpCall = require("./twilio");

async function fraud_check_run(inbound_transcript, callId) {
  detectCallIntent(inbound_transcript).then((response) => {
    console.log(response);
    if (response.scam_detected) {
      handleFraud(callId);
    }
  });
}

function handleFraud(callId) {
  // hang up the call
  handUpCall(callId);

  // report the incident to the guardian

  // call the victim again and let them know that this is harmful

  // block the number
  
  // make a case of this incident on the dashboard
}

module.exports = fraud_check_run;
