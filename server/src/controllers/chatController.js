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
    return next(
      new errorHandler(400, "Collection not found")
    );
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
      $and: [
        { userId: req.user.id },
        { collectionId: collectionId }
      ]
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

  const normalPrompt = `
You are a helpful AI assistant.

Answer the user's question ONLY from the provided context.

If the answer is not available in the context, reply:
"I could not find the answer in the uploaded PDF."

Context:
${context}

Question:
${question}

Answer:
`;

  const creativePrompt = `
তুমি একজন অভিজ্ঞ HSC/SSC পরীক্ষক।

সৃজনশীল প্রশ্নের উত্তর লেখার সময় নিচের নিয়মগুলো কঠোরভাবে অনুসরণ করবে:

ক-নম্বর (জ্ঞানমূলক):

১ নম্বরের উত্তর।
সরাসরি সংজ্ঞা বা মূল বক্তব্য লিখবে।
১টি ছোট প্যারাগ্রাফ।
অতিরিক্ত ব্যাখ্যা দিবে না।
২ থিকে ৩টি বাক্য হবে।


খ-নম্বর (অনুধাবনমূলক):

২ নম্বরের উত্তর।
প্রথম প্যারায় মূল ধারণা বা সংজ্ঞা লিখবে।
দ্বিতীয় প্যারায় ব্যাখ্যা, কারণ বা বিশ্লেষণ লিখবে।
মোট ২টি প্যারাগ্রাফ।

গ-নম্বর (প্রয়োগমূলক):

৩ নম্বরের উত্তর।
প্রথম প্যারায় জ্ঞানমূলক তথ্য।
দ্বিতীয় প্যারায় অনুধাবনমূলক ব্যাখ্যা।
তৃতীয় প্যারায় উদ্দীপকের সাথে সম্পর্ক স্থাপন করে প্রয়োগ দেখাবে।
মোট ৩টি প্যারাগ্রাফ।

ঘ-নম্বর (উচ্চতর দক্ষতামূলক):

৪ নম্বরের উত্তর।
প্রথম প্যারায় জ্ঞান।
দ্বিতীয় প্যারায় অনুধাবন।
তৃতীয় প্যারায় উদ্দীপকের সাথে সম্পর্ক ও বিশ্লেষণ।
চতুর্থ প্যারায় মূল্যায়ন, মতামত ও যৌক্তিক উপসংহার।
মোট ৪টি প্যারাগ্রাফ।

অতিরিক্ত নির্দেশনা:

উত্তর অবশ্যই Context থেকে তৈরি করবে।
পরীক্ষার খাতার উপযোগী ভাষা ব্যবহার করবে।
অপ্রয়োজনীয় তথ্য যোগ করবে না।
ক, খ, গ, ঘ শিরোনাম ব্যবহার করবে।
প্রতিটি অংশ আলাদা করে লিখবে।
কোনো অংশ বাদ দিবে না।

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
