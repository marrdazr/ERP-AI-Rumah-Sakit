import { GoogleGenAI, Type } from "@google/genai";
import { ClinicalNote, ICDCode, InventoryItem, PredictionResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// 1. AI for ICD-10 Codification
export const analyzeClinicalNote = async (noteText: string): Promise<ICDCode[]> => {
  if (!apiKey) return [];

  const prompt = `
    Analyze the following clinical note and extract relevant ICD-10 diagnosis codes.
    Clinical Note: "${noteText}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING, description: "The ICD-10 code" },
              description: { type: Type.STRING, description: "Description of the diagnosis" },
              confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" }
            },
            required: ["code", "description"]
          }
        }
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as ICDCode[];
  } catch (error) {
    console.error("Gemini ICD Analysis Failed:", error);
    return [];
  }
};

// 2. AI for Pharmacy Stock Prediction
export const predictStockNeeds = async (items: InventoryItem[]): Promise<PredictionResult[]> => {
  if (!apiKey) return [];

  // Simplify data for token efficiency
  const stockData = items.map(i => ({
    id: i.id,
    name: i.name,
    stock: i.stockLevel,
    history: i.monthlyUsage, // Last 6 months usage
    expiry: i.expiryDate
  }));

  const prompt = `
    Analyze the stock levels and 6-month usage history for these pharmaceutical items. 
    Predict the demand for next month and recommend action.
    Context: Current month is October. Be sensitive to trends.
    Data: ${JSON.stringify(stockData)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              itemId: { type: Type.STRING },
              itemName: { type: Type.STRING },
              predictedDemand: { type: Type.NUMBER },
              recommendation: { type: Type.STRING, description: "Actionable advice (e.g., 'Order 50 units immediately')" },
              reasoning: { type: Type.STRING, description: "Why this recommendation was made" }
            },
            required: ["itemId", "predictedDemand", "recommendation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as PredictionResult[];
  } catch (error) {
    console.error("Gemini Stock Prediction Failed:", error);
    return [];
  }
};

// 3. Conversational Assistant
export const chatWithERP = async (history: {role: 'user' | 'model', text: string}[], newMessage: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are Nexus, an advanced Hospital ERP Assistant. 
        You have access to simulated data regarding:
        - Total AR (Accounts Receivable)
        - Bed Occupancy Rates (BOR)
        - Stock levels of critical drugs
        - Patient admission stats.
        
        Answer queries professionally, concisely, and use a data-driven tone.
        If asked about specific numbers, simulate realistic hospital metrics.
        Current Date: October 2025.
        Currency: IDR / USD.`
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I processed that, but have no textual response.";
  } catch (error) {
    console.error("Gemini Chat Failed:", error);
    return "I am currently unable to process your request due to a connection issue.";
  }
};