

import { GoogleGenAI, Type } from "@google/genai";
import { Category } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const categories = Object.values(Category);

export const categorizeExpense = async (description: string): Promise<Category> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Categorize the following expense: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: `The most relevant category for the expense. Must be one of: ${categories.join(', ')}.`,
              enum: categories,
            },
          },
          required: ["category"],
        },
        systemInstruction: `You are an expert expense categorization engine. Given a list of possible categories and an expense description, you must assign the most relevant category. Your response must be a valid JSON object matching the provided schema.`
      },
    });

    const jsonString = response.text;
    if (!jsonString) {
      return Category.Other;
    }
    
    const parsed = JSON.parse(jsonString);
    const categoryValue = parsed.category;
    
    if (categories.includes(categoryValue as Category)) {
      return categoryValue as Category;
    } else {
      console.warn(`Gemini returned an unknown category: ${categoryValue}. Defaulting to 'Other'.`);
      return Category.Other;
    }
  } catch (error) {
    console.error("Error categorizing expense with Gemini:", error);
    // Fallback to 'Other' category in case of an API error
    return Category.Other;
  }
};