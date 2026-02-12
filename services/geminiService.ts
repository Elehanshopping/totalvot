
import { GoogleGenAI, Type } from "@google/genai";

export const fetchElectionUpdates = async (query: string = "Bangladesh 13th National Parliamentary Election 12 February 2026 latest news results projections"): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the most accurate and verified reports concerning the "ত্রয়োদশ জাতীয় সংসদ নির্বাচন" (13th National Parliamentary Election) of Bangladesh, specifically focusing on the date "১২ ফেব্রুয়ারি ২০২৬". 
                 
                 IMPORTANT INSTRUCTIONS:
                 1. DO NOT provide fake or hallucinated results. If the data for a specific constituency is not available, state the status as 'Pending'.
                 2. PROVIDE A NATIONAL OVERVIEW. Include results from Dhaka, Chittagong, Sylhet, Rajshahi, Khulna (including Bagerhat), and Barisal. 
                 3. Ensure the summary reflects the actual national standing based on current search results and news bulletins.
                 4. Identify major party names correctly (e.g., Bangladesh Awami League, BNP, Jatiya Party, etc., or current active political entities).
                 5. The 'featuredResults' should include at least 8-10 major constituencies from different divisions to show a true national picture.
                 6. If this is a future projection, clearly label the status as 'Projection' or 'Counting'.`,
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
            newsFlash: { type: Type.STRING, description: "A one-sentence current headline" }
          }
        }
      },
    });

    const jsonStr = response.text.trim();
    const data = JSON.parse(jsonStr);
    
    // Extract grounding sources to ensure transparency
    const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(
      (chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title
      })
    ).filter((item: any) => item.uri) || [];
    
    return { ...data, groundingSources };
  } catch (error) {
    console.error("Error fetching national election data:", error);
    throw error;
  }
};
