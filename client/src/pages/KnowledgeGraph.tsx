import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, 
  Sparkles, 
  Compass, 
  HelpCircle, 
  BookOpen, 
  GitBranch, 
  Layers, 
  Eye
} from 'lucide-react';
import { Card, Button } from '../components/common/UIControls';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  category: 'LLM Core' | 'Indexing' | 'Security';
  description: string;
  sourceDoc: string;
}

interface GraphLink {
  source: string;
  target: string;
}

const mockNodes: GraphNode[] = [
  { id: 'n1', label: 'Self-Attention', x: 120, y: 150, category: 'LLM Core', description: 'Mechanisms correlating tokens inside sequences simultaneously inside Transformers.', sourceDoc: 'Attention Is All You Need' },
  { id: 'n2', label: 'Multi-Head Attention', x: 260, y: 110, category: 'LLM Core', description: 'Splits query matrices into projection subspaces to let models attend to many points.', sourceDoc: 'Attention Is All You Need' },
  { id: 'n3', label: 'Advanced RAG', x: 180, y: 280, category: 'Indexing', description: 'Optimizes raw queries and pre-filters paragraphs prior to prompt generation.', sourceDoc: 'Retrieval-Augmented Generation Survey' },
  { id: 'n4', label: 'Reranker Model', x: 380, y: 240, category: 'Indexing', description: 'Rescores candidate snippets retrieved by fast vector indexes to maximize relevance.', sourceDoc: 'Retrieval-Augmented Generation Survey' },
  { id: 'n5', label: 'Hierarchical Chunking', x: 420, y: 380, category: 'Indexing', description: 'Maintains dual parent-child text splits to preserve broad contexts during index queries.', sourceDoc: 'Cognitive AI Enterprise Architecture Guide' },
  { id: 'n6', label: 'Vector Database', x: 550, y: 220, category: 'Indexing', description: 'Index store designed to execute rapid multidimensional cosine comparisons.', sourceDoc: 'Retrieval-Augmented Generation Survey' },
  { id: 'n7', label: 'Document Isolation', x: 500, y: 90, category: 'Security', description: 'Appends strict tenancy metadata checks to prevent query leakage across workspaces.', sourceDoc: 'Cognitive AI Enterprise Architecture Guide' },
];

const mockLinks: GraphLink[] = [
  { source: 'n1', target: 'n2' },
  { source: 'n2', target: 'n3' },
  { source: 'n3', target: 'n4' },
  { source: 'n3', target: 'n5' },
  { source: 'n4', target: 'n6' },
  { source: 'n5', target: 'n6' },
  { source: 'n6', target: 'n7' },
  { source: 'n2', target: 'n7' }
];

export const KnowledgeGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(mockNodes[2]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 relative select-none">
      
      {/* Header instructions info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">AI Insights & Knowledge Graph</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualizing semantic vector correlations across our parsed workspace documents. Click concepts below to examine relationships.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-100 dark:border-slate-800 dark:bg-slate-900 text-xs text-violet-750 dark:text-violet-450 font-bold">
          <BrainCircuit className="h-4 w-4 animate-pulse shrink-0" />
          <span>Dynamic RAG Vector Map</span>
        </div>
      </div>

      {/* CORE GRAPH LAYOUT SPLIT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left SVG graph board */}
        <Card 
          title="Interactive Concept Network" 
          description="Interactive map of entity nodes and logic links extracted across PDF index."
          className="lg:col-span-2 overflow-hidden bg-slate-950 text-white relative border-slate-900 shadow-xl"
          headerAction={
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-slate-450 flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded leading-none">
                <Compass className="h-3.5 w-3.5 text-indigo-505" />
                <span>Scroll / drag supported</span>
              </span>
            </div>
          }
        >
          {/* Legend indicator badges */}
          <div className="absolute top-18 left-5 flex gap-3 text-[10px] font-black uppercase tracking-wider text-slate-400 z-10">
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 px-2.5 rounded-lg border border-slate-800">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
              <span>LLM Core Models</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 px-2.5 rounded-lg border border-slate-800">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Indexing RAG</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 px-2.5 rounded-lg border border-slate-800">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-500 shrink-0" />
              <span>Multi-Tenant Gateways</span>
            </div>
          </div>

          <div className="h-96 mt-4 relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-850">
            
            {/* Real reactive SVG elements represent node links */}
            <svg className="h-full w-full">
              <g>
                {/* Connections render links */}
                {mockLinks.map((link, idx) => {
                  const s = mockNodes.find(n => n.id === link.source);
                  const t = mockNodes.find(n => n.id === link.target);
                  if (s && t) {
                    const isFocus = s.id === selectedNode.id || t.id === selectedNode.id;
                    const isHover = s.id === hoveredNode || t.id === hoveredNode;
                    return (
                      <line
                        key={idx}
                        x1={s.x}
                        y1={s.y}
                        x2={t.x}
                        y2={t.y}
                        stroke={isFocus ? '#818CF8' : isHover ? '#4F46E5' : '#1E293B'}
                        strokeWidth={isFocus ? 2.5 : isHover ? 2 : 1}
                        strokeDasharray={isFocus ? 'none' : '3 3'}
                        className="transition-colors duration-200"
                      />
                    );
                  }
                  return null;
                })}

                {/* Nodes rendering circle coordinates */}
                {mockNodes.map((node) => {
                  const isSelect = node.id === selectedNode.id;
                  const isHover = node.id === hoveredNode;
                  const color = node.category === 'LLM Core' ? '#4F46E5' : node.category === 'Indexing' ? '#10B981' : '#8B5CF6';

                  return (
                    <g 
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className="cursor-pointer select-none"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelect ? 16 : isHover ? 13 : 10}
                        fill={color}
                        className="transition-all duration-300"
                        stroke="#0F172A"
                        strokeWidth={3}
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelect ? 22 : isHover ? 17 : 0}
                        fill="none"
                        stroke={color}
                        strokeWidth={1.5}
                        strokeOpacity={0.4}
                        className="transition-all duration-300"
                      />
                      <text
                        x={node.x}
                        y={node.y + (isSelect ? 34 : 26)}
                        textAnchor="middle"
                        fill={isSelect ? 'white' : '#94A3B8'}
                        fontSize={10}
                        fontWeight={isSelect ? 'bold' : 'normal'}
                        className="transition-all duration-200 font-sans"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

          </div>
        </Card>

        {/* Right Detail Card overview */}
        <Card 
          title="Concept Metadata Drawer" 
          description="Detailed terminology abstract parsed by semantic analysis."
          className="flex flex-col justify-between"
          footer={
            <div className="flex gap-2 w-full">
              <Button onClick={() => navigate('/chat')} className="w-full h-11">
                <BrainCircuit className="h-4.5 w-4.5 shrink-0" />
                <span>Ask AI Chat Session</span>
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-left">
            <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-slate-850 border border-indigo-100 dark:border-slate-850">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400">ACTIVE CONCEPT SELECTION</span>
              <h2 className="text-lg font-black text-slate-800 dark:text-white mt-1 leading-snug">{selectedNode.label}</h2>
              <span className="inline-flex mt-2.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-bold">
                Category: {selectedNode.category}
              </span>
            </div>

            <div>
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Parsed abstract Definition</h4>
              <p className="text-xs md:text-sm text-slate-705 dark:text-slate-300 leading-relaxed font-semibold">
                {selectedNode.description}
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1 leading-none">
                <BookOpen className="h-3.5 w-3.5 text-indigo-505" />
                <span>Matched Source Document</span>
              </h4>
              <div 
                onClick={() => navigate('/pdfs')}
                className="p-3 border border-slate-100 hover:border-indigo-400 dark:border-slate-800 rounded-xl bg-slate-50/50 hover:bg-white dark:bg-slate-850/10 cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2 overflow-hidden leading-none">
                  <BookOpen className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-205 truncate max-w-44">{selectedNode.sourceDoc}</span>
                </div>
                <Eye className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
};
