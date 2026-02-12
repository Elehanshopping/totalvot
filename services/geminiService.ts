
import { GoogleGenAI, Type } from "@google/genai";

const cleanJson = (text: string) => {
  return text.replace(/```json\n?|```/g, "").trim();
};

export const fetchElectionUpdates = async (): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for and analyze the latest reports from this specific URL: https://www.hindustantimes.com/world-news/bangladesh-election-2026-live-updates-voting-results-bnp-tarique-rahman-jamaat-sheikh-hasina-yunus-parliamentary-dhaka-101770854350046.html
                 
                 STRICT AUDIT & EXTRACTION REQUIREMENTS:
                 1. PRIMARY SOURCE: Use the live coverage from Hindustan Times linked above for real-time seat counts, party leads, and breaking updates for the 13th Bangladesh Parliamentary Election.
                 2. SECONDARY VERIFICATION: Cross-reference with the Bangladesh Election Commission (EC) to ensure zero hallucination.
                 3. PARTIES: Report on BNP, Jamaat-e-Islami, Jatiya Party, Awami League, and Independents.
                 4. SCOPE: Provide national summary and featured results for major seats (Dhaka-10, Bagerhat-1,2,3,4, Chittagong, etc.).
                 5. NO HALLUCINATION: If the specific URL does not have data for a seat yet, mark it as 'Pending' or 'Counting'.
                 6. DATA STRUCTURE: Must strictly follow the JSON schema provided.`,
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
    
    // Extract verified sources for trust, specifically looking for the Hindustan Times link
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
      newsFlash: "Hindustan Times লাইভ সোর্স থেকে ডাটা লোড হচ্ছে না। পুনরায় চেষ্টা করা হচ্ছে...",
      groundingSources: []
    };
  }
};
