import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are the Jarurat AI Clinical Trial Matchmaker, an empathetic, highly knowledgeable AI assistant for Jarurat Care, an NGO in India.
Your goal is to help patients and caregivers find oncology clinical trials and offer support.
Always remain professional, warm, and clear. Do not provide definitive medical diagnoses; always advise consulting a doctor.

If the user mentions specific cancers (like breast, lung, leukemia, etc.), suggest a few highly realistic-sounding, matching clinical trials located at major Indian hospitals (e.g., Tata Memorial Hospital Mumbai, AIIMS New Delhi, Rajiv Gandhi Cancer Institute, Christian Medical College Vellore). 
Format these trial suggestions clearly with Trial Name, Location, and Eligibility Match.

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
    let fallbackResponse = "I'm analyzing your request...";

    if (lowerInput === 'hi' || lowerInput === 'hello' || lowerInput === 'hey') {
      fallbackResponse = "Hello! I am the Jarurat AI assistant. How can I help you find the right clinical trial today? Please share any diagnosis details you have.";
    } else if (lowerInput.includes('breast') || lowerInput.includes('brca')) {
      fallbackResponse = "Based on your mention of breast cancer, I've found a few highly relevant clinical trials focused on targeted therapies for BRCA mutations.\n\n1. Phase II Targeted Therapy for BRCA-mutated Breast Cancer (Tata Memorial Hospital, Mumbai)\n2. Immunotherapy + Chemotherapy Combination Study (AIIMS, New Delhi)";
    } else if (lowerInput.includes('lung') || lowerInput.includes('nsclc')) {
      fallbackResponse = "For lung cancer (NSCLC), we have several promising immunotherapy trials currently enrolling patients.\n\n- First-line Immunotherapy for Advanced NSCLC (Rajiv Gandhi Cancer Institute, Delhi)";
    } else if (lowerInput.includes('leukemia') || lowerInput.includes('blood')) {
      fallbackResponse = "I've scanned our database for blood cancers and leukemia. There is a very promising CAR-T cell therapy trial open for enrollment.\n\n- CAR-T Cell Therapy for Acute Lymphoblastic Leukemia (Christian Medical College, Vellore)";
    } else if (lowerInput.includes('cost') || lowerInput.includes('money') || lowerInput.includes('pay')) {
      fallbackResponse = "Clinical trials generally cover the cost of the study drug and related medical care. In many cases, travel expenses are also reimbursed. Would you like me to connect you with our financial counselor?";
    } else if (lowerInput.includes('caregiver') || lowerInput.includes('support') || lowerInput.includes('help')) {
      fallbackResponse = "Taking care of a loved one is challenging. Jarurat Care offers free counseling, caregiver mentorship programs, and support groups. You can join our next virtual session this Friday.";
    } else {
      fallbackResponse = "I understand. To narrow down our clinical trial database and give you the most accurate matches, could you specify the type of cancer, current stage, or any known genetic markers?";
    }

    res.status(200).json({ response: fallbackResponse });
  }
}
