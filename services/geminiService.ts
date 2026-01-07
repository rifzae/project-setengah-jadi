
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Sale } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getBusinessInsights = async (products: Product[], sales: Sale[]) => {
  const prompt = `
    Analyze the following retail data and provide 3-4 actionable business insights.
    Products: ${JSON.stringify(products.map(p => ({ name: p.name, stock: p.stock, hpp: p.costPrice })))}
    Recent Sales Summary: Total Sales Count: ${sales.length}, Total Revenue: ${sales.reduce((acc, s) => acc + s.totalAmount, 0)}
    
    Focus on:
    1. Low stock warnings.
    2. Most profitable products (HPP vs Selling Price).
    3. Potential sales trends or recommendations for improvement.
    
    Format the output as a clean bulleted list in Indonesian.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Maaf, sistem AI sedang sibuk. Silakan coba lagi nanti.";
  }
};
