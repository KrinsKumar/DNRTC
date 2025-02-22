const WebSocket = require("ws");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const wss_inbound = new WebSocket.Server({ server, path: "/inbound" });

//Include Google Speech to Text
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();
let inbound_transcript = "";
let outbound_transcript = "";

//Configure Transcription Request
const request = {
  config: {
    encoding: "MULAW",
    sampleRateHertz: 8000,
    languageCode: "en-US",
  },
  interimResults: true,
};

// Handle Web Socket Connection
wss_inbound.on("connection", function connection(ws) {
  console.log("New INBOUND Connection Initiated");

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
            console.log("INBOUND:" + data.results[0].alternatives[0].transcript);
            if (data.results[0].alternatives[0].confidence > 0.3) {
              inbound_transcript += data.results[0].alternatives[0].transcript
            }
          });
        break;
      case "start":
        console.log(`Starting Media Stream ${msg.streamSid}`);
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
        recognizeStream.destroy();
        break;
    }
  });
});

wss_outbound.on("connection", function connection(ws) {
  console.log("New OUTBOUND Connection Initiated");

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
            console.log("OUTBOUND:" + data.results[0].alternatives[0].transcript);
            if (data.results[0].alternatives[0].confidence > 0.3) {
              outbound_transcript += data.results[0].alternatives[0].transcript
            }
          });
        break;
      case "start":
        console.log(`Starting Media Stream ${msg.streamSid}`);
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
        recognizeStream.destroy();
        break;
    }
  });
});

//Handle HTTP Request
app.get("/", (req, res) => res.send("Hello World"));

app.post("/", (req, res) => {
  res.set("Content-Type", "text/xml");

  res.send(`
    <Response>
      <Start>
        <Stream url="wss://${req.headers.host}/outbound" track="outbound_track"/>
      </Start>
      <Start>
        <Stream url="wss://${req.headers.host}/inbound" track="inbound_track"/>
      </Start>
      <Dial>437-971-2422</Dial>
      <Pause length="5" />
    </Response>
  `);
});

console.log("Listening at Port 8080");
server.listen(8080);
