import { GoogleGenAI, Type } from "@google/genai";

const getAi = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
    throw new Error("An API Key must be set to use Gemini features.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateHindiArticle(topic: string) {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Write a comprehensive, SEO-friendly Hindi blog post about: ${topic}. 
    Ensure it follows E-E-A-T guidelines, has a clear heading structure (H1, H2, H3), and uses short paragraphs for readability.`,
    config: {
      systemInstruction: `You are a professional Hindi news editor specializing in SEO. Output your response as high-quality JSON according to the schema.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          summary: { type: Type.STRING },
          seoTitle: { type: Type.STRING },
          seoDescription: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          slug: { type: Type.STRING }
        },
        required: ['title', 'content', 'summary', 'seoTitle', 'seoDescription', 'excerpt', 'slug']
      }
    }
  });

  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr.trim());
}

export async function generateHindiFromSource(sourceTitle: string, sourceSnippet: string) {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Transform the following news source into a unique, high-quality, and SEO-optimized Hindi blog post.
    
    SOURCE DATA:
    Title: ${sourceTitle}
    Snippet: ${sourceSnippet}

    STRICT GUIDELINES:
    1. CONTENT: Strictly in Hindi. Minimum 700 words.
    2. STRUCTURE: Use H1, H2, H3. Include 1 comparison table and at least 2 "Key Takeaway" boxes (use <div class="bg-orange-50 border-l-4 border-orange-600 p-4 my-4 font-bold">...</div>).
    3. IMAGES: Place [IMAGE_PLACEHOLDER_0] and [IMAGE_PLACEHOLDER_1] at relevant points in the content.
    4. INTERACTIVE: Use bulleted lists.
    5. INTERNAL LINKS: Naturally integrate 3-5 mock internal links (e.g., <a href="/blog/tech-india">...</a>).
    6. SCHEMA: Provide Article and FAQ Schema as valid JSON strings.
    7. SEO: Compelling title (under 60 chars), meta description (155 chars), and descriptive English slug.
    8. E-E-A-T: Professional Hindi author bio.`,
    config: {
      systemInstruction: `You are a world-class SEO strategist and Hindi journalist. Create "People-First" content. Provide output in strict JSON format.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING, description: 'HTML with [IMAGE_PLACEHOLDER_N]' },
          imageConfigs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING, description: 'English prompt for Gemini Image' },
                altText: { type: Type.STRING, description: 'Hindi Alt text with keywords' }
              },
              required: ['prompt', 'altText']
            }
          },
          faqSchema: { type: Type.STRING, description: 'JSON-LD string' },
          articleSchema: { type: Type.STRING, description: 'JSON-LD string' },
          summary: { type: Type.STRING },
          seoTitle: { type: Type.STRING },
          seoDescription: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          slug: { type: Type.STRING },
          authorBio: { type: Type.STRING }
        },
        required: ['title', 'content', 'imageConfigs', 'faqSchema', 'articleSchema', 'summary', 'seoTitle', 'seoDescription', 'excerpt', 'slug', 'authorBio']
      }
    }
  });

  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr.trim());
}

export async function generateHindiCover(prompt: string) {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `High quality cinematic digital art: ${prompt}. Modern, clean, professional, realistic, no text.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  
  return null;
}

export async function generateLegalDoc(type: 'Privacy Policy' | 'Terms & Conditions' | 'Disclaimer', lang: 'hi' | 'en') {
  const ai = getAi();
  const prompt = lang === 'hi' 
    ? `Create a comprehensive, professional, and GDPR-compliant ${type} for 'GajabNews' (gajabnews.in). Use clear, layered Hindi. Include sections on data collection, user rights, and legal justification.`
    : `Create a comprehensive, professional, and GDPR-compliant ${type} for 'GajabNews' (gajabnews.in). Use clear, layered English. Include sections on data collection, user rights, and legal justification.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `You are a legal expert specializing in digital compliance and GDPR. Output valid HTML content.`,
    }
  });

  return response.text || `<p>Error generating ${type}</p>`;
}

export async function analyzeComment(content: string) {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following comment for moderation.
    Comment: "${content}"
    
    Rules:
    1. If it contains hate speech, profanity, or spam links, status is 'Spam'.
    2. Otherwise, status is 'Approved' (assuming auto-approval) or 'Pending'.
    3. Sentiment must be 'Positive', 'Neutral', or 'Negative'.`,
    config: {
      systemInstruction: `You are an AI Moderator. Analyze the user comment and return a JSON object.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ['Approved', 'Spam', 'Pending'] },
          sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative'] }
        },
        required: ['status', 'sentiment']
      }
    }
  });

  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr.trim());
}