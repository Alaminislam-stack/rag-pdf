import { createContext, useContext, useEffect, useState } from "react";
import { ChatMessage, Collection, PDFDocument } from "../types";
import { useAuth } from "./AuthContext";
import axiosInstanceUtility from "@/src/utils/axiosInstanceUtility";

type OtherContextType = {
  collections: Collection[];
  pdfs: PDFDocument[];
  chat: ({
    question,
    mode,
    collectionId,
  }: {
    question: string;
    mode: string;
    collectionId?: string;
  }) => Promise<any>;
};

const OtherContext = createContext<OtherContextType>({
  collections: [],
  pdfs: [],
  chat: async () => { return null; },
});

export const OtherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const { token } = useAuth();

  // console.log(token);

  const getPdfs = async () => {
    // console.log(token);
    if (!token) return;
    const result = await axiosInstanceUtility.get("/get-pdf", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(result);
    setPdfs(result.data.pdfs);
  };

  useEffect(() => {
    if (token) {
      getPdfs();
    }
  }, [token]);

  const getCollections = async () => {
    const result = await axiosInstanceUtility.get("/get-collections", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCollections(result.data.collections);
  };

  useEffect(() => {
    if (token) {
      getCollections();
    }
  }, [token]);

  const chat = async ({
    question,
    mode,
    collectionId,
  }: {
    question: string;
    mode: string;
    collectionId?: string;
  }) => {
    try {
      const response = await axiosInstanceUtility.post(
        "/chat",
        {
          question,
          mode,
          collectionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("response", response.data);

      return response.data;
    } catch (error) {
      console.error("Chat Error:", error);
      throw error;
    }
  };

  return (
    <OtherContext.Provider value={{ collections, pdfs, chat }}>
      {children}
    </OtherContext.Provider>
  );
};

export const useOtherContext = () => {
  const context = useContext(OtherContext);
  if (!context) {
    throw new Error("useOtherContext must be used within an OtherProvider");
  }
  return context;
};
