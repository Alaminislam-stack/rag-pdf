import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderHeart,
  ArrowLeft,
  Plus,
  FileText,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Card, Button, Table, Input } from "../components/common/UIControls";
import { Modal } from "../components/common/FeedbackControls";
import { Collection, PDFDocument } from "../types";
import axiosInstanceUtility from "../utils/axiosInstanceUtility";
import { useAuth } from "../context/AuthContext";
import { useOtherContext } from "../context/OtherContext";
import { toast } from 'react-toastify';

export const Collections: React.FC = () => {
  // const { pdfs } = useAppContext();
  const [selectedColId, setSelectedColId] = useState<string | null>(null);
  const { token } = useAuth();
  const [showColModal, setShowColModal] = useState(false);
  const [colName, setColName] = useState("");

  // Fetch collections from Supabase
  const { collections, pdfs, createCollection, deleteCollection, loading } = useOtherContext();

  // console.log(collections);


  // Find active drilldown
  const activeCol = collections.find((c) => c.id === selectedColId) || null;
  const colPdfs = activeCol
    ? pdfs.filter((p) => p.collection_id === activeCol.id)
    : [];



  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) return;
    const response = await createCollection({ name: colName });
    if (response) {
      setColName("");
      setShowColModal(false);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    const hasPdf = pdfs.some(
      (pdf) => pdf.collection_id === collectionId
    );

    if (hasPdf) {
      toast.error("Please delete all the documents in this collection first");
      return
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this collection?");
    if (!confirmDelete) return;

    if (colPdfs.length > 0) {
      console.log("Please delete all the documents in this collection first");
      alert("Please delete all the documents in this collection first");
      return;
    }
    const response = await deleteCollection(collectionId);
    if (response) {
      setSelectedColId(null);
    }
  };

  return (
    <div className="space-y-6">
      {activeCol ? (
        // COLLECTION DETAILS VIEW
        <div className="space-y-6 text-left">
          <button
            onClick={() => setSelectedColId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Collections</span>
          </button>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: activeCol.color }}
              >
                <FolderHeart className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                  {activeCol.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeCol.description}
                </p>
              </div>
              <div className="ml-auto text-xs font-bold bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
                {colPdfs.length} documents
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white">
              Documents
            </h3>
            <Table<PDFDocument>
              columns={[
                {
                  header: "Name",
                  accessor: (row) => (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-indigo-600" />
                      <span className="font-medium text-slate-800 dark:text-white">
                        {row.title}
                      </span>
                    </div>
                  ),
                },
                {
                  header: "File",
                  accessor: (row) => (
                    <span className="text-xs text-slate-500">
                      {row.fileName}
                    </span>
                  ),
                },
                {
                  header: "Size",
                  accessor: (row) => (
                    <span className="text-sm text-slate-600">
                      {row.fileSize}
                    </span>
                  ),
                },
              ]}
              data={colPdfs}
            />
          </div>
        </div>
      ) : (
        // COLLECTIONS LIST VIEW
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Collections
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Organize your PDFs
              </p>
            </div>
            <Button onClick={() => setShowColModal(true)}>
              <Plus className="h-4 w-4" />
              <span>New Collection</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((col) => {
              const count = pdfs.filter(
                (p) => p.collection_id === col.id,
              ).length;
              return (
                <div
                  key={col.id}
                  onClick={() => setSelectedColId(col.id)}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 hover:shadow-md cursor-pointer transition"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: col.color }}
                    >
                      <FolderHeart className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-white">
                        {col.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {col.description}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-xs text-slate-500">
                          {count} docs
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCollection(col.id);
                            }}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                          <span className="text-xs text-indigo-600">View →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NEW COLLECTION MODAL */}
      <Modal
        isOpen={showColModal}
        onClose={() => setShowColModal(false)}
        title="Create Collection"
        maxWidth="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowColModal(false)}  variant="ghost">
              Cancel
            </Button>
            <Button onClick={handleCreateCollection} className="bg-blue-500 text-white cursor-pointer" disabled={!colName.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Collection Name"
            placeholder="e.g., Research Papers"
            value={colName}
            onChange={(e) => setColName(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
};
