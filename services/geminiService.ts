import { GoogleGenAI, Type } from "@google/genai";
import { Resource, ScheduleItem } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

// Response schema for the structural analysis of the user's intent
const IntentSchema = {
  type: Type.OBJECT,
  properties: {
    found: { type: Type.BOOLEAN, description: "Whether a relevant resource was found in the provided list." },
    resourceId: { type: Type.STRING, description: "The ID of the matching resource, if found.", nullable: true },
    intent: { 
      type: Type.STRING, 
      enum: ["download", "summary", "unknown"], 
      description: "Whether the user wants the file itself ('download') or a summary/cheat-sheet ('summary')." 
    },
    message: { type: Type.STRING, description: "A friendly, natural language response to the student." },
  },
  required: ["found", "intent", "message"],
};

export const processStudentQuery = async (
  query: string,
  resources: Resource[],
  schedule: ScheduleItem[]
): Promise<{
  found: boolean;
  resourceId?: string;
  intent: "download" | "summary" | "unknown";
  message: string;
}> => {
  try {
    const ai = getClient();
    
    // We provide the system with context about time and available data
    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `
      You are 'The Smart Librarian', an AI assistant for university students.
      
      Current Date: ${today}
      
      Class Schedule (to map dates like 'last Tuesday' to topics):
      ${JSON.stringify(schedule)}
      
      Available Resources (Database):
      ${JSON.stringify(resources.map(r => ({ id: r.id, title: r.title, type: r.type, tags: r.tags, topic: r.topic, date: r.dateStr })))}
      
      User Query: "${query}"
      
      Instructions:
      1. Analyze the user's query to understand what topic or date they are referring to.
      2. Match this to the most relevant resource in the Available Resources list.
      3. Determine if they want the file (e.g., "send me", "give me the pdf") or a summary (e.g., "explain", "summarize", "cheat sheet").
      4. If the query implies a date (e.g., "lecture from last week"), use the Schedule to find the topic, then find the resource.
      5. Return a JSON object matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: IntentSchema,
        temperature: 0.1, // Low temperature for deterministic retrieval
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);
    return {
      found: result.found,
      resourceId: result.resourceId ?? undefined,
      intent: result.intent,
      message: result.message
    };

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return {
      found: false,
      intent: "unknown",
      message: "I'm having trouble connecting to the library archives right now. Please try again."
    };
  }
};

export const generateCheatSheet = async (resource: Resource): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      Create a "One-Page Cheat Sheet" based on the following academic resource content.
      The output should be formatted in Markdown.
      Focus on key definitions, formulas, and important bullet points.
      
      Resource Title: ${resource.title}
      Topic: ${resource.topic}
      Content:
      ${resource.content}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Could not generate summary.";

  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Sorry, I couldn't generate the cheat sheet at this moment.";
  }
};