import React, { useRef, useState } from "react";
import { FileText, Trash2, Star, Eye, UploadCloud, Loader2 } from "lucide-react";
import { Collection, PDFDocument } from "../../types";
import { Button } from "../common/UIControls";
import { useAppContext } from "../../context/AppContext";
import axiosInstanceUtility from "@/src/utils/axiosInstanceUtility";
import { useAuth } from "@/src/context/AuthContext";

interface PDFCardProps {
  pdf: PDFDocument;
  onPreview: () => void;
  onDelete: () => void;
}

export const PDFCard: React.FC<PDFCardProps> = ({ pdf, onPreview, onDelete }) => {
  const { toggleFavoritePDF } = useAppContext();

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-indigo-600">
          <FileText className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              onClick={onPreview}
              className="text-sm font-bold text-slate-800 dark:text-white cursor-pointer hover:text-indigo-600 truncate"
            >
              {pdf.title}
            </h4>
            <div className="flex gap-1">
              <button
                onClick={() => toggleFavoritePDF(pdf.id)}
                className={`p-1 rounded ${pdf.isFavorite ? "text-amber-500" : "text-slate-400"}`}
              >
                <Star className="h-4 w-4" fill={pdf.isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pdf.summary}</p>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500">{pdf.fileSize}</span>
            <span className="text-xs text-slate-500">{pdf.pagesCount} pages</span>
            <button onClick={onPreview} className="text-xs text-indigo-600 font-medium hover:underline">
              View
            </button>
            <button onClick={onDelete} className="text-xs text-red-500 hover:underline">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface UploadPDFBoxProps {
  onUploadSuccess: (title: string, size: string, pages: number) => void;
  collectionsList: Collection[];
}



export const UploadPDFBox: React.FC<UploadPDFBoxProps> = ({ onUploadSuccess, collectionsList }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [collection, setCollection] = useState<string>("");
  const { token } = useAuth();


  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }

    setSelectedFile(file);
  };

  const uploadPDF = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("collectionId", collection);

      const response = await axiosInstanceUtility.post("/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const title = selectedFile.name.replace(".pdf", "").replace(/_/g, " ");
      const size = `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`;
      const pages = response.data?.totalChunks || 0;

      onUploadSuccess(title, size, pages);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="w-full">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white text-center my-4">Selected Collection</h2>
        <div className="w-full max-w-xs mx-auto mb-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-2 text-center">
            {collection !== "new-collection" && (
              <span className="text-slate-500 font-bold text-md dark:text-slate-400">
                Collection ID: {collection}
              </span>
            )}
          </div>
          <select
            hidden={collection === "new-collection"}
            value={collection}
            onChange={(e) => {
              setCollection(e.target.value);
            }}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">Default Collection</option>
            {collectionsList.map((collection) => (
              <option key={collection.id} value={collection.id.toLowerCase().replace(/\s+/g, "-")}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isUploading ? (
        <div className="border-2 border-dashed border-indigo-400 bg-indigo-50 dark:bg-slate-800 rounded-xl p-8 text-center">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-4">Uploading {selectedFile?.name}...</p>
        </div>
      ) : (
        <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <UploadCloud className="h-10 w-10 text-slate-400" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-3">
            {selectedFile ? selectedFile.name : "Drop PDF here or click to browse"}
          </p>
          <p className="text-xs text-slate-500 mt-1">PDF only (Max 24MB)</p>

          {selectedFile && (
            <div className="flex gap-2 mt-4">
              <Button onClick={uploadPDF} disabled={!collection}>Upload</Button>
              <Button variant="outline" onClick={() => setSelectedFile(null)}>Cancel</Button>
            </div>
          )}

          {!selectedFile && (
            <Button onClick={openFilePicker} className="mt-4">Select PDF</Button>
          )}
        </label>
      )}
    </div>
  );
};
