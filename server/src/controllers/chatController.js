import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { client } from "../config/vectorDb.js";
import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import { cleanBengaliText } from "../utils/bengaliCleaner.js";

const chatController = asyncHandler(async (req, res, next) => {
  const { question, mode, collectionId } = req.body;

  if (!question?.trim()) {
    return next(new errorHandler(400, "Question is required"));
  }

  // Collection
  const collection = await client.getCollection({
    name: "rag-documents",
  });
  if (!collection) {
    return next(new errorHandler(400, "Collection not found"));
  }

  // Embedding Function
  const embeddingFunction = new GoogleGeminiEmbeddingFunction({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004",
  });

  // Query Embedding
  const queryEmbedding = await embeddingFunction.generate([question]);

  // Vector Search
  const results = await collection.query({
    queryEmbeddings: queryEmbedding,
    nResults: 5,
    where: {
      $and: [{ userId: req.user.id }, { collectionId: collectionId }],
    },
  });

  if (
    !results.documents ||
    !results.documents.length ||
    !results.documents[0].length
  ) {
    return res.status(404).json({
      success: false,
      message: "No relevant information found.",
    });
  }

  // Context Build
  const context = cleanBengaliText(results.documents[0].join("\n\n"));

  // Gemini LLM
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  let prompt;

  const np = process.env.NORMALPROMPT

  const normalPrompt = `
 
  promot:
  ${np}

Context:
${context}

Question:
${question}

Answer:
`;

  const cp = process.env.CREATIVEPROMPT;

  const creativePrompt = `
  
  prompt:
  ${cp}

Context:
${context}

Question:
${question}
`;

  if (mode === "creative") {
    prompt = creativePrompt;
  } else {
    prompt = normalPrompt;
  }

  // console.log(mode);

  const response = await model.generateContent(prompt);

  const answer = cleanBengaliText(response.response.text());

  return res.status(200).json({
    success: true,
    question,
    answer,
  });
});

export { chatController };
