import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const fruitName = (formData.get('fruit_name') as string)?.trim();
  const isSliced = formData.get('is_sliced') === 'true';

  if (!fruitName) {
    return NextResponse.json({ error: 'Fruit name is required' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString('base64');

  const prompt = `
You are a fruit ripeness AI assistant.

Fruit: ${fruitName}
Is sliced: ${isSliced ? 'Yes' : 'No'}

Analyze the uploaded image and:
1. Predict the ripeness stage (underripe, early ripe, ripe, or overripe).
2. Give a confidence score (0-100%) for your prediction.
3. Include a note if visual ripeness may be unreliable.

Return the response in JSON format like this:
{
  "predicted_ripeness": "...",
  "confidence": ...,
  "note": "..."
}
`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      { text: prompt },
      { inlineData: { mimeType: file.type, data: base64Data } },
    ],
  });

  return NextResponse.json({ text: result.text });
}
