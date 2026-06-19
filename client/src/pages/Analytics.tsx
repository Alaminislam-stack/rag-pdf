import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  ThumbsUp, 
  ArrowUpRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Card, Table } from '../components/common/UIControls';

const queryStatsData = [
  { name: 'Semantic Acc.', value: 96, fill: '#4F46E5' },
  { name: 'Factual Grounding', value: 94, fill: '#10B981' },
  { name: 'Citation Integrity', value: 98, fill: '#8B5CF6' },
  { name: 'Model Alignment', value: 92, fill: '#F59E0B' }
];

const satisfactionData = [
  { name: 'Positive Answer Ratings', value: 85 },
  { name: 'Regenerated Feedback', value: 11 },
  { name: 'Disliked Explanations', value: 4 }
];
const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const latencyData = [
  { hour: '08:00', latency: 420 },
  { hour: '10:00', latency: 680 },
  { hour: '12:00', latency: 510 },
  { hour: '14:00', latency: 720 },
  { hour: '16:00', latency: 490 },
  { hour: '18:00', latency: 380 }
];

const mockRAGLogs = [
  { id: 'log-1', query: 'Can you analyze self-attention formulas?', doc: 'Attention Is All You Need', latency: '420ms', status: 'Success', confidence: '97%' },
  { id: 'log-2', query: 'How does advanced RAG optimize context?', doc: 'Retrieval-Augmented Generation Survey', latency: '680ms', status: 'Success', confidence: '94%' },
  { id: 'log-3', query: 'Explain Stripe webhook signing keys', doc: 'Stripe API Quickstart & Core Integration', latency: '510ms', status: 'Success', confidence: '91%' },
  { id: 'log-4', query: 'What is document isolation policy?', doc: 'Cognitive AI Enterprise Architecture Guide', latency: '490ms', status: 'Success', confidence: '96%' }
];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Analytics header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">System Performance & Auditor Logs</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Grounding statistics, RAG search latency metrics, and absolute vector accuracy benchmarks.</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-900 text-xs font-bold text-indigo-700 dark:text-indigo-400">
          <Award className="h-4 w-4 shrink-0" />
          <span>SOC2 & ISO Compliant Sandbox</span>
        </div>
      </div>

      {/* KPI METADATA Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-550/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-slate-400">RAG Grounded Ratio</span>
            <span className="text-lg font-black text-slate-850 dark:text-white">96.4%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-550/15 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-slate-400">Average RAG Latency</span>
            <span className="text-lg font-black text-slate-850 dark:text-white">525 ms</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-violet-550/10 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-slate-400">Retrieval Efficiency</span>
            <span className="text-lg font-black text-slate-850 dark:text-white">99.8%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-amber-550/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
            <ThumbsUp className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-slate-400">Absolute Satisfaction</span>
            <span className="text-lg font-black text-slate-850 dark:text-white">98.1%</span>
          </div>
        </div>
      </div>

      {/* RECHARTS CHANNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RAG accuracy chart */}
        <Card title="Grounded Accuracy Benchmarks" description="Validation breakdown across specific criteria metrics." className="lg:col-span-2">
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queryStatsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', color: 'white', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {queryStatsData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Satisfaction Pie chart */}
        <Card title="Model Feedback Distribution" description="User alignment and dislike telemetry metrics.">
          <div className="h-64 mt-4 w-full flex flex-col justify-center items-center">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: 'white', borderRadius: '12px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom indicators legends */}
            <div className="flex gap-4.5 mt-2 justify-center text-[10px] font-extrabold text-slate-500 uppercase tracking-tight">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Like</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                <span>Retry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                <span>Dislike</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Latency line chart overall */}
        <Card title="Average System Latency Over Hours" description="Evaluates cluster search speed across daily usage volume peaks." className="lg:col-span-3">
          <div className="h-60 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: 'white', borderRadius: '12px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="latency" stroke="#4F46E5" strokeWidth={3} dot={{ stroke: '#818CF8', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="Latency (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* AUDIT LOG TABLE */}
      <div>
        <h3 className="font-extrabold text-[15px] text-slate-850 dark:text-white mb-3 tracking-tight">Recent RAG Operation Audit Trails</h3>
        <Table 
          columns={[
            { header: 'Resolved Query Focus', accessor: (row) => (
              <span className="font-bold text-slate-700 dark:text-slate-200">"{row.query}"</span>
            ) },
            { header: 'Matched PDF context', accessor: (row) => (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-450">{row.doc}</span>
            ) },
            { header: 'Audit Latency', accessor: (row) => (
              <span className="font-semibold text-slate-500">{row.latency}</span>
            ) },
            { header: 'Trace Status', accessor: (row) => (
              <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                {row.status}
              </span>
            ) },
            { header: 'Confidence Match', accessor: (row) => (
              <span className="font-black text-indigo-600 dark:text-indigo-400">{row.confidence}</span>
            ) }
          ]}
          data={mockRAGLogs}
        />
      </div>

    </div>
  );
};
