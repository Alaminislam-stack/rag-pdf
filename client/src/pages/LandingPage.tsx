import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Shield,
  Share2,
  HelpCircle,
  ChevronDown,
  Check,
  Moon,
  Sun,
  Database,
  Cpu,
  Network,
  FileCheck,
  Lock,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');

  // RAG Simulator States
  const [selectedDoc, setSelectedDoc] = useState<string>('SaaS Compliance Audit.pdf');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulateResult, setSimulateResult] = useState<{
    answer: string;
    citations: { source: string; page: number; score: number; text: string }[];
  } | null>(null);

  // FAQ Accordion States
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { session } = useAuth();
  const user = session?.user;

  const sampleQuestions = [
    {
      doc: 'SaaS Compliance Audit.pdf',
      query: 'What is our encryption standard in the cloud enclave?',
      answer: 'All workspace archives are isolated in multi-tenant secure enclaves. Primary encryption for stored PDF artifacts relies on AES-256 state cipher with automatic rotating envelope keys managed by Cloud KMS, maintaining military-grade privacy.',
      citations: [
        { source: 'Audit Report', page: 12, score: 0.98, text: 'Metadata and binary blobs are isolated matching strict residency guidelines, under rotational KMS key enforcements...' },
        { source: 'SLA Appendix V3', page: 4, score: 0.91, text: 'Enclave-wide network isolation guarantees that zero cross-tenant leaking occurs during embeddings generation.' }
      ]
    },
    {
      doc: 'Global Market Report 2026.pdf',
      query: 'What is the projected CAGR for deep retrieval tech?',
      answer: 'Based on global projections, conversational AI search and semantic retrieval pipelines represent the fastest growing enterprise sectors, accelerating at a 34.2% compound annual growth rate (CAGR) from 2024 to 2030.',
      citations: [
        { source: 'Market Analysis', page: 87, score: 0.96, text: 'The CAGR in neural search exceeds early NLP benchmarks as global enterprises migrate from lexical Keyword search to dense vector models.' },
        { source: 'Strategic Outlook', page: 114, score: 0.89, text: 'Enterprises deploying retrieval-augmented mechanisms reported an immediate 43% reduction in audit response lag times.' }
      ]
    }
  ];

  const handleSimulate = (question: typeof sampleQuestions[0]) => {
    setIsSimulating(true);
    setSimulateResult(null);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulateResult({
        answer: question.answer,
        citations: question.citations
      });
    }, 1200);
  };

  const faqItems = [
    {
      q: "How does the PDF Vectorization process operate?",
      a: "When you upload a PDF, our pipeline splits the document into logical paragraphs, respects formatting, respects table nodes, generates high-dimensional embeddings using neural encoders, and registers those vectors to a secure enclave index immediately. It is completely automatic."
    },
    {
      q: "Are my enterprise documents safe from unauthorized access?",
      a: "Yes, absolutely. We enforce secure local-storage guidelines in standard sessions and full cryptographic isolation for accounts. Your files are shielded in sandbox containers and are never used to train global public AI models."
    },
    {
      q: "Are the AI agent responses backed by verifiable citations?",
      a: "Every single chat answer is augmented strictly by text chunks fetched from your files. Answers include interactive micro-tags mapping back to the precise page, title line, and semantic score from the original PDF."
    },
    {
      q: "Can I manage multiple collections for different research teams?",
      a: "Yes, our interactive workspace allows organizing documents into distinct collections (e.g., Marketing, Legal, Compliance, Core Engineering) with custom color identifiers and granular indexing options."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* 1. TOP HEADER / HERO INNER NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/60 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight leading-none text-base">COGNITIVE AI</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase mt-1">SaaS PDF Enclave</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Interactive Demo</a>
            <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
              title="Toggle view theme mode"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Enter App</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                </>
            )}
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-28 overflow-hidden">
        {/* Ambient Blurred Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-[90%] max-w-5xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">

          {/* Spark Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Introducing Cognitive V2 Neural Extraction Engine</span>
            <span className="text-[10px] bg-indigo-200/60 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.5 rounded ml-1 font-bold">NEW</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-4xl mx-auto mb-6 text-center">
            Extract Intelligent Answers from Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">PDF Archives</span> Instantly
          </h1>

          {/* Subtitle description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-350 max-w-2xl mx-auto mb-10 leading-relaxed text-center">
            Upload manuals, research dossiers, or compliance audits. Ground a secure conversational agent equipped with dynamic citations, vector timelines, and custom visual webs.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <span>Initialize PDF Enclave Free</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#demo"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/55 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Watch Interactive Demo</span>
            </a>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Cpu, title: "Neural Grounding", desc: "No AI hallucinations" },
              { icon: Shield, title: "Enclave Privacy", desc: "Cryptographic sandbox isolation" },
              { icon: FileCheck, title: "Instant Citations", desc: "Verifiable PDF page maps" },
              { icon: Network, title: "Graph Visualizations", desc: "Interactive conceptual node-mesh" }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col items-center text-center">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-2.5">
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white leading-tight">{item.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. LIVE INTERACTIVE RAG SIMULATOR PLAYGROUND */}
      <section id="demo" className="py-16 md:py-24 bg-slate-100/60 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-900/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Test Ride the Conversational RAG Simulator
            </h2>
            <p className="text-slate-500 dark:text-slate-350 mt-2 text-sm sm:text-base">
              Experience the sub-second retrieval accuracy of the enclave. Click one of our sample PDF files, inspect the queries, and launch the RAG solver!
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Control Panel (left column) */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase block text-left">
                STEP 1: SELECT REFERENCE DOCUMENT
              </span>

              <div className="space-y-2 text-left">
                {[
                  { name: 'SaaS Compliance Audit.pdf', size: '1.4 MB', pages: 28 },
                  { name: 'Global Market Report 2026.pdf', size: '3.1 MB', pages: 142 }
                ].map(doc => (
                  <button
                    key={doc.name}
                    onClick={() => {
                      setSelectedDoc(doc.name);
                      setSimulateResult(null);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${selectedDoc === doc.name
                        ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900/60'
                      }`}
                  >
                    <FileText className={`h-5 w-5 mt-0.5 ${selectedDoc === doc.name ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white truncate">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">{doc.size} • {doc.pages} Pages • Vector Matrix Generated</p>
                    </div>
                    {selectedDoc === doc.name && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 self-center" />}
                  </button>
                ))}
              </div>

              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase block pt-4 text-left">
                STEP 2: LAUNCH COGNITIVE QUERY
              </span>

              <div className="space-y-2">
                {sampleQuestions
                  .filter(q => q.doc === selectedDoc)
                  .map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSimulate(q)}
                      disabled={isSimulating}
                      className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-between gap-2 text-left group"
                    >
                      <span className="truncate">{q.query}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
              </div>
            </div>

            {/* Virtual Enclave Terminal / Chat Frame (right column) */}
            <div className="lg:col-span-8 bg-slate-900 text-slate-200 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative h-[420px] flex flex-col font-mono text-left">

              {/* Device Header bar */}
              <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-300 ml-2">CONGEN_RAG_ENCLAVE: ~/{selectedDoc}</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-indigo-950 px-2 py-0.5 rounded text-indigo-400 font-bold border border-indigo-900/30">
                  <Lock className="h-3 w-3" />
                  <span>AES-256 SECURE</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">

                {/* Simulated Doc Vector Nodes Status lines */}
                <div className="text-[11px] text-indigo-400 leading-normal border-b border-slate-800 pb-3 space-y-0.5">
                  <p>&gt; sys_enclave_status: CONNECTED_ACTIVE</p>
                  <p>&gt; load_embeddings_space: loaded 512 multidimensional dense nodes</p>
                  <p>&gt; vector_indexing: success [cosine query index prepared]</p>
                </div>

                {!isSimulating && !simulateResult && (
                  <div className="h-44 flex flex-col items-center justify-center text-center text-slate-500 space-y-2 font-sans px-4">
                    <Database className="h-8 w-8 text-indigo-400/45 animate-bounce" />
                    <p className="text-xs font-semibold text-slate-300">Enclave waiting for input query</p>
                    <p className="text-[11px] text-slate-500">Pick a query preset in Step 2 to generate dense embedding matches and fetch page citations instantly.</p>
                  </div>
                )}

                {isSimulating && (
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-xs text-indigo-400">
                      <Zap className="h-4 w-4 animate-spin" />
                      <span>Matching cosine centroids across {selectedDoc}...</span>
                    </div>
                    <div className="space-y-1.5 pl-6">
                      <div className="h-2.5 bg-slate-800 rounded w-4/5 animate-pulse" />
                      <div className="h-2.5 bg-slate-800 rounded w-11/12 animate-pulse" />
                      <div className="h-2.5 bg-slate-800 rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                )}

                {simulateResult && (
                  <div className="space-y-4 animate-in fade-in duration-300">

                    {/* Bot Answer */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                        <Cpu className="h-3.5 w-3.5" />
                        <span>COGNITIVE AGENT RESPONSE</span>
                      </div>
                      <p className="text-xs text-slate-300 pl-5 leading-relaxed font-sans">{simulateResult.answer}</p>
                    </div>

                    {/* Citations block */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-800/85">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                        <FileCheck className="h-3.5 w-3.5" />
                        <span>GROUNDED CITATIONS & EXCERPTS ({simulateResult.citations.length})</span>
                      </div>

                      <div className="space-y-2 pl-5">
                        {simulateResult.citations.map((cite, idx) => (
                          <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans mb-1 font-semibold">
                              <span className="text-indigo-400">Source: {selectedDoc} &gt; {cite.source}</span>
                              <div className="flex gap-2">
                                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-white">Page {cite.page}</span>
                                <span className="bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded">Match: {(cite.score * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-normal italic pl-2.5 border-l border-indigo-500/40 font-serif">
                              &ldquo;{cite.text}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Console Prompt bar at bottom */}
              <div className="bg-slate-950 p-3 pt-2 text-[10px] text-slate-500 border-t border-slate-800 font-mono text-center flex justify-between items-center px-4">
                <span>SYSTEM_VARS: [MODEL_GEMINI_3.5_FLASH, TEMPERATURE_0.1, RETRIEVAL_TOP_K_3]</span>
                <span className="text-emerald-500 font-bold">&#x25CF; CONSOLE BUFFER SYNCED</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. KEY CAPABILITIES (BENTO FEATURES GRID) */}
      <section id="features" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase block mb-2">PRODUCT MATRIX</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed for High-fidelity Intellectual Work
            </h2>
            <p className="text-slate-500 dark:text-slate-350 text-sm sm:text-base mt-2">
              Say goodbye to AI hallucinations, manual control searches, and scattered paper logs. We bring structured node navigation directly to your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Bento item 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 font-semibold">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dynamic Chat Grounding</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Query single documents or combined collection folders simultaneously. Our system limits references strictly to facts directly stated in your uploads.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-650 dark:text-indigo-400 font-bold tracking-wide uppercase flex items-center gap-1">
                <span>Strict Retrieval Engine</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>

            {/* Bento item 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5 font-semibold">
                  <Network className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Automated Knowledge Graphs</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Every uploaded PDF generates high-dimensional relationships. Toggle the semantic visualizer web to observe how files map and connect.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-650 dark:text-indigo-400 font-bold tracking-wide uppercase flex items-center gap-1">
                <span>Interactive Semantic Webs</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>

            {/* Bento item 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 font-semibold">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Enterprise-grade Isolation</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Your PDF contents remain proprietary. We isolate storage inside localized workspace enclaves equipped with strict access guardrails.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-650 dark:text-indigo-400 font-bold tracking-wide uppercase flex items-center gap-1">
                <span>GDPR / CCPA Compliant sandbox</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>

            {/* Bento item 4 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 font-semibold">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Split-pane Reading Canvas</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Split your workspace view to read original PDF pages side-by-side with active AI logs, custom notes edits, and key concepts tables.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-650 dark:text-indigo-400 font-bold tracking-wide uppercase flex items-center gap-1">
                <span>Integrated PDF Viewer</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>

            {/* Bento item 5 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5 font-semibold">
                  <Share2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Team Collections Hub</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Sort research files, papers, or regulatory dossiers into logical collection folders. Color code folders and tag categories for swift search retrieval.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-650 dark:text-indigo-400 font-bold tracking-wide uppercase flex items-center gap-1">
                <span>Collaborative Nodes</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>

            {/* Bento item 6 */}
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-indigo-900 to-indigo-750 text-white shadow-xl flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 h-24 w-24 bg-white/10 rounded-full blur-xl" />
              <div>
                <div className="h-11 w-11 rounded-2xl bg-white/15 text-indigo-200 flex items-center justify-center mb-5 font-semibold">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Ready to Upgrade?</h3>
                <p className="text-indigo-200/85 text-xs sm:text-sm leading-relaxed">
                  Join hundreds of academic researchers, security auditors, legal analysts, and enterprise compliance teams today.
                </p>
              </div>
              <button
                onClick={() => navigate('/register')}
                className="mt-6 px-4 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-xs tracking-wide uppercase transition-colors text-center w-full shadow-md"
              >
                Get Started For Free
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/40 dark:border-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase block mb-2">SIMPLE PRICING</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Fair, Transparent Pricing Tiers
            </h2>
            <p className="text-slate-500 dark:text-slate-350 text-sm sm:text-base mt-2">
              Start parsing documents in our Sandbox tier completely free. Upgrade anytime with monthly or annual terms.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-8">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${billingPeriod === 'monthly'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${billingPeriod === 'yearly'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
              >
                <span>Yearly</span>
                <span className="text-[9px] bg-emerald-500 text-white px-1 py-0.5 rounded font-black tracking-wide leading-none uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch text-left">

            {/* Tier 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block mb-1">INDIVIDUAL</span>
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Sandbox Free</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">For testing out primary RAG functions on small archives.</p>

                <div className="my-6">
                  <span className="text-3xl font-extrabold text-slate-950 dark:text-white">$0</span>
                  <span className="text-xs text-slate-400 font-medium"> / forever</span>
                </div>

                <hr className="border-slate-100 dark:border-slate-800 my-6" />

                <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-350">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Upload up to 5 PDFs total</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>50 MB individual file limit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>100 AI queries per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Basic Citation view maps</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="w-full mt-8 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs tracking-wider uppercase hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              >
                Start Free Sandbox
              </button>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-600 shadow-xl relative flex flex-col justify-between">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                MOST POPULAR
              </div>

              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-indigo-650 dark:text-indigo-400 block mb-1">ACADEMICS & AUDITORS</span>
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Pro Scholar</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">For professional legal, medical, and scientific dossier indexing.</p>

                <div className="my-6">
                  <span className="text-4xl font-extrabold text-slate-950 dark:text-white">
                    ${billingPeriod === 'yearly' ? '15' : '19'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium"> / Month</span>
                  {billingPeriod === 'yearly' && (
                    <span className="block text-[10px] text-emerald-500 font-bold mt-1">Billed annually ($180/yr)</span>
                  )}
                </div>

                <hr className="border-slate-100 dark:border-slate-800 my-6" />

                <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-350">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold">Unlimited PDF Doc uploads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>250 MB individual file limit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold">5,000 vector queries /mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Dynamic Knowledge Graphs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Split-pane notes panel edits</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="w-full mt-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Access Pro Workspace
              </button>
            </div>

            {/* Tier 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block mb-1">ORGANIZATIONS</span>
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Corporate Enclave</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">For collaborative teams and high-compliance workspaces.</p>

                <div className="my-6">
                  <span className="text-3xl font-extrabold text-slate-950 dark:text-white">
                    ${billingPeriod === 'yearly' ? '79' : '99'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium"> / Month</span>
                  {billingPeriod === 'yearly' && (
                    <span className="block text-[10px] text-emerald-500 font-bold mt-1">Billed annually ($948/yr)</span>
                  )}
                </div>

                <hr className="border-slate-100 dark:border-slate-800 my-6" />

                <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-350">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Everything in Pro Scholar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold">Collaborative multi-user teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Dedicated vector DB instance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold">SAML SSO & MFA Login</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Priority compliance SLA</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="w-full mt-8 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs tracking-wider uppercase hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              >
                Deploy Secure Shield
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 md:py-28 bg-slate-100/30 dark:bg-slate-900/10 border-t border-slate-200/50 dark:border-slate-900/50 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase block mb-2">COMMON QUESTIONS</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-slate-350 mt-2 text-sm">
              Need technical clarifications? Find immediate, crystal clear definitions here.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      {item.q}
                    </span>
                    <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>

                  {isOpen && (
                    <p className="mt-3.5 pl-6.5 text-xs sm:text-sm text-slate-500 dark:text-slate-350 leading-relaxed border-l-2 border-indigo-500/25 animate-in fade-in slide-in-from-top-1 duration-150">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. SaaS CTA FOOTER AREA */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-12">

            {/* Branding Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/15">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-bold text-white tracking-tight leading-none text-[15px]">COGNITIVE AI PDF</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Uncompromising, citation-grounded vector indexing system translating high-compliance literature into accurate, verifiable dialogue instantly.
              </p>
              <p className="text-[11px] text-slate-500">
                &copy; {new Date().getFullYear()} Cognitive Inc. All rights reserved. Registered multi-tenant service.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3.5">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest text-left">PRODUCT</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Key Capabilities</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Structure</a></li>
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors text-left">User Workspace</button></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="md:col-span-4 space-y-4 text-left">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">GET WEEKLY UPDATES</h4>
              <p className="text-xs text-slate-400">Join our newsletter to receive vector news, RAG optimization updates, and enterprise system upgrades weekly.</p>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => alert("Successfully subscribed to security & optimization updates!")}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide cursor-pointer transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>

          </div>

          <hr className="border-slate-800/85 my-8" />

          {/* Infrastructure Credit Line keeping inline with system restrictions */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 active-pulse" />
              <span>System Base: React v18 + Vite Neural Stack</span>
            </div>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#terms" className="hover:text-slate-300">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
