import React, { createContext, useContext, useState, useEffect } from 'react';
import { PDFDocument, ChatThread, Collection, NotificationItem, SubscriptionInfo, UserProfile, ChatMessage, Citation } from '../types';
import { initialCollections, initialPDFs, initialThreads, initialNotifications, initialSubscription, defaultUser } from '../data/mockData';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  deletePDF: (id: string) => void;
  toggleFavoritePDF: (id: string) => void;
  updatePDFNotes: (id: string, notes: string) => void;
  collections: Collection[];
  addCollection: (name: string, description: string, color: string) => string;
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  addThread: (title: string, pdfIds: string[]) => string;
  deleteThread: (id: string) => void;
  updateThreadPdfIds: (threadId: string, pdfIds: string[]) => void;
  addMessage: (threadId: string, content: string) => void;
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  subscription: SubscriptionInfo;
  activePdfId: string | null;
  setActivePdfId: (id: string | null) => void;
  pdfSearchQuery: string;
  setPdfSearchQuery: (q: string) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  isStreaming: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [pdfs, setPdfs] = useState<PDFDocument[]>(initialPDFs);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [threads, setThreads] = useState<ChatThread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(initialThreads[0]?.id || null);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [subscription, setSubscription] = useState<SubscriptionInfo>(initialSubscription);
  const [activePdfId, setActivePdfId] = useState<string | null>(null);
  const [pdfSearchQuery, setPdfSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Sync dark theme on html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };


  const deletePDF = (id: string) => {
    setPdfs(prev => prev.filter(p => p.id !== id));
    if (activePdfId === id) setActivePdfId(null);
    setSubscription(prev => ({
      ...prev,
      pdfUsed: Math.max(0, prev.pdfUsed - 1)
    }));
  };

  const toggleFavoritePDF = (id: string) => {
    setPdfs(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const updatePDFNotes = (id: string, notes: string) => {
    setPdfs(prev => prev.map(p => p.id === id ? { ...p, notes } : p));
  };

  const addCollection = (name: string, description: string, color: string) => {
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name,
      description,
      pdfCount: 0,
      color
    };
    setCollections(prev => [...prev, newCol]);
    return newCol.id;
  };

  const addThread = (title: string, pdfIds: string[]) => {
    const newThreadId = `chat-${Date.now()}`;
    const newThread: ChatThread = {
      id: newThreadId,
      title: title || 'New Chat Session',
      pdfIds,
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-welcome`,
          role: 'assistant',
          content: 'Hello! I’m ready to help. Ask anything you want to explore.',
          timestamp: new Date().toISOString()
        }
      ],
      suggestedQuestions: [
        'What would you like to know about these materials?',
        'Can you summarize the key ideas?',
        'What should I look at first?'
      ]
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThreadId);
    return newThreadId;
  };

  const deleteThread = (id: string) => {
    setThreads(prev => {
      const remaining = prev.filter(t => t.id !== id);
      if (activeThreadId === id) {
        setActiveThreadId(remaining[0]?.id || null);
      }
      return remaining;
    });
  };

  const updateThreadPdfIds = (threadId: string, pdfIds: string[]) => {
    setThreads(prev => prev.map(t =>
      t.id === threadId
        ? { ...t, pdfIds, updatedAt: new Date().toISOString() }
        : t
    ));
  };

  const addMessage = (threadId: string, content: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          messages: [...t.messages, userMsg]
        };
      }
      return t;
    }));

    // Trigger loading / streaming simulation
    setIsStreaming(true);

    setTimeout(() => {
      // Find loaded pdf context to formulate meaningful answer references
      const thread = threads.find(t => t.id === threadId);
      const attachedPdfs = thread ? pdfs.filter(p => thread.pdfIds.includes(p.id)) : [];
      
      let answer = '';
      let confidence = 90;
      let citationsList: Citation[] = [];

      if (attachedPdfs.length > 0) {
        const attachedTitles = attachedPdfs.map(p => p.title).join(', ');
        answer = `Thanks for your question. I’m reviewing the attached material(s): ${attachedTitles}. I’ll give you a concise, relevant answer based on what you shared.`;
      } else {
        answer = 'Thanks for your message. I can help you analyze your documents or answer questions once you attach relevant files.';
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: answer,
        timestamp: new Date().toISOString(),
        confidenceScore: confidence,
        citations: citationsList
      };

      setThreads(prev => prev.map(t => {
        if (t.id === threadId) {
          // generate new suggested questions
          const prevQuestions = t.suggestedQuestions || [];
          const nextQuestions = prevQuestions.length > 0 
            ? [prevQuestions[1], prevQuestions[2], 'Can you elaborate on specific formulas mentioned here?']
            : ['What are the core definitions?', 'Are there any performance limits listed?', 'Explain this further.'];
          return {
            ...t,
            messages: [...t.messages, assistantMsg],
            suggestedQuestions: nextQuestions
          };
        }
        return t;
      }));

      setIsStreaming(false);

      // increment metrics
      setSubscription(prev => ({
        ...prev,
        queriesUsed: prev.queriesUsed + 1
      }));
    }, 1500);
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      deletePDF,
      toggleFavoritePDF,
      updatePDFNotes,
      collections,
      addCollection,
      threads,
      activeThreadId,
      setActiveThreadId,
      addThread,
      deleteThread,
      updateThreadPdfIds,
      addMessage,
      user,
      updateUser,
      notifications,
      markAllNotificationsRead,
      clearNotification,
      subscription,
      activePdfId,
      setActivePdfId,
      pdfSearchQuery,
      setPdfSearchQuery,
      globalSearchQuery,
      setGlobalSearchQuery,
      isStreaming
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
