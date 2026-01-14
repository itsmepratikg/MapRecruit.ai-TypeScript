
import React, { useState } from 'react';
import { 
  Zap, Plus, Edit2, Trash2, CheckCircle, AlertCircle, 
  GitBranch, MessageSquare, Clock, Filter, X, Save, ArrowRight
} from '../../../components/Icons';
import { useToast } from '../../../components/Toast';

// Mock Data
const MOCK_RULES = [
    { id: '1', name: 'Salary Inquiry', trigger: 'Message Contains', keywords: ['salary', 'rate', 'pay', 'compensation'], action: 'Reply', response: 'Our standard rate for this role is $50-$60/hr depending on experience.', active: true, hits: 145 },
    { id: '2', name: 'Location Query', trigger: 'Message Contains', keywords: ['location', 'remote', 'office'], action: 'Reply', response: 'This role is hybrid, requiring 2 days a week in our Atlanta office.', active: true, hits: 82 },
    { id: '3', name: 'After Hours Fallback', trigger: 'Time Range', keywords: ['18:00 - 08:00'], action: 'Reply', response: 'Thanks for your message. We are currently closed and will respond tomorrow morning.', active: false, hits: 12 },
];

const LogicFlowAlert = () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                <GitBranch size={20} />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">Automation Logic Priority</h4>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-xs text-blue-700 dark:text-blue-400">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded border border-blue-200 dark:border-blue-800 shadow-sm">
                        <MessageSquare size={12} /> Incoming Message
                    </div>
                    <ArrowRight size={14} className="hidden md:block" />
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded border border-emerald-200 dark:border-emerald-800 shadow-sm text-emerald-700 dark:text-emerald-400 font-bold">
                        <Zap size={12} /> 1. Check Auto-Pilot
                    </div>
                    <ArrowRight size={14} className="hidden md:block" />
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded border border-blue-200 dark:border-blue-800 shadow-sm opacity-80">
                        <span className="text-[10px] uppercase font-bold text-slate-400">If No Match</span>
                    </div>
                    <ArrowRight size={14} className="hidden md:block" />
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded border border-amber-200 dark:border-amber-800 shadow-sm text-amber-700 dark:text-amber-400 font-bold">
                        <Clock size={12} /> 2. Check Recruiter Schedule
                    </div>
                </div>
                <p className="mt-3 text-xs opacity-90">
                    Auto-Pilot rules trigger <strong>first</strong>. If conditions are met, the configured reply is sent immediately. 
                    If no rules match, the system checks if the assigned recruiter is offline (based on My Account settings) to send the generic Auto-Reply.
                </p>
            </div>
        </div>
    </div>
);

export const AutoPilot = () => {
    const { addToast } = useToast();
    const [rules, setRules] = useState(MOCK_RULES);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRule, setCurrentRule] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        trigger: 'Message Contains',
        keywords: '',
        response: ''
    });

    const handleEdit = (rule?: any) => {
        if (rule) {
            setCurrentRule(rule);
            setFormData({
                name: rule.name,
                trigger: rule.trigger,
                keywords: rule.keywords.join(', '),
                response: rule.response
            });
        } else {
            setCurrentRule(null);
            setFormData({ name: '', trigger: 'Message Contains', keywords: '', response: '' });
        }
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id));
        addToast("Rule deleted", "success");
    };

    const handleToggleActive = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
        
        if (currentRule) {
            setRules(prev => prev.map(r => r.id === currentRule.id ? { ...r, ...formData, keywords: keywordsArray } : r));
            addToast("Rule updated successfully", "success");
        } else {
            const newRule = {
                id: Date.now().toString(),
                ...formData,
                keywords: keywordsArray,
                active: true,
                hits: 0
            };
            setRules(prev => [...prev, newRule]);
            addToast("New Auto-Pilot rule created", "success");
        }
        setIsEditing(false);
    };

    return (
        <div className="h-full flex flex-col relative">
            {isEditing && (
                <div className="absolute inset-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{currentRule ? 'Edit Rule' : 'Create Auto-Pilot Rule'}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Rule Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm dark:text-slate-200" placeholder="e.g. Price Query" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Trigger</label>
                                    <select value={formData.trigger} onChange={e => setFormData({...formData, trigger: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm dark:text-slate-200">
                                        <option>Message Contains</option>
                                        <option>Exact Match</option>
                                        <option>First Message</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Conditions</label>
                                    <div className="p-2 border border-slate-200 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 text-sm text-slate-400 italic">None configured</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Keywords (Comma Separated)</label>
                                <input required type="text" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm dark:text-slate-200" placeholder="pricing, cost, rate" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Auto-Response</label>
                                <textarea required rows={4} value={formData.response} onChange={e => setFormData({...formData, response: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm dark:text-slate-200 resize-none" placeholder="Enter the message to send automatically..." />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 flex items-center gap-2"><Save size={16}/> Save Rule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="max-w-5xl mx-auto">
                    
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Zap size={20} className="text-emerald-500" /> Auto-Pilot Rules
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Define automated responses based on candidate message content.</p>
                        </div>
                        <button onClick={() => handleEdit()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                            <Plus size={16} /> Create Rule
                        </button>
                    </div>

                    <LogicFlowAlert />

                    <div className="space-y-4">
                        {rules.map(rule => (
                            <div key={rule.id} className={`bg-white dark:bg-slate-800 border rounded-xl p-5 shadow-sm transition-all hover:shadow-md group ${rule.active ? 'border-slate-200 dark:border-slate-700' : 'border-slate-100 dark:border-slate-800 opacity-75'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rule.active ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">{rule.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 flex items-center gap-1">
                                                    <Filter size={10} /> {rule.trigger}
                                                </span>
                                                <span>•</span>
                                                <span>{rule.hits} times triggered</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={rule.active} onChange={() => handleToggleActive(rule.id)} />
                                            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                        <button onClick={() => handleEdit(rule)} className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"><Edit2 size={16}/></button>
                                        <button onClick={() => handleDelete(rule.id)} className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                                
                                <div className="ml-14 space-y-3">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Keywords</span>
                                        <div className="flex flex-wrap gap-2">
                                            {rule.keywords.map((k: string, i: number) => (
                                                <span key={i} className="text-xs bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                                                    "{k}"
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 italic relative">
                                        <div className="absolute top-3 left-3 text-slate-300 dark:text-slate-600">
                                            <MessageSquare size={14} />
                                        </div>
                                        <p className="pl-6">{rule.response}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
