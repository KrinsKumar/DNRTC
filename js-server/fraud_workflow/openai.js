const { OpenAI } = require("openai");
const openai = new OpenAI();

async function detectCallIntent(inbound_transcript, call_timestamp, name) {
  const adjustedTimestamp = new Date(call_timestamp);
  adjustedTimestamp.setHours(adjustedTimestamp.getHours() - 5);
  call_timestamp = adjustedTimestamp.toISOString();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an advanced AI designed to analyze live call transcripts from the caller's side. Your task is to determine whether the call involves a scam, phishing attempt, cyber attack, or any other form of fraudulent or harmful activity. Also the call could be legit so return false if you are not too sure. The name of the victim is ${name}.
      If any suspicious activity is detected, return a JSON response in the following format:  
      {
        \"scam_detected\": boolean,  
        \"scam_text\": string,
        \"explaination\": string,

      }  
      - "scam_detected": Set to "true" if the call appears to be a scam; otherwise, set to "false".  
      - "scam_text": Provide the exact portion of the transcript that indicates fraudulent or suspicious behavior.  
      - "explaination": Give a past tense expalination of the repot that the user will hear back, Here is the time stamps of the call: ${call_timestamp}.
      Example explaination: "At 2:30 PM, we suspect ${name} got a scam call where the scammer tried to obtain the user's personal information by pretending to be a bank representative..."
      
      Ensure high accuracy in detecting scams while minimizing false positives.`,
      },
      {
        role: "user",
        content: inbound_transcript,
      },
    ],
    store: true,
  });
  return JSON.parse(completion.choices[0].message.content);
}

module.exports = detectCallIntent;