
import React, { useState } from 'react';
import { 
  Bell, MessageCircle, Monitor, XCircle, CheckCircle, 
  Moon, Zap, AlertCircle
} from '../../components/Icons';
import { useToast } from '../../components/Toast';

const NOTIFICATION_MODES = [
  { 
    id: 'ALL', 
    label: 'All Channels', 
    description: 'Receive notifications in both the application and via connected chat apps (Google Chat/Teams).',
    icon: Zap 
  },
  { 
    id: 'CHAT', 
    label: 'In Chat Only', 
    description: 'Direct notifications to your connected workspace chat. No in-app toasts.',
    icon: MessageCircle 
  },
  { 
    id: 'APP', 
    label: 'In Application', 
    description: 'Show toast notifications and badges within the MapRecruit dashboard only.',
    icon: Monitor 
  },
  { 
    id: 'NONE', 
    label: 'None', 
    description: 'Mute all proactive notifications. You can still check the Notification Center manually.',
    icon: XCircle 
  }
];

export const UserNotifications = () => {
  const { addToast } = useToast();
  const [mode, setMode] = useState('ALL');
  const [dnd, setDnd] = useState(false);

  const handleSave = () => {
    addToast("Notification preferences updated", "success");
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-5xl mx-auto animate-in fade-in duration-300 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6 gap-4">
           <div>
               <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                 <Bell size={22} className="text-emerald-500"/> User Notifications
               </h2>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                 Control how and where you receive alerts, updates, and system messages.
               </p>
           </div>
           <button 
             onClick={handleSave}
             className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
           >
             Save Preferences
           </button>
        </div>

        <div className="space-y-8">
            
            {/* Do Not Disturb */}
            <div className={`p-6 rounded-xl border transition-all ${dnd ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${dnd ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                            <Moon size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Do Not Disturb</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Pause all toast notifications and popups. Urgent alerts will still appear in the Notification Center.
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={dnd} 
                            onChange={(e) => setDnd(e.target.checked)} 
                        />
                        <div className="w-14 h-7 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>
            </div>

            {/* Delivery Channels */}
            <div className={dnd ? 'opacity-50 pointer-events-none filter grayscale transition-all duration-300' : 'transition-all duration-300'}>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Delivery Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {NOTIFICATION_MODES.map((option) => (
                        <div 
                            key={option.id}
                            onClick={() => setMode(option.id)}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 group ${mode === option.id ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'}`}
                        >
                            <div className={`p-3 rounded-full shrink-0 ${mode === option.id ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`}>
                                <option.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className={`font-bold ${mode === option.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>{option.label}</h4>
                                    {mode === option.id && <CheckCircle size={18} className="text-emerald-500" />}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {option.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Placeholder for Granular Settings */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center border-dashed">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Individual Settings</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                        Granular controls for specific event types (e.g., New Applications, Interview Reminders, Workflow Alerts) will be available here.
                    </p>
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Coming Soon
                    </span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
