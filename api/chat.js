import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are the Jarurat AI Clinical Trial Assistant, an empathetic, highly knowledgeable AI assistant for Jarurat Care, an NGO in India.
Your goal is to guide patients and caregivers on how to find oncology clinical trials and offer support.
Always remain professional, warm, and clear. Do not provide definitive medical diagnoses; always advise consulting a doctor.

CRITICAL SAFETY RULE: NEVER invent, generate, or hallucinate specific clinical trial names, locations, or eligibility criteria. 
If the user mentions specific cancers (like breast, lung, leukemia, etc.), you must instruct them to search the official Clinical Trials Registry - India (CTRI) at ctri.nic.in or clinicaltrials.gov, and explain what keywords they should use for their condition.

If they ask about cost, mention that trials usually cover study drugs and offer financial counselors.
If they ask for support, mention Jarurat Care's free caregiver mentorship programs and counseling.

Keep your responses concise and readable for a chat interface.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
       return res.status(500).json({ error: 'API key is missing on the server' });
    }

    // Initialize the model with system instruction
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });
    
    // Format history for Gemini API (user / model)
    const formattedHistory = history.map(msg => ({
      role: msg.type === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.warn('Gemini API Error, falling back to simulated response:', error.message);
    
    // Fallback logic for mock/invalid keys
    const lowerInput = req.body.message.toLowerCase().trim();
    let fallbackResponse = "[Demo Mode - Live matching unavailable] I'm analyzing your request...";

    if (lowerInput === 'hi' || lowerInput === 'hello' || lowerInput === 'hey') {
      fallbackResponse = "[Demo Mode] Hello! I am the Jarurat AI assistant. How can I help you find information about clinical trials today?";
    } else if (lowerInput.includes('breast') || lowerInput.includes('brca')) {
      fallbackResponse = "[Demo Mode] For breast cancer or BRCA-related trials, I strongly recommend searching the official Clinical Trials Registry - India (CTRI) at ctri.nic.in. Use keywords like 'Breast Cancer' and 'BRCA'.";
    } else if (lowerInput.includes('lung') || lowerInput.includes('nsclc')) {
      fallbackResponse = "[Demo Mode] To find lung cancer or NSCLC trials, please search the official CTRI registry (ctri.nic.in) or ask your oncologist about immunotherapy options currently available in India.";
    } else if (lowerInput.includes('leukemia') || lowerInput.includes('blood')) {
      fallbackResponse = "[Demo Mode] For leukemia and blood cancers, official registries like clinicaltrials.gov or CTRI (ctri.nic.in) list active trials, including CAR-T therapies. Please consult your hematologist for guidance.";
    } else if (lowerInput.includes('cost') || lowerInput.includes('money') || lowerInput.includes('pay')) {
      fallbackResponse = "[Demo Mode] Clinical trials generally cover the cost of the study drug and related medical care. In many cases, travel expenses are also reimbursed. Would you like me to connect you with our financial counselor?";
    } else if (lowerInput.includes('caregiver') || lowerInput.includes('support') || lowerInput.includes('help')) {
      fallbackResponse = "[Demo Mode] Taking care of a loved one is challenging. Jarurat Care offers free counseling, caregiver mentorship programs, and support groups. You can join our next virtual session this Friday.";
    } else {
      fallbackResponse = "[Demo Mode] I understand. To give you the most accurate guidance, please search the official CTRI registry (ctri.nic.in) using your specific cancer type and stage.";
    }

    res.status(200).json({ response: fallbackResponse });
  }
}
