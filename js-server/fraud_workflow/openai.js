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
        "role": "system",
        "content": `You are an AI designed to analyze live call transcripts from the caller's side. Your task is to determine whether the call involves any form of suspicious activity, such as a scam, phishing attempt, cyber attack, or other potentially harmful behavior. If you're unsure, it's okay to return "false" and indicate that there was no clear evidence of fraudulent activity. The name of the person on the call is ${name}.
        
        If you detect something suspicious, return a JSON response in the following format:
        {
          \"scam_detected\": boolean,
          \"scam_text\": string,
          \"explanation\": string
        }
      
        - "scam_detected": Set to "true" if there's a noticeable indication of a scam, phishing, or similar activity; otherwise, set to "false".  
        - "scam_text": Provide the portion of the transcript that raised suspicion or might suggest fraudulent behavior.  
        - "explanation": A brief explanation in the past tense of what happened during the call, referencing the time stamps of the call: ${call_timestamp}.
        
        Example explanation: "At 2:30 PM, there was a possibility that ${name} received a call where the person on the other end tried to gather personal information by pretending to be from the bank..."
      
        Aim for a balanced approach: high accuracy while minimizing unnecessary false positives or overly strict classifications.`
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