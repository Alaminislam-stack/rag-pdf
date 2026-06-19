import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Database,
  Settings2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  CircleGauge,
  Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { Collection, PDFDocument } from '../types';
import { Card, Button, Table } from '../components/common/UIControls';
import { Modal } from '../components/common/FeedbackControls';
import { UploadPDFBox } from '../components/pdf/PDFControls';
import { useAuth } from '../context/AuthContext';
import axiosInstanceUtility from '../utils/axiosInstanceUtility';
import { useOtherContext } from '../context/OtherContext';

// Dummy chart dataset for SaaS metrics
const chartData = [
  { day: 'Jun 06', queries: 25, scans: 12 },
  { day: 'Jun 07', queries: 38, scans: 19 },
  { day: 'Jun 08', queries: 41, scans: 22 },
  { day: 'Jun 09', queries: 55, scans: 31 },
  { day: 'Jun 10', queries: 62, scans: 28 },
  { day: 'Jun 11', queries: 75, scans: 43 },
  { day: 'Jun 12', queries: 92, scans: 48 },
];

export const DashboardHome: React.FC = () => {
  const { subscription, theme } = useAppContext();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();
  const {pdfs, collections} = useOtherContext()

  // Metrics calculating
  const totalPdfs = pdfs.length;
  const queriesCount = subscription.queriesUsed;
  const currentFid = '94.2%';

  const stats = [
    { label: 'Grounded PDFs', value: `${totalPdfs} items`, limit: `limit ${subscription.pdfLimit}`, icon: FileText, color: 'text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400' },
    { label: 'RAG Queries Resolved', value: `${queriesCount} calls`, limit: `limit ${subscription.queriesLimit}`, icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400' },
    { label: 'Cluster Vector Space', value: `${subscription.storageUsed} MB`, limit: `limit ${subscription.storageLimit} MB`, icon: Database, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/20 dark:text-violet-400' },
    { label: 'Avg Grounded Confidence', value: currentFid, limit: 'Strict semantic filter', icon: CircleGauge, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400' },
  ];

  return (
    <div className="space-y-6">

      {/* SaaS Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50/70 via-slate-50 to-indigo-50/40 dark:from-slate-900 dark:via-indigo-950 dark:to-indigo-900 border border-indigo-100 dark:border-slate-800 text-slate-800 dark:text-white relative overflow-hidden shadow-sm dark:shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl shrink-0" />
        <div className="absolute left-1/3 bottom-0 translate-y-16 h-48 w-48 bg-violet-600/10 dark:bg-violet-600/10 rounded-full blur-2xl shrink-0" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-1.5 max-w-xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100/60 dark:bg-white/10 rounded-full text-xs font-semibold tracking-wide text-indigo-700 dark:text-indigo-200 self-start">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Multi-Tenant RAG Enclave Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-snug mt-2">Welcome Back to Cognitive Workspace</h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-indigo-200 leading-normal font-medium mt-1">
              Ask and extract intelligence from your PDF archives. Upload new manuals to ground conversations with physical citations instantly.
            </p>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <Button onClick={() => setShowUploadModal(true)} variant="outline" className="border-indigo-200 dark:border-indigo-500/35 bg-indigo-50/40 dark:bg-white/5 text-indigo-700 dark:text-white hover:bg-indigo-100/50 dark:hover:bg-white/10">
              <Plus className="h-4.5 w-4.5" />
              <span>Vectorize Doc</span>
            </Button>
            <Button onClick={() => navigate('/dashboard/chat')} className="bg-indigo-650 text-white dark:bg-white dark:text-indigo-950 hover:bg-indigo-700 dark:hover:bg-slate-100 shadow-none">
              <span>Start Chat Room</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800 shadow-sm flex justify-between items-start">
            <div className="flex flex-col text-left">
              <span className="text-xs text-slate-500 dark:text-slate-450 font-bold uppercase tracking-wider">{stat.label}</span>
              <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-1">{stat.value}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-2 tracking-tight">{stat.limit}</span>
            </div>
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS GRAPH & SYSTEM ACTIONS split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Graph metric card */}
        <Card
          title="RAG Activity Analytics"
          description="Correlating daily vector lookup queries against raw parsing scans."
          className="lg:col-span-2"
          headerAction={
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-650 dark:text-indigo-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+31.2% this week</span>
            </div>
          }
        >
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#F1F5F9'} vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: 'white', borderRadius: '12px', borderColor: '#1E293B', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="queries" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorQueries)" name="Vector Queries" />
                <Area type="monotone" dataKey="scans" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScans)" name="Document Scans" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Workspace shortcuts */}
        <Card title="Quick Sandbox Channels" description="Fast gates to execute PDF analysis routines." className="flex flex-col justify-between">
          <div className="space-y-4">
            <div
              onClick={() => navigate('/dashboard/pdfs')}
              className="p-3 border border-slate-100 hover:border-indigo-400 dark:border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition bg-slate-50/50 dark:bg-slate-850/20"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">Review PDF Lib</span>
                  <span className="text-[10px] text-slate-450 truncate">Total grounded item repositories ({pdfs.length})</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>

            <div
              onClick={() => navigate('/dashboard/chat')}
              className="p-3 border border-slate-100 hover:border-indigo-400 dark:border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition bg-slate-50/50 dark:bg-slate-850/20"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className="h-5 w-5 text-emerald-500 shrink-0" />
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">Active Chat Screen</span>
                  <span className="text-[10px] text-slate-450 truncate">Explore papers with citations</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </Card>
      </div>

      
      {/* FLOAT MODAL FOR SIMULATED DOCUMENTS VECTORIZATION */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Vectorize Documents to RAG Engine"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-semibold">
            Upload document files (PDFs). We chunk and parse your texts segment by segment. Ground AI models with physical pointers.
          </p>
          <UploadPDFBox collectionsList={collections}
            onUploadSuccess={(title, size, pages) => {
              
              setShowUploadModal(false);
            }}
          />
        </div>
      </Modal>

    </div>
  );
};
