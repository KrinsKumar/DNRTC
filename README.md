# 📞 Phone-a-Fraud: AI-Powered Scam Call Protection

## 📖 Overview

Phone-a-Fraud is an AI-powered phone call monitoring system designed to protect vulnerable individuals—such as elderly parents, young family members, or anyone at risk—from phone scams.

With Phone-a-Fraud, guardians can enroll their loved ones into a secure call monitoring system, where an intelligent AI agent:
- 🎙️ Detects Scams in Real-Time – Analyzes phone conversations, recognizing phishing keywords and common scam tactics.
- ⚠️ Sends Instant Alerts – Notifies both the user and their guardian when a suspicious call is detected.
- 🔒 Respects Privacy – Operates locally on the device, ensuring personal conversations are not stored or shared.
This ensures that your loved ones stay protected from fraud while maintaining their independence and privacy.

## 🚀 Tech Stack
- 📞 VOIP: Twilio for provisioning phone number and handling VOIP interactions.
- 💻 Frontend: Next.js 
- 🖥️ Backend: Express.js on Node.js, 
- 🗣️ Speech-to-Text & Text-to-Speech: Google Cloud
- ⚡ Real-Time Communication: WebSockets

The flow starts when lets say a scammer calls you. Everything in the conversation is sent to my javascript server which is then sent to google cloud speech to text service using a socket channel.

The transcription is than analyzed which when marked as a scam call triggers a workflow that updates the frontend, cuts the scammer from the call and plays a recording for the user and calls the guarding to report them the details of this incident. 


## 🛠️ Try It Yourself!  
1. **Get a Twilio Account** – Sign up and purchase a phone number (costs less than $2). Once you get the twilio account run the following bash command with the correct values:
```bash
export TWILIO_ACCOUNT_SID=AC...
export TWILIO_AUTH_TOKEN=36...
```
2. **Run the Frontend** – Run the front end and the backend. Using the front end fill out the fields in the form to populate the values in the backend. 
```bash
# front end
cd next-frontend
npm i
npm run dev
```
```bash
# back end
cd js-server
npm i
npm run start
```
3. **You're Set!** – You should have a new phone number from twilio, use that phone number from now onwards. This phone number will act as a mask for your real phone number. All the calls to this phone number will be redirected to you as it was your number which it is!!.

**BOOM!** No more scam calls slipping through! 🎉  
