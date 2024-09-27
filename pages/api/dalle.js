import { OpenAI } from "openai";



const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = response.data[0].url;
      console.log(imageUrl);
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate image" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

