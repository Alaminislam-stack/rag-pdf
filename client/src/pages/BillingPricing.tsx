import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Settings2, 
  Download, 
  Layers, 
  Check, 
  Plus,
  ShieldCheck,
  CircleGauge
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card, Button, Input, Table } from '../components/common/UIControls';
import { Modal } from '../components/common/FeedbackControls';

const pricingPlans = [
  {
    name: 'Free Starter',
    price: '$0',
    desc: 'Perfect for single student research routines.',
    features: [
      'Upload up to 3 PDFs',
      '100 queries per month limit',
      'Naive vector retrieval logic',
      'Standard email assistance'
    ]
  },
  {
    name: 'Research Pro',
    price: '$20',
    desc: 'Optimized for knowledge experts & SaaS scaling.',
    features: [
      'Upload up to 50 PDFs',
      '1000 queries per month limit',
      'Advanced pre-retrieval reranking',
      'Knowledge coordination logic maps',
      'Multi-tenant VPC encryptions'
    ],
    popular: true
  },
  {
    name: 'Cognitive Enterprise',
    price: '$99',
    desc: 'Configured for high compliance corporate teams.',
    features: [
      'Unlimited vector PDF uploads',
      '50,050 high fidelity queries',
      'Custom GPT-4 API credentials',
      'Direct Cohere Reranker models integrations',
      'SLA performance guarantees'
    ]
  }
];

const mockInvoices = [
  { id: 'inv-1', date: 'Jun 02, 2026', desc: 'SaaS Pro Monthly Subscription', amount: '$20.00', status: 'Paid' },
  { id: 'inv-2', date: 'May 02, 2026', desc: 'SaaS Pro Monthly Subscription', amount: '$20.00', status: 'Paid' },
  { id: 'inv-3', date: 'Apr 02, 2026', desc: 'SaaS Pro Monthly Subscription', amount: '$20.00', status: 'Paid' }
];

export const BillingPricing: React.FC = () => {
  const { subscription } = useAppContext();
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  
  const [success, setSuccess] = useState('');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber) return;
    setSuccess('Stripe Payment Method updated successfully!');
    setShowCardModal(false);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">SaaS Subscription & Billing</h1>
        <p className="text-xs text-slate-505 dark:text-slate-400 mt-1">Upgrade account capabilities, confirm Stripe payment elements, inspect invoices, and track RAG threshold limits.</p>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl flex items-center gap-2.5 text-emerald-750 dark:text-emerald-350 font-bold select-none">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* CORE SUBSCRIPTION CAPS AND USAGES LIMITS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Usages indicators card */}
        <div className="md:col-span-1 space-y-4">
          <Card title="Plan Cap Limit Indicators" description="Evaluate your current capacity constraints.">
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-slate-850/30 border border-indigo-100/50 dark:border-slate-800">
                <span className="text-[9px] font-black uppercase text-indigo-700 dark:text-indigo-400">ACTIVE PLAN PACKAGE</span>
                <h3 className="text-base font-black text-slate-850 dark:text-white mt-1">Research Pro Package</h3>
                <span className="text-[10px] text-slate-400 font-bold mt-1.5 block">Renews on {subscription.renewalDate}</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5 leading-none">
                  <span>PDF Document Slots</span>
                  <span>{subscription.pdfUsed} / {subscription.pdfLimit} items</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-650 rounded-full transition-all duration-300"
                    style={{ width: `${(subscription.pdfUsed / subscription.pdfLimit) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5 leading-none">
                  <span>Query Vector Calculations</span>
                  <span>{subscription.queriesUsed} / {subscription.queriesLimit} calls</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${(subscription.queriesUsed / subscription.queriesLimit) * 105 / 100}%` }}
                  />
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* Payment and methods details (2 columns) */}
        <div className="md:col-span-2 space-y-4">
          <Card 
            title="Stripe Payment integration Methods" 
            description="Manage registered credit cards securely tied to subscription tiers."
            headerAction={
              <Button onClick={() => setShowCardModal(true)} size="sm" className="rounded-lg h-8.5 text-xs shadow-none">
                <Plus className="h-4 w-4" />
                <span>Replace Card</span>
              </Button>
            }
          >
            <div className="p-4 rounded-2xl border border-slate-150 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 bg-white dark:bg-slate-805 border border-slate-150 dark:border-slate-820 rounded-xl flex items-center justify-center text-slate-700 shrink-0">
                  <CreditCard className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-slate-800 dark:text-white leading-tight">•••• •••• •••• 4242</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-none">Expires 12 / 2029 • Stripe, Inc. Element</p>
                </div>
              </div>
              
              <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 text-[10px] font-black uppercase tracking-wider">Active</span>
            </div>
          </Card>
        </div>

      </div>

      {/* PRICING PLANS GRID CARDS */}
      <div>
        <h3 className="font-extrabold text-[15px] text-slate-850 dark:text-white mb-3 tracking-tight">Available Subscription Upgrade Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, idx) => (
            <div 
              key={plan.name}
              className={`rounded-2xl border dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between p-5 relative select-none text-left shadow-sm ${
                plan.popular ? 'ring-2 ring-indigo-600 border-indigo-550 scale-102 bg-white' : 'bg-slate-50/40'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider p-1 px-2.5 rounded-full z-15">
                  Popular
                </span>
              )}

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{plan.name}</span>
                <div className="flex items-baseline gap-1 mt-1 pb-1">
                  <span className="text-2xl md:text-3xl font-black text-slate-850 dark:text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-bold">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">
                  {plan.desc}
                </p>

                <div className="my-5 border-t border-slate-100 dark:border-slate-800/80 pt-4.5 space-y-2.5 text-xs text-slate-700 dark:text-slate-350 font-semibold">
                  {plan.features.map(f => (
                    <div key={f} className="flex gap-2 items-start leading-tight">
                      <Check className="h-4 w-4 text-emerald-550 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant={plan.popular ? 'primary' : 'outline'} 
                className="w-full text-xs"
                disabled={plan.name === 'Research Pro'}
              >
                {plan.name === 'Research Pro' ? 'Active Package Tier' : `Select ${plan.name.split(' ')[0]}`}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* BILLING INVOICES INVENTORY */}
      <div>
        <h3 className="font-extrabold text-[15px] text-slate-850 dark:text-white mb-3.5 tracking-tight">Historic Billing Receipts Logs</h3>
        <Table 
          columns={[
            { header: 'Billed Date', accessor: (row) => <span className="font-bold text-slate-800 dark:text-white">{row.date}</span> },
            { header: 'Resolved Description', accessor: (row) => <span className="text-xs text-slate-500 font-semibold">{row.desc}</span> },
            { header: 'Transacted Amount', accessor: (row) => <span className="font-bold text-slate-700 dark:text-slate-350">{row.amount}</span> },
            { header: 'Tax Invoices Status', accessor: (row) => (
              <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/10 text-emerald-650 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                {row.status}
              </span>
            ) },
            { header: 'Receipt File', accessor: (row) => (
              <button className="p-1.5 border rounded-lg hover:bg-slate-50 text-slate-505 flex items-center justify-center cursor-pointer transition">
                <Download className="h-3.5 w-3.5 mr-1" />
                <span className="text-[10px] font-black uppercase">Tax PDF</span>
              </button>
            ) }
          ]}
          data={mockInvoices}
        />
      </div>

      {/* STRIPE PAYMENT CARD INITIALIZATION MODAL */}
      <Modal 
        isOpen={showCardModal} 
        onClose={() => setShowCardModal(false)}
        title="Connect Payment Card via Stripe Elements"
        maxWidth="md"
        footer={
          <div className="flex justify-end gap-2.5">
            <Button onClick={() => setShowCardModal(false)} variant="ghost" size="sm">Cancel</Button>
            <Button onClick={handleAddCard} size="sm">Add Stripe Method</Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-505 leading-normal font-semibold">
            Input checkout elements. Card data is managed using Stripe web tokens directly to guard merchant PCI accounts parameters.
          </p>
          
          <Input 
            label="16-Digit Card Number ID"
            placeholder="e.g. 4242 4242 4242 4242"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input 
              label="Expiry Standard Month / Year"
              placeholder="e.g. 12 / 2029"
              value={cardExpiry}
              onChange={e => setCardExpiry(e.target.value)}
              required
            />
            <Input 
              label="CVC Security Pin"
              type="password"
              placeholder="e.g. 303"
              value={cardCVC}
              onChange={e => setCardCVC(e.target.value)}
              required
            />
          </div>

          <div className="p-3 bg-slate-50 border rounded-xl text-[10px] text-slate-500 font-bold flex gap-2 select-none">
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
            <span>Stripe security compliant checkout elements. Payments are processed in an encrypted sandbox environment.</span>
          </div>
        </div>
      </Modal>

    </div>
  );
};
