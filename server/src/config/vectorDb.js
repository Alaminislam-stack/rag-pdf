import { config } from 'dotenv';
import { CloudClient } from "chromadb";

config();

export const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE || 'rag',
});