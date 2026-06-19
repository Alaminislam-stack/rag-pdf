import React, { useState } from 'react';
import { 
  Bell, 
  Settings2, 
  Mail, 
  PhoneCall, 
  Layers, 
  CheckCircle,
  Eye,
  X,
  Volume2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card, Button, Table } from '../components/common/UIControls';

export const NotificationsSettings: React.FC = () => {
  const { notifications, markAllNotificationsRead, clearNotification } = useAppContext();
  
  // Toggle states
  const [emailAlert, setEmailAlert] = useState(true);
  const [usageCheck, setUsageCheck] = useState(true);
  const [successPing, setSuccessPing] = useState(true);
  const [weeklyDigests, setWeeklyDigests] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 text-left max-w-4xl">
      
      {/* Header labels */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">Notification Center & Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Check workspace alerts, modify push configuration channels, and audit unread document sync outputs.</p>
        </div>

        {unread > 0 && (
          <Button onClick={markAllNotificationsRead} size="sm" variant="outline" className="text-xs rounded-xl shadow-none border-indigo-200 text-indigo-650 h-9">
            <span>Mark {unread} read</span>
          </Button>
        )}
      </div>

      {/* SPLIT COLUMN: PUSH PREFERENCES VS ALERT FEED */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: preference switches (1 column) */}
        <div className="md:col-span-1 space-y-4">
          <Card title="Alert Channels" description="Switch alert routes and push volumes.">
            <div className="space-y-4.5 text-left">
              
              <label className="flex items-start gap-3.5 cursor-pointer border-b border-slate-50 pb-3">
                <input 
                  type="checkbox" 
                  checked={emailAlert} 
                  onChange={e => setEmailAlert(e.target.checked)}
                  className="rounded mt-0.5" 
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-white leading-none">Email Notifications</span>
                  <span className="text-[10px] text-slate-400 leading-normal mt-1">Receive invoice receipt PDFs or limit milestones instantly.</span>
                </div>
              </label>

              <label className="flex items-start gap-3.5 cursor-pointer border-b border-slate-50 pb-3">
                <input 
                  type="checkbox" 
                  checked={usageCheck} 
                  onChange={e => setUsageCheck(e.target.checked)}
                  className="rounded mt-0.5" 
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-white leading-none">Usage & Limits Thresholds</span>
                  <span className="text-[10px] text-slate-400 leading-normal mt-1">Alert when query parameters approach 85% cluster capacity.</span>
                </div>
              </label>

              <label className="flex items-start gap-3.5 cursor-pointer border-b border-slate-50 pb-3">
                <input 
                  type="checkbox" 
                  checked={successPing} 
                  onChange={e => setSuccessPing(e.target.checked)}
                  className="rounded mt-0.5" 
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-white leading-none">Vector Sync Statuses</span>
                  <span className="text-[10px] text-slate-400 leading-normal mt-1">Get immediate popups when uploaded PDFs complete processing.</span>
                </div>
              </label>

              <label className="flex items-start gap-3.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={weeklyDigests} 
                  onChange={e => setWeeklyDigests(e.target.checked)}
                  className="rounded mt-0.5" 
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-white leading-none">Weekly Research Digest</span>
                  <span className="text-[10px] text-slate-400 leading-normal mt-1">Summarized high interest concepts compiled over your documents.</span>
                </div>
              </label>

            </div>
          </Card>
        </div>

        {/* Right Column: notification list (2 columns) */}
        <div className="md:col-span-2 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1">Unread Alerts & Actions</div>

          {notifications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border text-slate-400">
              No alerts in registry.
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(notif => (
                <div 
                  key={notif.id}
                  className={`p-4 border rounded-2xl text-left transition-colors relative group shadow-sm flex items-start gap-3.5 bg-white dark:bg-slate-900 ${
                    notif.read ? 'border-slate-150 dark:border-slate-800/80' : 'border-indigo-400 dark:border-indigo-900/50 ring-2 ring-indigo-550/10'
                  }`}
                >
                  <button 
                    onClick={() => clearNotification(notif.id)}
                    className="absolute top-4 right-4 h-6 w-6 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' :
                    notif.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-650'
                  }`}>
                    <Bell className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0 pr-6 flex flex-col leading-none">
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-white leading-normal">{notif.title}</span>
                      {!notif.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-650 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">
                      {notif.description}
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold mt-2.5">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
