import React from 'react';
import {
  Sparkles,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Link as LinkIcon,
  Paperclip,
  Send,
  CornerDownLeft,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { ChatMessage, Citation } from '../../types';

// Simple text formatter supporting bold, backticks, bullet points, headers, etc.
const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatChatMessage = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // bullet points
    if (line.startsWith('- ')) {
      return (
        <li key={idx} className="ml-4 list-disc text-xs md:text-sm my-1 pl-1">
          {formatInline(line.slice(2))}
        </li>
      );
    }
    // numbered points
    if (/^\d+\.\s/.test(line)) {
      const parts = line.split(/^\d+\.\s/);
      return (
        <li key={idx} className="ml-4 list-decimal text-xs md:text-sm my-1 pl-1">
          {formatInline(parts[1])}
        </li>
      );
    }
    // Headers
    if (line.startsWith('### ')) {
      return <h4 key={idx} className="font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100 mt-3 mb-1">{line.slice(4)}</h4>;
    }
    if (line.startsWith('## ')) {
      return <h3 key={idx} className="font-extrabold text-sm text-slate-800 dark:text-slate-50 mt-4 mb-1.5">{line.slice(3)}</h3>;
    }
    if (line.startsWith('# ')) {
      return <h2 key={idx} className="font-extrabold text-base text-slate-900 dark:text-white mt-5 mb-2">{line.slice(2)}</h2>;
    }
    // standard paragraph
    return (
      <p key={idx} className="text-xs md:text-sm my-2 leading-relaxed">
        {formatInline(line)}
      </p>
    );
  });
};

const formatInline = (text: string): React.ReactNode => {
  // Bold math formulation, code segments, and **bold text**
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\$\$.*?\$\$)/);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return <span key={idx} className="font-mono bg-slate-50 dark:bg-slate-800/60 p-1 px-1.5 rounded text-indigo-650 dark:text-indigo-300 select-all font-semibold my-1 inline-block">{part.slice(2, -2)}</span>;
    }
    return part;
  });
};

// ============================================================================
// INDIVIDUAL CITATION CARD
// ============================================================================
interface SourceCardProps {
  citation: Citation;
  onClick?: () => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({ citation, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-3 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-800 rounded-xl cursor-not-allowed select-none transition-all flex flex-col gap-1.5 w-full text-left"
    >
      <div className="flex items-center gap-2 overflow-hidden shrink-0">
        <FileText className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{citation.pdfTitle}</span>
        <span className="text-[9px] font-extrabold bg-indigo-50 dark:bg-slate-750 text-indigo-700 dark:text-indigo-400 px-1 rounded ml-auto">
          pg {citation.page}
        </span>
      </div>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug italic font-medium">
        "{citation.snippet}"
      </p>
    </div>
  );
};

// ============================================================================
// INTERACTIVE CHAT BUBBLE
// ============================================================================
interface ChatBubbleProps {
  message: ChatMessage;
  onReferenceClick?: (cit: Citation) => void;
  onRegenerate?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onReferenceClick,
  onRegenerate
}) => {
  const isAss = message.role === 'assistant';
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'up' | 'down' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-4 md:p-5 rounded-2xl flex gap-3.5 ${isAss
      ? 'bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800 shadow-sm'
      : 'bg-indigo-50/30 border border-indigo-100/20 dark:bg-slate-900/30 dark:border-slate-850'
      }`}>

      {/* Dynamic Avatar */}
      <div className="shrink-0 pt-0.5">
        {isAss ? (
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none font-bold">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
        ) : (
          <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            AI
          </div>
        )}
      </div>

      {/* Message framework */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Username and time header */}
        <div className="flex items-center gap-2 mb-1 shrink-0">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {isAss ? 'Cognitive AI Agent' : 'You'}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {formatMessageTime(message.timestamp)}
          </span>

          {/* Confidences Badge check */}
          {isAss && message.confidenceScore !== undefined && (
            <div className="ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/10 rounded-full text-[9px] font-black text-emerald-650 dark:text-emerald-400">
              <BadgeCheck className="h-3 w-3 shrink-0" />
              <span>Grounded {message.confidenceScore}%</span>
            </div>
          )}
        </div>

        {/* Message body */}
        <div className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-full">
          {formatChatMessage(message.content)}
        </div>

        {/* Citations display cards */}
        {isAss && message.citations && message.citations.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 shrink-0">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1 pb-1">
              <LinkIcon className="h-3 w-3 text-indigo-500" />
              <span>Source References ({message.citations.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              {message.citations.map(cit => (
                <SourceCard
                  key={cit.id}
                  citation={cit}
                  onClick={() => onReferenceClick && onReferenceClick(cit)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions panel */}
        {isAss && (
          <div className="mt-4.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-slate-400 dark:text-slate-500 select-none shrink-0">
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="h-7 w-7 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center cursor-pointer transition relative"
                title="Copy answer text"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied && (
                  <span className="absolute -top-7 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap">Copied</span>
                )}
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="h-7 w-7 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center cursor-pointer transition"
                  title="Regenerate reply"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setFeedback('up')}
                className={`h-7 w-7 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition ${feedback === 'up' ? 'text-emerald-500 hover:text-emerald-600' : 'hover:text-slate-700'}`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setFeedback('down')}
                className={`h-7 w-7 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition ${feedback === 'down' ? 'text-amber-500 hover:text-amber-600' : 'hover:text-slate-700'}`}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ============================================================================
// CHAT INPUT COMPONENT (CHATGPT + PERPLEXITY STYLE)
// ============================================================================
interface ChatBarProps {
  onSend: (text: string) => void;
  attachedPdfs: string[];
  onAttachPdf: () => void;
  isStreaming?: boolean;
}

export const ChatBar: React.FC<ChatBarProps> = ({
  onSend,
  attachedPdfs,
  onAttachPdf,
  isStreaming = false
}) => {
  const [input, setInput] = React.useState('');
  const [model, setModel] = React.useState('smart'); // smart = Gemini-Flash v2, base = Fast-Retrieval

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSend(input);
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-xl w-full flex flex-col gap-2"
    >
      {/* Active Model Picker and Attached status badges */}
      <div className="flex items-center gap-2 px-2 pb-1 bg-slate-50/50 dark:bg-slate-850/50 py-1 rounded-xl">
        {attachedPdfs.length > 0 ? (
          <div
            onClick={onAttachPdf}
            className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-1 px-2.5 rounded-lg cursor-pointer hover:bg-emerald-100 transition shrink-0"
          >
            <Paperclip className="h-3 w-3 shrink-0" />
            <span>{attachedPdfs.length} Doc Context Attached</span>
          </div>
        ) : (
          <div
            onClick={onAttachPdf}
            className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer transition"
          >
            <Paperclip className="h-3 w-3 shrink-0" />
            <span>Connect PDF search memory</span>
          </div>
        )}
      </div>

      {/* Main input layout */}
      <div className="flex items-end gap-3.5">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask a cognitive question... (e.g. explain self-attention or how Cognitive multi-tenant works)"
          className="flex-1 bg-transparent border-none text-xs md:text-sm font-medium text-slate-850 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 max-h-40 overflow-y-auto resize-none py-1.5 px-2 focus:outline-none focus:ring-0 leading-relaxed"
        />

        <div className="flex items-center gap-2 pr-1 shrink-0">
          <button
            type="button"
            onClick={onAttachPdf}
            className="h-10 w-10 cursor-pointer rounded-xl border border-slate-150 hover:bg-slate-50 text-slate-600 dark:border-slate-800 dark:hover:bg-slate-800 flex items-center justify-center transition active:scale-95"
            title="Attach documents"
          >
            <Paperclip className="h-4.5 w-4.5" />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="
                  h-11 px-5 rounded-xl
                  bg-gradient-to-r from-indigo-600 to-violet-600
                  hover:from-indigo-700 hover:to-violet-700
                  dark:from-indigo-500 dark:to-violet-500
                  dark:hover:from-indigo-400 dark:hover:to-violet-400
                  text-white font-medium
                  flex items-center gap-2
                  shadow-lg hover:shadow-xl
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  active:scale-95
                "
          >
            <span>Ask</span>
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </form>
  );
};
