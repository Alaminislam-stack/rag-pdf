import { useEffect, useState, useRef } from "react";
import { Menu, X, Send, FolderOpen } from "lucide-react";
import { useOtherContext } from "@/src/context/OtherContext";
import { ChatMessage } from "../types";
import { Link } from "react-router-dom";

function ChatHome() {
  const { collections, chat, pdfs } = useOtherContext();

  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState("creative");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const collectionId = selectedCollection?.id;

  const curPdfs = pdfs.filter((p) => p.collection_id === collectionId);
    
  // Clear messages when selected collection changes
  useEffect(() => {
    setMessages([]);
  }, [selectedCollection]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const createChat = async () => {
    if (!question.trim() || !selectedCollection || loading) return;

    const userQuery = question.trim();
    setQuestion("");

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await chat({ question: userQuery, collectionId, mode });
      if (res && res.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: res.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I couldn't retrieve an answer. Please check if your documents are uploaded properly.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "An error occurred while connecting to the AI service. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      createChat();
    }
  };


  return (
    <div className="h-full flex bg-white dark:bg-slate-950">
      {/* MOBILE OVERLAY */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-full
          w-72
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-800
          z-50
          transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-lg">Collections</h2>

          <button className="md:hidden" onClick={() => setDrawerOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="p-3 space-y-2 overflow-y-auto">
          {collections.length === 0 && (
            <>
            <Link to={"/dashboard/collections"}>
                <div className="text-center p-4">No collections yet, click here to add collections</div>
            </Link>
            </>
          )}
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => {
                setSelectedCollection(collection);
                setDrawerOpen(false);
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all
              ${selectedCollection?.id === collection.id
                  ? "bg-indigo-50 dark:bg-slate-800 border-indigo-500"
                  : "border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                }`}
            >
              <h3 className="font-semibold">{collection.name}</h3>

              <p className="text-xs text-slate-500 mt-1">Collection</p>
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-3">
          <button onClick={() => setDrawerOpen(true)} className="md:hidden">
            <Menu size={22} />
          </button>
          <div className="w-full flex justify-between items-center">
            <div>
              <h2 className="font-bold">
                {selectedCollection
                  ? selectedCollection.name
                  : "Select Collection"}
              </h2>

              <p className="text-xs text-slate-500">
                {selectedCollection
                  ? "Ask questions from this collection"
                  : "Choose collection first"}
              </p>
            </div>
            <div className="sm:hidden flex flex-col gap-1">
              <label
                htmlFor="mode"
                className="text-center text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                name="mode"
                id="mode"
                className="border border-slate-300 dark:border-slate-700 p-1 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="creative">Creative</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>
        </header>

        {/* CHAT BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedCollection ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FolderOpen size={70} className="mx-auto text-slate-400 mb-4" />

                <h2 className="text-2xl font-bold mb-2">Select a Collection</h2>

                <p className="text-slate-500">
                  Choose a collection from the sidebar to start chatting.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* AI Welcome */}
              <div className="bg-indigo-50 dark:bg-slate-800/50 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-2xl">
                <p className="text-indigo-900 dark:text-indigo-200 font-medium">
                  👋 Ask anything from <strong className="text-indigo-600 dark:text-indigo-400">{selectedCollection.name}</strong>
                </p>
                <p className="text-xs text-indigo-700/70 dark:text-indigo-300/70 mt-1">
                  Active Mode: <span className="capitalize font-semibold">{mode}</span>
                </p>
              </div>

              {/* MESSAGES LIST */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                    } mb-4`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm transition-all duration-200 ${message.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/55 dark:border-slate-700/50 rounded-tl-none"
                      }`}
                  >
                    {message.content}
                    <div
                      className={`text-[10px] mt-1.5 text-right ${message.role === "user"
                          ? "text-indigo-200"
                          : "text-slate-400"
                        }`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {/* THINKING INDICATOR */}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200/55 dark:border-slate-700/50 max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-none text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                    </span>
                    <span className="text-sm font-medium">Gemini is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* INPUT */}
        {curPdfs.length ? (
          <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <div className="hidden sm:flex flex-col gap-1">
              <label
                htmlFor="mode"
                className="text-center text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                name="mode"
                id="mode"
                className="border border-slate-300 dark:border-slate-700 p-1 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="creative">Creative</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            <input
              type="text"
              value={question}
              disabled={!selectedCollection || loading}
              onKeyDown={handleKeyDown}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                !selectedCollection
                  ? "Select collection first"
                  : loading
                    ? "Gemini is typing..."
                    : `Ask from ${selectedCollection.name}...`
              }
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-60"
            />

            <button
              onClick={createChat}
              disabled={!selectedCollection || loading || !question.trim()}
              className="h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        ) : (  
          <div className="border-t border-slate-200 dark:border-slate-800 p-4">
            <p className="text-center">No pdf in this collection</p>
            <Link to={"/dashboard/collections"}>
              <div className="text-center hover:underline">Add PDF's Faster</div>
            </Link>
          </div>
          )
        }
      </main>
    </div>
  );
}

export default ChatHome;
