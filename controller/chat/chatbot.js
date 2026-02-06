import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "../../models/product.js";


const chat = async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        console.log(genAI, "gemini api")

        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                reply: "Question is required"
            });
        }

        const products = await Product.find()
            .select("name price discountPrice category brand sellerId branch description")
            .lean();

        if (!products.length) {
            return res.status(404).json({
                reply: "No products available to recommend"
            });
        }

        // 2️⃣ Convert products to text context
        const productContext = products
            .map(
                (p) =>
                    `Product: ${p.name}, Category: ${p.category}, Brand: ${p.brand}, Price: ₹${p.price}, DiscountPrice: ₹${p.discountPrice || "N/A"}, Seller: ${p.sellerId}, Branch: ${p.branch}`
            )
            .join("\n");

        // 3️⃣ Gemini prompt (RULE BASED)
        const prompt = `
You are a Myntra product recommendation assistant.
You MUST recommend products only from the list below.
If the question is unrelated, politely say you can help only with products.

PRODUCT LIST:
${productContext}

USER QUESTION:
${question}
`;

        // 4️⃣ Gemini model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({
            reply: "Sorry, something went wrong."
        });
    }
};

export default chat;
