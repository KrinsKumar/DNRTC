const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

// import fraud workflow
const {
  fraud_check_run,
  resetFlag,
} = require("./fraud_workflow");
const { getFixes } = require("./fraud_workflow/openai");
const CallState = require("./state");

// set up the express http server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up the web socket server
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

// set up Google Speech to Text
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();

// set up the variables
const callState = new CallState();

// configure Transcription Request
const request = {
  config: {
    encoding: "MULAW",
    sampleRateHertz: 8000,
    languageCode: "en-GB",
  },
  interimResults: true,
};

// Handle Web Socket Connection
wss.on("connection", function connection(ws) {
  console.log("New Connection Initiated");
  let recognizeStream = null;

  ws.on("message", function incoming(message) {
    const msg = JSON.parse(message);
    switch (msg.event) {
      case "connected":
        console.log(`A new call has connected.`);

        // Create Stream to the Google Speech to Text API
        recognizeStream = client
          .streamingRecognize(request)
          .on("error", console.error)
          .on("data", async (data) => {
            if (data.results[0].alternatives[0].confidence > 0.3) {
              callState.setInboundTranscript(
                data.results[0].alternatives[0].transcript
              );
              fraud_check_run(callState);
            }
          });
        break;
      case "start":
        break;
      case "media":
        if (recognizeStream && !recognizeStream.destroyed) {
          recognizeStream.write(msg.media.payload);
        } else {
          console.error("Recognize stream is not initialized.");
        }
        break;
      case "stop":
        console.log(`Call Has Ended`);
        callState.resetState();
        resetFlag();
        break;
    }
  });
});

// to update the state of the backend called from Twilio
app.post("/call", (req, res) => {
  callState.setFromTwilioRequestBody(req.body);
  res.sendStatus(200);
});

// to update the state of the backend called from the frontend
app.post("/info", (req, res) => {
  callState.setFromCallRequestBody(req.body);
  res.sendStatus(200);
});

// send the instruction of the first call
app.post("/", (req, res) => {
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Start>
        <Stream url="wss://${req.headers.host}/" statusCallback="https://${req.headers.host}/call" track="outbound_track"/>
      </Start>
      <Dial>${callState.getPhoneNumber()}</Dial>
      <Pause length="60" />
    </Response>
  `);
});

app.get("/status", async (req, res) => {
  let response = callState.getResponseObject();
  let new_response = {
    explaination: response.explaination,
    date: response.timeStamp,
    number: response.number,
  };
  if (response.explaination !== "") {
    new_response.remediation = await getFixes(response.explaination);
  }

  // reset the resopnse object
  callState.resetResponseObject();
  res.send(new_response);
});

console.log("Listening at Port 8080");
server.listen(8080);
