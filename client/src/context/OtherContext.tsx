import { createContext, useContext, useEffect, useState } from "react";
import { ChatMessage, Collection, PDFDocument } from "../types";
import { useAuth } from "./AuthContext";
import axiosInstanceUtility from "@/src/utils/axiosInstanceUtility";
import { toast } from "react-toastify";

type OtherContextType = {
  collections: Collection[];
  pdfs: PDFDocument[];
  createCollection: ({ name }: { name: string }) => Promise<boolean>;
  chat: ({
    question,
    mode,
    collectionId,
  }: {
    question: string;
    mode: string;
    collectionId?: string;
  }) => Promise<any>;
  deletePDF: (pdfId: string) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<boolean>;
  uploadPDF: ({
    selectedFile,
    formData,
  }: {
    selectedFile: File;
    formData: FormData;
  }) => Promise<any>;
  loading: boolean;
};

const OtherContext = createContext<OtherContextType>({
  collections: [],
  pdfs: [],
  uploadPDF: async () => { return null; },
  chat: async () => { return null; },
  deletePDF: async () => { return null; },
  deleteCollection: async () => { return false; },
  createCollection: async () => { return false; },
  loading: false,
});

export const OtherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const getPdfs = async () => {
    setLoading(true);
    if (!token) return;
    try {
      const result = await axiosInstanceUtility.get("/get-pdf", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(result);
      setPdfs(result.data.pdfs);
    } catch (error: any) {
      setLoading(false);
      console.error(error?.response?.data?.errorMessage);
      toast.error(error?.response?.data?.errorMessage);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getPdfs();
    }
  }, [token]);

  const getCollections = async () => {
    if (!token) return;
    try {
      const result = await axiosInstanceUtility.get("/get-collections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollections(result.data.collections);
    } catch (error: any) {
      console.error(error?.response?.data?.errorMessage);
      toast.error(error?.response?.data?.errorMessage);
    }
  };

  useEffect(() => {
    if (token) {
      getCollections();
    }
  }, [token]);

  const uploadPDF = async ({ selectedFile, formData }: { selectedFile: File, formData: FormData }) => {
    if (!selectedFile) return;
    
    try {
      const response = await axiosInstanceUtility.post("/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("PDF uploaded successfully");
      return response.data;
    } catch (error) {
      console.error(error?.response?.data?.errorMessage);
      toast.error(error?.response?.data?.errorMessage);
    } finally {
      getPdfs()
    }
  };


  const createCollection = async ({ name }: { name: string }): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await axiosInstanceUtility.post(
        "/create-collection",
        {
          name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setLoading(false);
      toast.success("Collection created successfully");
      return true;
    } catch (error: any) {
      setLoading(false);
      console.error(error?.response?.data?.errorMessage);
      toast.error(error?.response?.data?.errorMessage);
      return false;
    }
    finally {
      getCollections();
    }
  };

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
      
      return response.data;
    } catch (error: any) {
      console.error(error?.response?.data?.errorMessage);
      toast.error(error?.response?.data?.errorMessage);
      throw error;
    }
  };

  const deletePDF = async (pdfId: string) => {
    try {
      const result = await axiosInstanceUtility.delete(`/delete-pdf/${pdfId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("PDF deleted successfully");
    } catch (error: any) {
      console.error(error?.response?.data?.errorMessage);
      toast.error(error?.response?.data?.errorMessage);
    }
    finally {
      getPdfs();
    }
  };

  const deleteCollection = async (collectionId: string): Promise<boolean> => {
    try {
      const result = await axiosInstanceUtility.delete(
        `/delete-collection/${collectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Collection deleted successfully");
      return true;
    } catch (error: any) {
      console.error(error?.response?.data?.errorMessage);
      toast.error(error?.response?.data?.errorMessage);
      return false;
    }
    finally {
      getCollections();
    }
  };

  return (
    <OtherContext.Provider value={{ uploadPDF, collections, pdfs, chat, deletePDF, deleteCollection, createCollection, loading }}>
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
