
import { GoogleGenAI, Type } from "@google/genai";

const cleanJson = (text: string) => {
  return text.replace(/```json\n?|```/g, "").trim();
};

export const fetchElectionUpdates = async (): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the verified results of the 13th National Parliamentary Election of Bangladesh (held on Feb 12, 2026).
                 
                 STRICT AUDIT REQUIREMENTS:
                 1. SOURCES: Prioritize official data from the Bangladesh Election Commission (EC). Use verified reports from Al Jazeera, BBC, Reuters, and Daily Star. 
                 2. DO NOT include "fake news" or rumors. If a result is unconfirmed, label it 'Counting'.
                 3. PARTIES: Ensure accurate representation for ALL parties, including Bangladesh Awami League (AL), BNP, Bangladesh Jamaat-e-Islami, Jatiya Party (JP), and Independent candidates.
                 4. COVERAGE: Provide a broad national report across all 300 constituencies, not just one district. 
                 5. BAGERHAT: Specifically include seats Bagerhat-1, 2, 3, 4 with candidates like Sheikh Helal Uddin, Sheikh Tonmoy, etc., as per verified data.
                 6. DATA STRUCTURE: Must match the requested JSON schema exactly.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                totalSeats: { type: Type.NUMBER },
                resultsPublished: { type: Type.NUMBER },
                partyStandings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      party: { type: Type.STRING },
                      seatsWon: { type: Type.NUMBER },
                      seatsLeading: { type: Type.NUMBER },
                      color: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            featuredResults: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  constituencyName: { type: Type.STRING },
                  constituencyNo: { type: Type.STRING },
                  status: { type: Type.STRING },
                  candidates: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        party: { type: Type.STRING },
                        votes: { type: Type.NUMBER },
                        symbol: { type: Type.STRING },
                        isLeading: { type: Type.BOOLEAN }
                      }
                    }
                  }
                }
              }
            },
            newsFlash: { type: Type.STRING }
          }
        }
      },
    });

    const rawText = response.text || "";
    if (!rawText) throw new Error("Empty response from AI");
    
    const data = JSON.parse(cleanJson(rawText));
    
    // Extract verified sources for trust
    const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(
      (chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title
      })
    ).filter((item: any) => item.uri) || [];
    
    return { ...data, groundingSources };
  } catch (error) {
    console.error("Election Data Load Error:", error);
    // Return a fallback structure to prevent UI crash
    return {
      summary: { totalSeats: 300, resultsPublished: 0, partyStandings: [] },
      featuredResults: [],
      newsFlash: "ডাটা সংগ্রহে ত্রুটি। ভেরিফাইড সোর্স থেকে পুনরায় চেষ্টা করা হচ্ছে...",
      groundingSources: []
    };
  }
};
