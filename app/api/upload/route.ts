import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

export async function POST(req: Request) {
    const formReq = await req.formData();
    const formImg = formReq.get("img");

    if(!formImg || !(formImg instanceof File)){
        return NextResponse.json({error: "No img uploaded"}, {status: 400})
    }

    const prompt = `
    You are a fruit ripeness AI assistant.

    Analyze the uploaded image and:
    1. Predict the ripeness from 0 to 100.
    2. Give a confidence score (0-100%) for your prediction.
    3. Include a note if visual ripeness may be unreliable.

    Return the response in JSON format like this:
    {
    "predicted_ripeness": "...",
    "confidence": ...,
    "note": "..."
    }
    `;

    const uploaded = await genAI.files.upload({
        file: formImg,
        config: {
            mimeType: formImg.type,
            displayName: formImg.name
        }
    })

    const res = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {text: prompt},
            {
                fileData: {
                    mimeType: uploaded.mimeType,
                    fileUri: uploaded.uri
                }
            }
        ],
        config: {
            systemInstruction: "You are a fruit ripeness AI assistant.",
        },
    });

    return NextResponse.json({
        success: true,
        res: res,
        summary: res.text,
    })
}