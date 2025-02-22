const WebSocket = require("ws");
const express = require("express");
const url = require("url");

// import fraud workflow
const fraud_check_run = require("./fraud_workflow");

// set up the server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

// set up Google Speech to Text
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();

// set up the variables
let inbound_transcript = "";
let call_id = "";
let phone_number = "";

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
          .on("data", (data) => {
            console.log(data.results[0].alternatives[0].transcript);
            if (data.results[0].alternatives[0].confidence > 0.3) {
              inbound_transcript += data.results[0].alternatives[0].transcript;
              console.log(inbound_transcript);
              fraud_check_run(inbound_transcript, call_id);
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
        inbound_transcript = "";
        call_id = "";
        recognizeStream.destroy();
        break;
    }
  });
});

//Handle HTTP Request
app.get("/", (req, res) => res.send(inbound_transcript));

app.post("/", (req, res) => {
  res.set("Content-Type", "text/xml");
  if (!phone_number) {
    phone_number = "437-971-2422";
  }

  res.send(`
    <Response>
      <Start>
        <Stream url="wss://${req.headers.host}/" statusCallback="https://${req.headers.host}/call"/>
      </Start>
      <Dial>${phone_number}</Dial>
      <Pause length="60" />
    </Response>
  `);
});

app.post("/call", (req, res) => {
  const { CallSid } = req.body;
  call_id = CallSid;
  res.sendStatus(200);
});

console.log("Listening at Port 8080");
server.listen(8080);
