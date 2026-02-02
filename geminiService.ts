
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per SDK guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHindiBlogContent = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a comprehensive, SEO-friendly Hindi blog post about "${topic}". 
    The post should be approximately 600 words. 
    Include:
    1. A catchy Headline (H1)
    2. An SEO Meta Title and Description
    3. Three main subheadings (H2)
    4. Engaging content in Hindi
    5. A 2-sentence summary for an "AI Summary" box.
    Output the result in a valid JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          summary: { type: Type.STRING },
          seoTitle: { type: Type.STRING },
          seoDescription: { type: Type.STRING },
        },
        required: ["title", "content", "summary", "seoTitle", "seoDescription"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateBlogImage = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `High quality editorial blog cover image for: ${prompt}. Modern, high energy, vibrant colors.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
