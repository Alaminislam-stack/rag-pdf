import React, { useState } from 'react';
import { 
  Grid2X2, 
  List, 
  Plus, 
  Search, 
  FolderHeart, 
  Tag, 
  Eye, 
  Trash2, 
  Star, 
  BookOpen, 
  Save, 
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card, Button, Input, Table } from '../components/common/UIControls';
import { Modal, EmptyState } from '../components/common/FeedbackControls';
import { PDFCard, UploadPDFBox } from '../components/pdf/PDFControls';
import { PDFDocument } from '../types';
import { useOtherContext } from '@/src/context/OtherContext'

export const PDFLibrary: React.FC = () => {
  const { 
    // pdfs, 
    // collections, 
    addCollection, 
    deletePDF, 
    toggleFavoritePDF,
    updatePDFNotes 
  } = useAppContext();

  const {pdfs, collections} = useOtherContext();

  // console./)

  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Modals controller
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showColModal, setShowColModal] = useState(false);
  const [colName, setColName] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colColor, setColColor] = useState('#4F46E5');

  // Selected PDF slide-over details panel
  const [activeDetailPdf, setActiveDetailPdf] = useState<PDFDocument | null>(null);
  const [activeDetailNotes, setActiveDetailNotes] = useState('');

  // Extract all available tags across corpus
  const allTags = Array.from(new Set(pdfs.flatMap(p => p.tags)));

  // Filter application
  const filteredPdfs = pdfs.filter(p => {
    const sMatch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                   p.fileName.toLowerCase().includes(search.toLowerCase());
    const cMatch = selectedCol ? p.collection_id === selectedCol : true;
    const tMatch = selectedTag ? p.tags.includes(selectedTag) : true;
    return sMatch && cMatch && tMatch;
  });

  const handleOpenDetail = (pdf: PDFDocument) => {
    setActiveDetailPdf(pdf);
    setActiveDetailNotes(pdf.notes);
  };


  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) return;
    addCollection(colName, colDesc, colColor);
    setColName('');
    setColDesc('');
    setShowColModal(false);
  };
  
  return (
    <div className="space-y-6 relative">
      
      {/* Header bar actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">PDF Document Library</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review active uploads, manage semantic collections, write custom code notes, or index new documents.</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button onClick={() => setShowUploadModal(true)}>
            <Plus className="h-4.5 w-4.5" />
            <span>Upload & Parse</span>
          </Button>
        </div>
      </div>

      {/* FILTER BUTTONS & QUICK SEARCH FOR INDEX */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full md:max-w-md">
          <Input 
            placeholder="Filter files by titles or filename metrics..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end">
          {/* Layout presentation Switcher controls */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-white dark:bg-slate-900 flex gap-1 select-none">
            <button 
              onClick={() => setViewType('grid')}
              className={`p-1.5 rounded-lg cursor-pointer transition ${viewType === 'grid' ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-650 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`p-1.5 rounded-lg cursor-pointer transition ${viewType === 'list' ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-650 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY COLLECTION SLIDER AND CORRESPONDING TAGS */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">Collections:</span>
        <button 
          onClick={() => setSelectedCol(null)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition ${!selectedCol ? 'bg-indigo-600 text-white' : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
        >
          All
        </button>
        {collections.map(col => (
          <button
            key={col.id}
            onClick={() => setSelectedCol(col.id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition flex items-center gap-1.5 ${
              selectedCol === col.id 
                ? 'bg-indigo-600 text-white' 
                : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color }} />
            <span>{col.name}</span>
          </button>
        ))}
      </div>

      {/* RENDER GRID VS LIST VIEWS */}
      {filteredPdfs.length === 0 ? (
        <EmptyState 
          title="No grounded documents found" 
          description="Try broadening your filter criteria or upload a new PDF manual to synthesize its coordinates." 
          actionText="Upload PDF"
          onAction={() => setShowUploadModal(true)}
        />
      ) : viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPdfs.map(pdf => (
            <PDFCard 
              key={pdf.id}
              pdf={pdf} 
              onPreview={() => handleOpenDetail(pdf)}
              onDelete={() => deletePDF(pdf.id)}
            />
          ))}
        </div>
      ) : (
        <Table<PDFDocument> 
          columns={[
            { header: 'Reference', accessor: (row) => (
              <div 
                onClick={() => handleOpenDetail(row)}
                className="flex items-center gap-2.5 cursor-pointer hover:text-indigo-650"
              >
                <BookOpen className="h-4 w-4 text-indigo-505" />
                <span className="font-bold text-slate-800 dark:text-white">{row.title}</span>
              </div>
            ) },
            { header: 'File Name', accessor: (row) => <span className="font-mono text-xs text-slate-400">{row.fileName}</span> },
            { header: 'Size', accessor: (row) => <span className="font-semibold text-slate-500">{row.fileSize}</span> },
            { header: 'Favorite', accessor: (row) => (
              <button 
                onClick={() => toggleFavoritePDF(row.id)}
                className={`p-1 ${row.isFavorite ? 'text-amber-500' : 'text-slate-300'}`}
              >
                <Star className="h-4 w-4" fill={row.isFavorite ? 'currentColor' : 'none'} />
              </button>
            ) },
            { header: 'Actions', accessor: (row) => (
              <button 
                onClick={() => deletePDF(row.id)}
                className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) }
          ]}
          data={filteredPdfs}
        />
      )}

      {/* SLIDE-OVER DRAWER DETAIL PANEL FOR SINGLE PDF */}
      {activeDetailPdf && (
        <>
          {/* Drawer backdrop overlay */}
          <div 
            onClick={() => setActiveDetailPdf(null)}
            className="fixed inset-0 bg-slate-900/30 dark:bg-black/50 z-40 transition-opacity backdrop-blur-xs"
          />

          {/* Drawer body container */}
          <div className="fixed top-0 right-0 h-screen w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col animate-in slide-in-from-right duration-350 overflow-hidden">
            
            {/* Drawer header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                <h2 className="font-bold text-base md:text-lg text-slate-800 dark:text-white truncate max-w-sm">
                  {activeDetailPdf.title}
                </h2>
              </div>
              <button 
                onClick={() => setActiveDetailPdf(null)}
                className="h-8.5 w-8.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* FLOAT MODALS */}
      <Modal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        title="Vectorize Documents to RAG Engine"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-normal font-semibold">
            Upload document files (PDFs). We chunk and parse your texts segment by segment. Ground AI models with physical pointers.
          </p>
          <UploadPDFBox 
          collectionsList={collections}
            onUploadSuccess={(title, size, pages) => {
            
              setShowUploadModal(false);
            }} 
          />
        </div>
      </Modal>

      <Modal 
        isOpen={showColModal} 
        onClose={() => setShowColModal(false)}
        title="Establish Document Category Collection"
        maxWidth="md"
        footer={
          <div className="flex justify-end gap-2.5">
            <Button onClick={() => setShowColModal(false)} variant="ghost" size="sm">Cancel</Button>
            <Button onClick={handleCreateCollection} size="sm">Create Collection</Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          <Input 
            label="Collection Name" 
            placeholder="e.g. LLM Papers 2026" 
            value={colName}
            onChange={(e) => setColName(e.target.value)}
            required
          />
          <Input 
            label="Brief Description (Optional)" 
            placeholder="Describe what these documents are" 
            value={colDesc}
            onChange={(e) => setColDesc(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Pick Category Color Tag</label>
            <div className="flex gap-2">
              {['#4F46E5', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColColor(c)}
                  className={`h-7 w-7 rounded-full cursor-pointer transition border border-transparent ${colColor === c ? 'scale-115 ring-2 ring-indigo-500/20' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
};
