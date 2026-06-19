export interface PDFDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  pagesCount: number;
  uploadedAt: string;
  collection_id?: string;
  tags: string[];
  summary: string;
  abstract: string;
  keyConcepts: Array<{ term: string; definition: string }>;
  notes: string;
  author?: string;
  topic?: string;
  isFavorite?: boolean;
}

export interface Citation {
  id: string;
  page: number;
  snippet: string;
  pdfId: string;
  pdfTitle: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidenceScore?: number; // scale 0-100
  citations?: Citation[];
  isStreaming?: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  pdfIds: string[]; // context files attached to chat
  updatedAt: string;
  messages: ChatMessage[];
  suggestedQuestions?: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  pdfCount: number;
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  company: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface SubscriptionInfo {
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'active' | 'trialing' | 'canceled' | 'past_due';
  renewalDate: string;
  storageUsed: number; // in MB
  storageLimit: number; // in MB
  pdfUsed: number;
  pdfLimit: number;
  queriesUsed: number;
  queriesLimit: number;
}
