require('dotenv').config();

class CallState {
  constructor() {
      this.inbound_transcript = "";
      this.call_id = "";
      // number to route the number to
      this.phone_number = process.env.PHONE_NUMBER;
      this.call_timestamp = "";
      // guardian phone number
      this.guardian = "";
      this.name = process.env.DEFAULT_NAME;
      // users phone number
      this.my_phone = "";
      // a response generated for the front end
      this.responseObject = {
        explanation: "",
        timeStamp: "",
        number: "",
        remediation: ""
      }
  }

  setFromCallRequestBody(callRequest) {
    // set phone number
    if (callRequest.phone !== "") {
      this.my_phone = callRequest.phone.replace(
        /(\d{3})(\d{3})(\d{4})/,
        "$1-$2-$3"
      );
    } else {
      this.my_phone = process.env.DEFAULT_PROSPECT_NUMBER;
    }

    // set name
    this.name = callRequest.name;

    // set guardian
    if (callRequest.guardian !== "") {
      this.guardian = callRequest.guardian;
    } else {
      this.guardian = process.env.DEFAULT_GUARDIAN_NUMBER
    }
  }

  setFromTwilioRequestBody(callRequest) {
    this.call_id = callRequest.CallSid;
    this.call_timestamp = callRequest.Timestamp;
  }

  resetState() {
    this.inbound_transcript = "";
    this.call_id = "";
    this.call_timestamp = "";
    console.log(this.getCallDetails());
  }

  resetResponseObject() {
    this.responseObject.explanation = "";
    this.responseObject.timeStamp = "";
    this.responseObject.number = "";
    this.responseObject.remediation = "";
  }

  setResponseObject(explanation, timeStamp, phone_number, remediation) {
    if (timeStamp !== "") {
      const date = new Date(timeStamp);
      timeStamp = date.toISOString().split('T')[0];
    }
    this.responseObject.explanation = explanation;
    this.responseObject.timeStamp = timeStamp;
    this.responseObject.number = phone_number;
    this.responseObject.remediation = remediation;
  }

  getCallDetails() {
    return {
      inbound_transcript: this.inbound_transcript,
      call_id: this.call_id,
      call_timestamp: this.call_timestamp,
      phone_number: this.phone_number,
      guardian: this.guardian,
      name: this.name,
      my_phone: this.my_phone
    };
  }


  // all getters and setters
  getInboundTranscript() {
    return this.inbound_transcript;
  }

  setInboundTranscript(inbound_transcript) {
    console.log(inbound_transcript);
    this.inbound_transcript += inbound_transcript;
  }

  getCallId() {
    return this.call_id;
  }

  setCallId(call_id) {
    this.call_id = call_id;
  }

  getPhoneNumber() {
    return this.phone_number;
  }

  setPhoneNumber(phone_number) {
    this.phone_number = phone_number;
  }

  getCallTimestamp() {
    return this.call_timestamp;
  }

  setCallTimestamp(call_timestamp) {
    this.call_timestamp = call_timestamp;
  }

  getGuardian() {
    return this.guardian;
  }

  setGuardian(guardian) {
    this.guardian = guardian;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getMyPhone() {
    return this.my_phone;
  }

  setMyPhone(my_phone) {
    this.my_phone = my_phone;
  }

  getResponseObject() { 
    return this.responseObject;
  }
}

module.exports = CallState;