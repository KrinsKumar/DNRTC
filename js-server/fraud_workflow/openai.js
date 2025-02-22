const { OpenAI } = require("openai");
const openai = new OpenAI();

async function detectCallIntent(inbound_transcript) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an advanced AI designed to analyze live call transcripts from the caller's side. Your task is to determine whether the call involves a scam, phishing attempt, cyber attack, or any other form of fraudulent or harmful activity.  
      If any suspicious activity is detected, return a JSON response in the following format:  
      {
        \"scam_detected\": boolean,  
        \"scam_text\": string,
        \"explaination\": string,

      }  
      - "scam_detected": Set to "true" if the call appears to be a scam; otherwise, set to "false".  
      - "scam_text": Provide the exact portion of the transcript that indicates fraudulent or suspicious behavior.  
      
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