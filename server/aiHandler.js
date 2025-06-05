// server/aiHandler.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const moodListAudius="[Aggressive, Brooding, Cool, Defiant, Easygoing, Empowering, Energizing, Excited, Fiery, Melancholy, Other, Peaceful, Romantic, Sensual, Sentimental, Serious, Sophisticated, Stirring, Tender, Upbeat, Yearning]"
const SYSTEMPROMPT=`You are a helpful assistant that creates mood-based music search prompts. When the user describes how they are feeling or shares their mood (e.g., “I feel nostalgic”, “I'm angry”, or “romantic and chill”), your job is to extract three keyword that exactly describes the users emotional state from this list of moods ${moodListAudius}. The returned list should follow the given pattern (e.g., [happy,bright,chill]. You are to just return the list no explaination nothing else, just the list of keywords. It is extremely important that you do not add quotes to the returned list (like, ['happy','sad','energy']`



const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API,

});
export async function getMoodList(mood) {
  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1-0528:free",
    messages: [
      {
        "role": "system",
        "content": SYSTEMPROMPT
      },
      {
        "role":"user",
        "content":mood
      }
    ],
    
  });
  return(completion.choices[0].message.content);
}


