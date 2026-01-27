
import { GoogleGenAI } from "@google/genai";

/**
 * Fetches real-time store information, reviews, and location data 
 * using Gemini 2.5 Flash with Maps Grounding.
 */
export const getStoreInfo = async (userLat?: number, userLng?: number) => {
  // Always initialize GoogleGenAI right before the call as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const toolConfig = userLat && userLng ? {
    retrievalConfig: {
      latLng: {
        latitude: userLat,
        longitude: userLng
      }
    }
  } : undefined;

  try {
    // Maps grounding is supported in Gemini 2.5 series models
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Using Google Maps, find the business 'Smart Duka Electronics' associated with this link: https://share.google/wOIHfoayUyowje5RN (located at Smart House, Kimathi Street, Nairobi). Extract real customer review snippets (reviewSnippets) and the official URI. Provide a concise summary of the business including its reputation based on the real reviews found.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig
      },
    });

    // Access .text property directly (do not call text() as a method)
    const text = response.text || "Smart Duka Electronics is Nairobi's leading hub for genuine Hisense and Apple products, located at Smart House, Kimathi Street.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract URIs and Review Snippets from grounding chunks as per system requirements
    const mapsData = groundingChunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        uri: chunk.maps.uri,
        title: chunk.maps.title || "View on Google Maps",
        // Extracting actual review snippets from the tool's response metadata as required for Maps Grounding
        reviews: chunk.maps.placeAnswerSources?.reviewSnippets?.map((r: any) => r.text) || []
      }));

    return { text, mapsData };
  } catch (error) {
    console.error("Gemini Grounding Error:", error);
    return {
      text: "Smart Duka Electronics is Nairobi's premium destination for genuine Hisense TVs and Apple stock, located on Kimathi Street at Smart House.",
      mapsData: []
    };
  }
};
