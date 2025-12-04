import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { Ollama } from "ollama";

const apiKey = process.env.OLLAMA_API_KEY;
const OLLAMA_URL = "https://ollama.com";

// Create Ollama Cloud client
const ollama = new Ollama({
  host: OLLAMA_URL,
  headers: {
    Authorization: "Bearer " + apiKey,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// Middleware to prevent server crash
app.use(cors());
app.use(express.json());
// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));


function extractMermaid(text) {
  if (!text || typeof text !== "string") return "";

  // 1. Remove any code fences ```mermaid or ```
  text = text.replace(/```mermaid\s*([\s\S]*?)```/gi, "$1");
  text = text.replace(/```/g, "");

  // 2. Extract everything starting with "flowchart"
  const match = text.match(/(flowchart|graph)\s+(TD|LR)[\s\S]*/i);
  if (!match) return "";
  let mermaid = match[0];

  // 3. Remove forbidden characters: parentheses () and quotes "
  mermaid = mermaid.replace(/[\(\)"]/g, "");

  // 4. Trim trailing spaces but preserve indentation
  mermaid = mermaid
    .split("\n")
    .map(line => line.replace(/\s+$/g, "")) // remove trailing spaces
    .join("\n");

  return mermaid;
}

app.post('/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    if (typeof prompt !== 'string' || prompt.length > 2000) {
      return res.status(400).json({ error: 'Invalid prompt or prompt too long' });
    }

    const adjustedPrompt = "This is the legal text you should convert: " + prompt;

    const system_message_content = 
      "You are an expert in Mermaid diagram syntax. " +
      "Your task is to convert legal texts into valid Mermaid flowchart definitions. " +
      "The output MUST be ONLY the Mermaid code block.\n\n" +
      "Instructions:\n" +
      "- Ensure the generated diagram is a decision flowchart that a user can follow.\n" +
      "- Do NOT interpret, paraphrase, or rewrite the legal text. Don't be creative. Use the same words that are used in the original text.\n" +
      "- For node text, use square brackets [] for standard process steps.\n" +
      "- For decision nodes, use curly braces {} with simple text.\n" +
      "- Avoid parentheses (), commas ,, or other punctuation that could confuse the parser.\n" +
      "For example:\n" +
      "Prompt: 'This is the legal text you should convert: The requirements for a unilateral juridical act are:\n" +
      "(a) that the party doing the act intends to be legally bound or to achieve the relevant legal effect;\n" +
      "(b) that the act is sufficiently certain; and\n" +
      "(c) that notice of the act reaches the person to whom it is addressed or, if the act is addressed to the public, the act is made public by advertisement, public notice or otherwise.'\n\n" +
      "Example Mermaid code:\n" +
      "flowchart TD;\n" +
      "A[Requirements for a Unilateral Juridical Act] --> B{Party intends to be legally bound?};\n\n" +
      "B -->|Yes| C{Act is sufficiently certain?};\n" +
      "B -->|No| F[Act Does Not Apply];\n\n" +
      "C -->|Yes| D{Notice reaches addressee or is made public?};\n" +
      "C -->|No| F;\n\n" +
      "D -->|Yes| E[Act Applies];\n" +
      "D -->|No| F;\n\n";

    const selectedModel =
      typeof model === "string" && model.trim() !== ""
        ? model.trim()
        : "qwen3-coder:480b-cloud";

    // ----- USE OLLAMA CLOUD CLIENT HERE -----
    const response = await ollama.chat({
      model: selectedModel,
      messages: [
        { role: "system", content: system_message_content },
        { role: "user", content: adjustedPrompt }
      ],
      stream: false
    });

    const possibleText = response?.message?.content || "";
    const mermaid = extractMermaid(String(possibleText));

    console.log("RAW model output:", possibleText);
    console.log("FINAL Prompt:\n" + adjustedPrompt);
    console.log("FINAL MERMAID:\n" + mermaid);

    return res.json({ mermaid });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3000, () => {
  console.log('Backend listening on http://localhost:3000');
});
