import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.warn('GOOGLE_API_KEY is not set in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

// optimize for creative workout generation
export const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        temperature: 0.7, // A bit of creativity for workouts
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
    }
});
