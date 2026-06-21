import { asyncHandler } from "../utils/asyncHedler.js";
import pdf from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { errorHandler } from "../utils/errorHendler.js";
import { cleanBengaliText } from "../utils/bengaliCleaner.js";
import { ChromaClient } from "chromadb";
import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { client } from "../config/vectorDb.js";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../middlewares/auth.meddleware.js";

const uploadController = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.body || {};

  if (!req.file || !req.file.buffer) {
    return next(new errorHandler(400, "No file uploaded"));
  }

  if (!req.user) {
    return next(new errorHandler(401, "Unauthorized"));
  }

  const uploadedFile = req.file;

  const result = await pdf(uploadedFile.buffer);
  const rawText = cleanBengaliText(result.text);

  const fileName = Buffer.from(uploadedFile.originalname, "latin1").toString(
    "utf8",
  );

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1200,
    chunkOverlap: 200,
  });
  const chunks = await splitter.createDocuments([rawText]);

  const embeddings = new GoogleGeminiEmbeddingFunction({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
  });

  // console.log('after supabasr pdf upload')
  const pdfId = uuidv4();
  const { data: pdfData, error: pdfError } = await supabase
    .from("pdfs")
    .insert({
      id: pdfId,
      user_id: req.user.id,
      collection_id: collectionId,
      title: fileName,
    })
    .select()
    .single();

  if (pdfError) {
    return next(new errorHandler(400, pdfError.message));
  }
  // console.log(pdfData)

  const collection = await client.getOrCreateCollection({
    name: "rag-documents",
    embeddingFunction: embeddings,
  });

  await collection.add({
    ids: chunks.map(() => uuidv4()),
    documents: chunks.map((chunk) => chunk.pageContent),
    metadatas: chunks.map((_, index) => ({
      userId: req.user.id,
      fileName,
      chunkIndex: index,
      collectionId,
      pdfId: pdfId,
    })),
  });

  return res.status(200).json({
    message: "PDF uploaded and processed successfully",
    totalChunks: chunks.length,
  });
});

const createCollection = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next(new errorHandler(400, "Collection Name is requre"));
  }
  // console.log(name)
  const { data, error } = await supabase
    // console.log('create collection', data)
    .from("collections")
    .insert({
      name,
      user_id: req.user.id,
    })
    .select()
    .single();

  if (error) {
    // console.log(error)
    return next(new errorHandler(400, error.message));
  }

  return res.status(200).json({
    success: true,
    collection: data,
  });
});

const getCollections = asyncHandler(async (req, res, next) => {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", req.user.id);

  if (error) {
    return next(new errorHandler(400, error.message));
  }

  return res.status(200).json({
    success: true,
    collections: data,
  });
});

const deletePdf = asyncHandler(
  async (req, res, next) => {
    const { pdfId } = req.params;
    console.log("pdfId", pdfId);

    const collection = await client.getCollection({
      name: "rag-documents",
    });

    console.log("collection", collection);

   const data = await collection.delete({
      where: {
        $and: [
          { pdfId },
          { userId: req.user.id }
        ]
      }
    });

    if (!data) {
      return next(new errorHandler(400, "Something went wrong"));
    }

    const deletePDF = await supabase
      .from("pdfs")
      .delete()
      .eq("id", pdfId)
      .eq("user_id", req.user.id);

      if (!deletePDF) {
        return next(new errorHandler(400, "Something went wrong from supabase"));
      }

    return res.status(200).json({
      success: true,
      message: "PDF deleted successfully",
    });
  }
);

const deleteCollection = asyncHandler(
  async (req, res, next) => {
    const { collectionId } = req.params;
    // console.log("collectionId", collectionId);

    const deleteCollection = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId)
      .eq("user_id", req.user.id);

      if (!deleteCollection) {
        return next(new errorHandler(400, "Something went wrong from supabase"));
      }

    return res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  }
);
const getPdf = asyncHandler(async (req, res, next) => {
  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("user_id", req.user.id);

  if (error) {
    return next(new errorHandler(400, error.message));
  }

  return res.status(200).json({
    success: true,
    pdfs: data,
  });
});

export { uploadController, getPdf, createCollection, getCollections, deletePdf, deleteCollection };
