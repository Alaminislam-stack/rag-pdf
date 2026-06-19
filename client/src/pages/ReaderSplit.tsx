import React, { useState } from 'react';
import { 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Sparkles, 
  BookOpen, 
  MessageSquare,
  FileText,
  Bookmark
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card, Button, Input } from '../components/common/UIControls';
import { ChatBubble, ChatBar } from '../components/chat/ChatControls';
import { Citation } from '../types';

export const ReaderSplit: React.FC = () => {
  const { pdfs, activePdfId, setActivePdfId, isStreaming, threads, addMessage } = useAppContext();
  
  // Set default PDF if none active
  const activePdf = pdfs.find(p => p.id === activePdfId) || pdfs[0];
  
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [searchText, setSearchText] = useState('');
  const [highlightPage, setHighlightPage] = useState<number | null>(null);

  // Active chat bound to this reader session
  const readerThread = threads[0]; // bind to transformer or similar
  
  const handleNextPage = () => {
    if (currentPage < activePdf.pagesCount) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Mock citation trigger
  const handleCitationTrigger = (cit: Citation) => {
    setCurrentPage(cit.page);
    setHighlightPage(cit.page);
    // highlight temporary alert
    setTimeout(() => setHighlightPage(null), 3000);
  };

  const handleSendMessage = (text: string) => {
    if (readerThread) {
      addMessage(readerThread.id, text);
    }
  };

  // Find occurrences for search
  const isSearchMatching = searchText && activePdf.summary.toLowerCase().includes(searchText.toLowerCase());

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden relative select-none">
      
      {/* Upper reader utility taskbar */}
      <div className="h-13 border-b border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 px-4.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden text-left">
          <BookOpen className="h-5 w-5 text-indigo-500 shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-extrabold text-slate-800 dark:text-white truncate max-w-xs">{activePdf?.title || 'No doc loaded'}</span>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5">{activePdf?.fileName} • {activePdf?.fileSize}</span>
          </div>
        </div>

        {/* Action picker dropdown */}
        <div className="flex items-center gap-4.5">
          <select 
            value={activePdf?.id}
            onChange={(e) => {
              setActivePdfId(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs font-bold text-slate-700 bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 focus:outline-none dark:text-slate-350"
          >
            {pdfs.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CORE SPLIT WORKSPACE INTERACTIVE GRID */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        
        {/* LEFT COLUMN: INTERACTIVE PDF READER CANVAS */}
        <div className="flex-1 flex flex-col h-full border-r border-slate-150 dark:border-slate-850 bg-slate-100 dark:bg-slate-950/80 min-w-0">
          
          {/* Reader subbar with page indices, zoom, and text filter search */}
          <div className="h-10 border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 px-3 flex items-center justify-between font-bold text-xs text-slate-600 dark:text-slate-450 shrink-0">
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[11px]">Page {currentPage} of {activePdf?.pagesCount}</span>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === activePdf?.pagesCount}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                <ZoomOut className="h-4 w-4" />
              </button>
              <span>{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            <div className="w-40 relative flex items-center">
              <Search className="h-3.5 w-3.5 absolute left-2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find inside doc..." 
                className="w-full bg-slate-100 dark:bg-slate-800 pl-7 pr-2 py-1 text-[11px] rounded focus:outline-none border-none dark:text-white"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {/* Core scrollable document emulation panel */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center scrollbar-thin">
            <div 
              className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-lg p-6 md:p-8 rounded-2xl select-text transition-all max-w-xl text-left ${
                highlightPage === currentPage ? 'ring-4 ring-indigo-550/40 border-indigo-400 animate-pulse' : ''
              }`}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              
              {/* Document Header details */}
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4 mb-4 select-none flex items-start justify-between">
                <div>
                  <h1 className="text-base font-black text-slate-850 dark:text-white">{activePdf?.title}</h1>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Vector Enclave Document • Page {currentPage}</p>
                </div>
                <Bookmark className="h-4 w-4 text-indigo-500 animate-pulse" />
              </div>

              {/* Sample PDF content matching pages index */}
              <div className="text-xs md:text-sm text-slate-705 dark:text-slate-300 leading-relaxed font-sans space-y-4 font-medium">
                
                {currentPage === 1 ? (
                  <>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2">1. ABSTRACT EXCERPT</h3>
                    <p className="italic bg-indigo-50/10 p-3 rounded-xl border border-indigo-100/10 leading-normal text-xs text-indigo-900 dark:text-indigo-400">
                      "{activePdf?.abstract}"
                    </p>
                    <p className="mt-3">
                      This paper represents grounded schemas for modern artificial learning systems. Over subsequent pages, detailed metrics are verified using semantic similarity and vector projection parameters.
                    </p>
                  </>
                ) : currentPage === 4 || currentPage === 5 ? (
                  <>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2">PAGE 4: MODEL SPECIFICATIONS</h3>
                    <p className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs text-indigo-750 dark:text-indigo-300 leading-snug">
                      Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V
                    </p>
                    <p className="mt-3">
                      We project Query, Keywords, and Value parameters into 8 parallel heads dynamically mapping representation subspaces. This optimizes sequence length operations while protecting memory caches.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2">SECTION {currentPage}: COMPLIANCE & VECTOR ALIGNMENT</h3>
                    <p>
                      {activePdf?.summary}
                    </p>
                    <p className="mt-4">
                      All vectors ingested here are passed to isolated physical clusters. Access token structures enforce tenancies so documents can never bleed across workspaces under strict security.
                    </p>
                  </>
                )}

                {/* Highlight search matching */}
                {isSearchMatching && (
                  <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-950/40 border border-yellow-250 rounded-lg text-[11px] text-yellow-800 dark:text-yellow-400 font-bold select-none leading-normal">
                    <span>⚠️ Search term match found across summaries index on page {currentPage}</span>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTEGRATED AI CHAT PANEL */}
        <div className="w-80 md:w-96 border-l border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full justify-between overflow-hidden shrink-0">
          
          {/* Internal Title toolbar */}
          <div className="p-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/20 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white leading-none">
              <MessageSquare className="h-4.5 w-4.5 text-indigo-500" />
              <span>Grounded Session Chat</span>
            </div>
          </div>

          {/* Messages feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {readerThread ? (
              readerThread.messages.map(msg => (
                <ChatBubble 
                  key={msg.id} 
                  message={msg} 
                  onReferenceClick={handleCitationTrigger}
                />
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">Loading convo logs...</div>
            )}

            {isStreaming && (
              <div className="p-3.5 border border-dashed border-slate-150 rounded-xl bg-orange-50/10 text-[10px] font-bold text-slate-400 flex items-center gap-2 animate-pulse">
                <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-ping shrink-0" />
                <span>Parsing PDF source archives...</span>
              </div>
            )}
          </div>

          {/* Input component */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-150 dark:border-slate-800 shrink-0">
            <ChatBar 
              onSend={handleSendMessage} 
              attachedPdfs={[activePdf?.id]} 
              onAttachPdf={() => {}} 
              isStreaming={isStreaming}
            />
          </div>

        </div>

      </div>

    </div>
  );
};
