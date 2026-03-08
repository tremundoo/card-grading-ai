import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/grade-card", async (req, res) => {

  const { imageUrl } = req.body;

  const response = await client.responses.create({
    model: "gpt-4.1",
    input: [{
      role: "user",
      content: [
        { type: "input_text", text: `
        Analyze this trading card condition.

        Score:
        - Centering
        - Corners
        - Edges
        - Surface

        Each score 1-10.

        Return JSON:
        {
          centering: number,
          corners: number,
          edges: number,
          surface: number,
          final_grade: number
        }
        `},
        {
          type: "input_image",
          image_url: imageUrl
        }
      ]
    }]
  });

  res.json(response.output_text);

});

app.listen(3000, () => {
  console.log("AI grading server running");
});
