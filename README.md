# Phone-a-Fraud  
**Protecting Loved Ones from Phone Scams**  

## 📖 Overview  
Phone-a-Fraud is an AI-powered phone call monitoring system designed to protect vulnerable individuals—like elderly parents or young family members—from phone scams.  

With **Phone-a-Fraud**, guardians can onboard their loved ones to a secure call monitoring system where an intelligent agent:  
- **🎙️ Detects Scams in Real-Time** – Listens for phishing keywords and scam patterns.  
- **⚠️ Sends Instant Alerts** – Notifies users and their guardians when a suspicious call is detected.  
- **🔒 Respects Privacy** – Runs locally without storing personal conversations.  

This ensures your loved ones stay protected without compromising their independence.  


## 🚀 Tech Stack  
- **📞 VOIP:** Twilio  
- **💻 Frontend:** Next.js  
- **🖥️ Backend:** Express  
- **🗣️ Speech-to-Text & Text-to-Speech:** Google Cloud  


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
