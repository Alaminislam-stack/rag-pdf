import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Settings2, 
  FileText, 
  Calendar, 
  ArrowUpRight,
  Filter,
  Layers,
  FileSearch
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card, Input, Button, Table } from '../components/common/UIControls';

export const SearchPage: React.FC = () => {
  const { pdfs, globalSearchQuery, setGlobalSearchQuery } = useAppContext();
  
  const [docType, setDocType] = useState('all');
  const [fileLimit, setFileLimit] = useState('any');
  const [sortOrder, setSortOrder] = useState('recent');
  const [isAdvanced, setIsAdvanced] = useState(false);

  const navigate = useNavigate();

  // Filter application
  const filtered = pdfs.filter(pdf => {
    const q = globalSearchQuery.toLowerCase();
    const titleMatch = pdf.title.toLowerCase().includes(q) || 
                       pdf.fileName.toLowerCase().includes(q);
    const tagMatch = pdf.tags.some(t => t.toLowerCase().includes(q));
    const textMatch = pdf.summary.toLowerCase().includes(q) || pdf.abstract.toLowerCase().includes(q);

    const matchSearch = q ? (titleMatch || tagMatch || textMatch) : true;
    
    // Type filters
    if (docType === 'favorite' && !pdf.isFavorite) return false;
    if (docType === 'large' && parseFloat(pdf.fileSize) < 2.0) return false;

    return matchSearch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Header labels */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">Global Search Directory</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Perform multi-vector search queries across summaries, abstracts, tags, and original PDF files.
        </p>
      </div>

      {/* CORE SEARCH CONTROLS LAYOUT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column filter controls (1 column) */}
        <div className="lg:col-span-1 space-y-4">
          <Card title="Query Architect" description="Synthesize indexes using structured properties filters.">
            <div className="space-y-4.5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-505 uppercase tracking-wide">Document Match Scope</label>
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 dark:text-slate-350 bg-transparent border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                >
                  <option value="all">🔍 Search Entire Corpus</option>
                  <option value="favorite">⭐ Favorites Only</option>
                  <option value="large">📁 Heavy Documents (&gt; 2MB)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-505 uppercase tracking-wide">Sort Index Alignment</label>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 dark:text-slate-350 bg-transparent border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                >
                  <option value="recent">📅 Ingest date: Most Recent</option>
                  <option value="name">🔤 Alphabetical Title</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-550 uppercase tracking-wide">File Storage Limit</label>
                <div className="flex gap-1.5">
                  {['any', 'light', 'heavy'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setFileLimit(tag)}
                      className={`flex-1 text-[10px] font-black uppercase p-2 border rounded-lg transition ${fileLimit === tag ? 'bg-indigo-600 border-transparent text-white' : 'border-slate-200 dark:border-slate-800 text-slate-600'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* Right Column result feeds (3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                placeholder="Perform global deep search index (e.g. self-attention, Stripe elements, Gao)..." 
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                icon={<SearchIcon className="h-5 w-5 text-indigo-555" />}
              />
            </div>
          </div>

          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 select-none">
            Query Results ({filtered.length} documents matching)
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-200 text-slate-400">
              <FileSearch className="h-8 w-8 text-slate-300 mx-auto animate-bounce mb-2" />
              <h4 className="font-bold text-slate-755 leading-none">No vectors align with query</h4>
              <p className="text-[11px] mt-1">Check for spelling alignments or adjust search options panels.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(pdf => (
                <div 
                  key={pdf.id}
                  onClick={() => navigate('/pdfs')}
                  className="p-4 rounded-2xl border border-slate-150/80 hover:border-indigo-400 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm cursor-pointer hover:shadow-md transition flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-left"
                >
                  <div className="flex gap-3 items-center overflow-hidden leading-none">
                    <div className="h-10 w-10 bg-indigo-50 dark:bg-slate-800 border border-indigo-100/50 dark:border-slate-750 flex items-center justify-center rounded-xl text-indigo-650 shrink-0">
                      <FileText className="h-5 w-5 dark:text-indigo-400" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-white leading-tight truncate">{pdf.title}</h4>
                      <p className="text-[10px] text-slate-450 truncate mt-1">FileName: <span className="font-mono text-slate-500">{pdf.fileName}</span> • {pdf.fileSize}</p>
                      
                      <p className="text-[11px] text-slate-505 dark:text-slate-400 mt-2 line-clamp-1 leading-tight font-medium">
                        "{pdf.summary}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex gap-1">
                      {pdf.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="text-[9px] font-bold bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded tracking-wide capitalize">{tag}</span>
                      ))}
                    </div>
                    <ArrowUpRight className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
