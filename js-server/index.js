const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

// import fraud workflow
const {fraud_check_run, getResponseObject, setResponseObject, resetFlag} = require("./fraud_workflow");

// set up the server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

// set up Google Speech to Text
const speech = require("@google-cloud/speech");
const { get } = require("http");
const client = new speech.SpeechClient();

// set up the variables
let callDetails = {
  inbound_transcript: "",
  call_id: "",
  phone_number: "437-971-2422",
  call_timestamp: "",
  guardian: "4373440438",
  name: "Omar",
  my_phone: ""
};

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
              callDetails.inbound_transcript += data.results[0].alternatives[0].transcript;
              console.log(callDetails.inbound_transcript);
              fraud_check_run(callDetails);
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
        callDetails.inbound_transcript = "";
        callDetails.call_id = "";
        callDetails.call_timestamp = "";
        console.log(callDetails);
        recognizeStream.destroy();
        resetFlag();
        break;
    }
  });
});

//Handle HTTP Request
app.get("/", (req, res) => res.send(callDetails.inbound_transcript));

app.post("/", (req, res) => {
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Start>
        <Stream url="wss://${req.headers.host}/" statusCallback="https://${req.headers.host}/call" track="outbound_track"/>
      </Start>
      <Dial>${callDetails.phone_number}</Dial>
      <Pause length="60" />
    </Response>
  `);
});

app.post("/call", (req, res) => {
  const { CallSid, Timestamp } = req.body;
  callDetails.call_id = CallSid;
  callDetails.call_timestamp = Timestamp;
  res.sendStatus(200);
});

app.post("/info", (req, res) => {
  const body = req.body;
  callDetails.my_phone = body.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  callDetails.name = body.name;
  callDetails.guardian = body.guardian;
  console.log(callDetails);
  res.sendStatus(200);
});


app.get('/status', (req, res) => {
  let response = getResponseObject();
  let new_response = {
    explaination: response.explaination,
    date: response.timeStamp,
    number: response.number
  }
  setResponseObject("", "", "");
  res.send(new_response);
});

console.log("Listening at Port 8080");
server.listen(8080);
