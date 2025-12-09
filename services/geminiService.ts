import { GoogleGenAI, Type } from "@google/genai";
import { ClinicalNote, ICDCode, InventoryItem, PredictionResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// 1. AI for ICD-10 Codification
export const analyzeClinicalNote = async (noteText: string): Promise<ICDCode[]> => {
  if (!apiKey) return [];

  const prompt = `
    Analisis catatan klinis berikut dan ekstrak kode diagnosis ICD-10 yang relevan.
    Catatan Klinis: "${noteText}"
    
    Output harus dalam JSON.
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
              code: { type: Type.STRING, description: "Kode ICD-10" },
              description: { type: Type.STRING, description: "Deskripsi diagnosis dalam Bahasa Indonesia" },
              confidence: { type: Type.NUMBER, description: "Tingkat keyakinan antara 0 dan 1" }
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
    Analisis tingkat stok dan riwayat penggunaan 6 bulan untuk item farmasi ini.
    Prediksi permintaan untuk bulan depan dan berikan rekomendasi.
    Konteks: Bulan saat ini adalah Oktober. Perhatikan tren musiman.
    Berikan output dalam Bahasa Indonesia.
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
              recommendation: { type: Type.STRING, description: "Saran tindakan (contoh: 'Pesan 50 unit segera')" },
              reasoning: { type: Type.STRING, description: "Alasan mengapa rekomendasi ini dibuat" }
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
  if (!apiKey) return "API Key belum dikonfigurasi.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `Anda adalah Nexus, Asisten ERP Rumah Sakit yang canggih.
        Anda memiliki akses ke data simulasi mengenai:
        - Total AR (Piutang Usaha)
        - Tingkat Okupansi Tempat Tidur (BOR)
        - Tingkat stok obat-obatan kritis
        - Statistik penerimaan pasien.
        
        Jawablah pertanyaan secara profesional, ringkas, dan gunakan nada berbasis data.
        Gunakan Bahasa Indonesia yang formal dan sopan.
        Tanggal Saat Ini: Oktober 2025.
        Mata Uang: IDR (Rupiah).`
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Saya telah memproses itu, tetapi tidak ada respons tekstual.";
  } catch (error) {
    console.error("Gemini Chat Failed:", error);
    return "Maaf, saya tidak dapat memproses permintaan Anda saat ini karena masalah koneksi.";
  }
};