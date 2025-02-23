const { OpenAI } = require("openai");
const openai = new OpenAI();

async function detectCallIntent(inbound_transcript, call_timestamp, name) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an AI designed to analyze live call transcripts from the caller's side. Your task is to determine whether the call involves any form of suspicious activity, such as a scam, phishing attempt, cyber attack, or other potentially harmful behavior. If you're unsure, it's okay to return "false" and indicate that there was no clear evidence of fraudulent activity. The name of the person on the call is ${name}.
        
        If you detect something suspicious, return a JSON response in the following format:
        {
          \"scam_detected\": boolean,
          \"scam_text\": string,
          \"explanation\": string
        }
      
        - "scam_detected": Set to "true" if there's a noticeable indication of a scam, phishing, or similar activity; otherwise, set to "false".  
        - "scam_text": Provide the portion of the transcript that raised suspicion or might suggest fraudulent behavior.  
        - "explanation": "At ${call_timestamp}, there was a possibility that ${name} received a call where the person on the other end tried to gather personal information by pretending to be from the bank..."
        for context the time of the call was ${call_timestamp}
        Make sure that you are returning a JSON with correct time stamp format of hour : minute.`,
      },
      {
        role: "user",
        content: inbound_transcript,
      },
    ],
    store: true,
  });
  const responseContent = completion.choices[0].message.content;
  if (responseContent.startsWith("```json")) {
    completion.choices[0].message.content = responseContent.slice(7, -3).trim();
  }
  return JSON.parse(completion.choices[0].message.content);
}

async function getFixes(content) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an AI designed to get the scam incident reporst. Your job is to provide remidation steps to the user. 
        , return in JSON {remediation: string} only return in JSON and nothing else add <br> where the points are breaking`,

      },
      {
        role: "user",
        content: content,
      },
    ],
    store: true,
  });
  const responseContent = completion.choices[0].message.content;
  if (responseContent.startsWith("```json")) {
    completion.choices[0].message.content = responseContent.slice(7, -3).trim();
  }
  let json_response = JSON.parse(completion.choices[0].message.content);
  console.log(json_response);
  console.log(json_response.remediation);
  return json_response.remediation;
}

module.exports = {detectCallIntent, getFixes};
