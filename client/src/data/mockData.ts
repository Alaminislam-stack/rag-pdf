import { PDFDocument, ChatThread, Collection, NotificationItem, SubscriptionInfo, UserProfile } from '../types';

export const initialCollections: Collection[] = [
  { id: 'col-1', name: 'Machine Learning Research', description: 'Crucial papers regarding transformer models and neural networks.', pdfCount: 2, color: '#4F46E5' },
  { id: 'col-2', name: 'RAG Systems', description: 'Documents explaining Retrieval-Augmented Generation, vector embeddings, and chunking.', pdfCount: 2, color: '#10B981' },
  { id: 'col-3', name: 'Product Engineering', description: 'Guides, APIs, and product documents regarding Stripe, design systems, and architecture.', pdfCount: 1, color: '#8B5CF6' }
];

export const initialPDFs: PDFDocument[] = [
  {
    id: 'pdf-1',
    title: 'Attention Is All You Need',
    fileName: 'attention_is_all_you_need.pdf',
    fileSize: '2.1 MB',
    pagesCount: 15,
    uploadedAt: '2026-05-18T14:32:00Z',
    collectionId: 'col-1',
    isFavorite: true,
    tags: ['Machine Learning', 'Transformers', 'Deep Learning'],
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    summary: 'This seminal paper introduced the Transformer architecture, replacing RNNs and CNNs with self-attention. It serves as the foundation for modern Large Language Models like GPT, Claude, and Gemini. Key advantages include parallel training capability and superior translation accuracy with less training compute.',
    keyConcepts: [
      { term: 'Self-Attention', definition: 'An attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence.' },
      { term: 'Multi-Head Attention', definition: 'Splitting query, key, and value vectors into multiple subspaces to let the model jointly attend to information from different representation positions.' },
      { term: 'Positional Encoding', definition: 'Injecting information about the relative or absolute position of the tokens in the sequence since the model has no recurrence or convolution.' },
      { term: 'Scaled Dot-Product Attention', definition: 'Attention function mapping a query and a set of key-value pairs to an output, scaled by the square root of the query/key dimension.' }
    ],
    notes: '### Introduction Notes\nThis is the core foundation of contemporary GenAI. Worth studying section 3.2 carefully to understand query, key, and value projections.\n\n### Practical Applications\n- Essential for BERT, GPT, and modern transformer-derived sequence work.\n- Understand the matrix dimensions: $Q, K, V$ dimensions must match.',
    author: 'Vaswani et al.',
    topic: 'Neural Network Architectures'
  },
  {
    id: 'pdf-2',
    title: 'Retrieval-Augmented Generation Survey',
    fileName: 'rag_survey_2026.pdf',
    fileSize: '3.4 MB',
    pagesCount: 24,
    uploadedAt: '2026-06-02T09:15:00Z',
    collectionId: 'col-2',
    isFavorite: true,
    tags: ['RAG', 'Vector Query', 'Information Retrieval'],
    abstract: 'Retrieval-Augmented Generation (RAG) is a prominent technology that enhances LLMs by attaching external knowledge retrieval. This survey reviews the evolution of RAG, categorized into Naive RAG, Advanced RAG, and Modular RAG, analyzing core techniques across chunking, indexing, and generator fine-tuning.',
    summary: 'The paper details the progression from naive vector search to advanced techniques like query rewriting, reranking, and self-reflective RAG, offering a complete taxonomy for developers trying to minimize hallucinations and integrate private databases.',
    keyConcepts: [
      { term: 'Naive RAG', definition: 'A direct retrieve-then-generate pipeline without preprocessing query or post-processing retrieval results.' },
      { term: 'Advanced RAG', definition: 'Integrates refined indexing, pre-retrieval optimization (query expansion), and post-retrieval reranking to maximize context relevance.' },
      { term: 'Reranking Model', definition: 'A secondary specialized network that calculates exact semantic match scores to re-order candidate documents retrieved by fast vector search.' },
      { term: 'Vector Database', definition: 'A high-performance indexer specialized in searching multidimensional vector representations via cosine similarity or inner product.' }
    ],
    notes: 'Excellent diagram on page 5 comparing Advanced vs Naive pipelines. We should implement the advanced architecture (Pre-retrieve query rewriting + Cohere Rerank) for our cognitive cloud production system.',
    author: 'Gao et al.',
    topic: 'Knowledge Grounding'
  },
  {
    id: 'pdf-3',
    title: 'Stripe API Quickstart & Core Integration',
    fileName: 'stripe_api_guide.pdf',
    fileSize: '1.2 MB',
    pagesCount: 8,
    uploadedAt: '2026-06-10T11:45:00Z',
    collectionId: 'col-3',
    tags: ['SaaS', 'Billing', 'Integrations'],
    abstract: 'Stripe Billing allows you to model any pricing structure and automate subscription revenue. This guide details the integration flow of webhooks, PaymentIntents, customer portal activation, and secure server-to-server tokens to prevent race conditions during billing state transitions.',
    summary: 'Hands-on API manual detailing standard React and Node.js setup using stripe-node and Stripe.js. Outlines subscription lifecycles, checkout sessions, and multi-tenant setup guidelines.',
    keyConcepts: [
      { term: 'PaymentIntent', definition: 'An object that tracks the entire process of a customer payment, handling complex 3D-secure checks and auto-retry.' },
      { term: 'Webhooks', definition: 'HTTP callbacks that notify your server of async events like credit card failure or successfully renewed subscriptions.' },
      { term: 'Customer Portal', definition: 'Hosted self-service UI for users to manage subscriptions, update cards, and view billing history without custom page building.' }
    ],
    notes: '- Make sure webhook endpoints are guarded with signing secrets to prevent spoofing.\n- Stripe Elements are ideal for PCI-compliant checkout components.',
    author: 'Stripe Developer Rel',
    topic: 'Payment Gateways'
  },
  {
    id: 'pdf-4',
    title: 'Cognitive AI Enterprise Architecture Guide',
    fileName: 'cognitive_ai_arch_guide.pdf',
    fileSize: '1.8 MB',
    pagesCount: 12,
    uploadedAt: '2026-06-11T16:22:00Z',
    collectionId: 'col-2',
    tags: ['Enterprise', 'Security', 'RAG'],
    abstract: 'This architectural whitepaper details Cognitive AI\'s secure multi-tenant RAG design. We describe our proprietary document chunking algorithms, document access control list filters, and how semantic data is stored separately in highly isolated physical partitions to prevent database leakage.',
    summary: 'Explains Cognitive AI\'s infrastructure. Key sections include real-time metadata indexing, PDF optical character recognition (OCR) fallback processes, dynamic workspace routing, and compliance policies (SOC2 & GDPR) regarding customer document caching.',
    keyConcepts: [
      { term: 'Document Isolation', definition: 'Ensuring vectors loaded by tenant X can never be retrieved by tenant Y through isolated index routing and metadata hard-filtering.' },
      { term: 'Hierarchical Chunking', definition: 'Dividing documents into overlapping parent and child chunks, where small child chunks are used for vector retrieval and parent chunks are fed into LLMs.' }
    ],
    notes: 'Important reference for our sales team when responding to security questions from Enterprise prospects. Handled through custom VPC endpoints.',
    author: 'Cognitive Engineering Group',
    topic: 'Security Compliance'
  }
];

export const initialThreads: ChatThread[] = [];

export const initialNotifications: NotificationItem[] = [
  { id: 'not-1', title: 'File Parsed Successfully', description: '"Cognitive AI Enterprise Architecture Guide" is compiled and vectorized.', time: '12 mins ago', read: false, type: 'success' },
  { id: 'not-2', title: 'Monthly Billing Successful', description: 'Your Stripe Pro plan payment was accepted. Transaction receipts generated.', time: '2 hours ago', read: true, type: 'success' },
  { id: 'not-3', title: 'Usage Warning: 85% Limit', description: 'Your RAG document uploads are approaching your current Pro monthly limit.', time: '1 day ago', read: false, type: 'warning' },
  { id: 'not-4', title: 'New Workspace Member', description: 'sarah.k@cognitiveinstitute.org joined your workspace.', time: '2 days ago', read: true, type: 'info' }
];

export const initialSubscription: SubscriptionInfo = {
  plan: 'Pro',
  status: 'active',
  renewalDate: '2026-07-02',
  storageUsed: 8.5,
  storageLimit: 100,
  pdfUsed: 4,
  pdfLimit: 50,
  queriesUsed: 412,
  queriesLimit: 1000
};

export const defaultUser: UserProfile = {
  name: 'Alamin Islam',
  email: 'gameralaminislam@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  role: 'SaaS Product Lead',
  company: 'Cognitive Institute Inc.'
};
