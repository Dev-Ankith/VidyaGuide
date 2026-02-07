import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function run() {
    try {
        // Since the simple SDK doesn't expose listModels easily on the main class in some versions,
        // we can try to just run a generation on a few known candidates and see which one doesn't 404.
        // Or we can try to use the model manager if available.

        console.log("Testing gemini-1.5-flash...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            await model.generateContent("Hello");
            console.log("SUCCESS: gemini-1.5-flash works.");
        } catch (e) { console.log("FAIL: gemini-1.5-flash", e); }

        console.log("Testing gemini-pro...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            await model.generateContent("Hello");
            console.log("SUCCESS: gemini-pro works.");
        } catch (e) { console.log("FAIL: gemini-pro", e.message.substring(0, 100)); }

        console.log("Testing gemini-1.0-pro...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
            await model.generateContent("Hello");
            console.log("SUCCESS: gemini-1.0-pro works.");
        } catch (e) { console.log("FAIL: gemini-1.0-pro", e.message.substring(0, 100)); }

    } catch (error) {
        console.error("Critical Error:", error);
    }
}

run();
