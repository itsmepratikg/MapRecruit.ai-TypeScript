
import React, { useState } from 'react';
import { 
  MessageSquare, Plus, Edit2, Trash2, Search, X, Save, Command, Slash, CheckCircle 
} from '../../../components/Icons';
import { useToast } from '../../../components/Toast';

// Mock Data
const MOCK_RESPONSES = [
    { id: '1', shortcode: 'invite', description: 'Standard interview invitation', content: 'Hi, we would like to invite you for an interview. Please let us know your availability for next week.', usage: 450 },
    { id: '2', shortcode: 'reject', description: 'Polite rejection message', content: 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates at this time.', usage: 120 },
    { id: '3', shortcode: 'location', description: 'Office address details', content: 'Our office is located at 123 Tech Park, Innovation Blvd, Suite 400. Parking is available in the visitor lot.', usage: 85 },
    { id: '4', shortcode: 'offer', description: 'Offer details follow-up', content: 'We are excited to extend an offer! Please find the formal letter attached to the previous email.', usage: 32 },
];

export const CannedResponses = () => {
    const { addToast } = useToast();
    const [responses, setResponses] = useState(MOCK_RESPONSES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentResponse, setCurrentResponse] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        shortcode: '',
        description: '',
        content: ''
    });

    const filteredResponses = responses.filter(r => 
        r.shortcode.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (resp?: any) => {
        if (resp) {
            setCurrentResponse(resp);
            setFormData({
                shortcode: resp.shortcode,
                description: resp.description,
                content: resp.content
            });
        } else {
            setCurrentResponse(null);
            setFormData({ shortcode: '', description: '', content: '' });
        }
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        setResponses(prev => prev.filter(r => r.id !== id));
        addToast("Response deleted", "success");
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Clean shortcode (remove slash if user typed it)
        const cleanCode = formData.shortcode.replace(/^\//, '').trim();
        
        if (!cleanCode) {
            addToast("Shortcode is required", "error");
            return;
        }

        if (currentResponse) {
            setResponses(prev => prev.map(r => r.id === currentResponse.id ? { ...r, ...formData, shortcode: cleanCode } : r));
            addToast("Response updated successfully", "success");
        } else {
            const newResponse = {
                id: Date.now().toString(),
                ...formData,
                shortcode: cleanCode,
                usage: 0
            };
            setResponses(prev => [...prev, newResponse]);
            addToast("New pre-curated response created", "success");
        }
        setIsEditing(false);
    };

    return (
        <div className="h-full flex flex-col relative">
            {isEditing && (
                <div className="absolute inset-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{currentResponse ? 'Edit Response' : 'Create Response'}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Shortcode</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-slate-400 font-bold">/</span>
                                        <input required type="text" value={formData.shortcode} onChange={e => setFormData({...formData, shortcode: e.target.value})} className="w-full pl-6 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm font-bold text-slate-800 dark:text-slate-200" placeholder="invite" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Description</label>
                                    <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm dark:text-slate-200" placeholder="Internal note..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Response Content</label>
                                <textarea required rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm dark:text-slate-200 resize-none custom-scrollbar" placeholder="Type the full message here..." />
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 flex items-center gap-2"><Save size={16}/> Save Response</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="max-w-5xl mx-auto">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Command size={20} className="text-emerald-500" /> Pre-Curated Responses
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Save time by creating shortcuts for frequently used messages.</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                             <div className="relative flex-1 md:w-64">
                                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search shortcuts..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 dark:text-slate-200"
                                />
                             </div>
                             <button onClick={() => handleEdit()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 whitespace-nowrap">
                                <Plus size={16} /> Create
                             </button>
                        </div>
                    </div>

                    {/* Usage Hint */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 mb-6 flex items-start gap-4">
                        <div className="p-2 bg-white dark:bg-indigo-900/40 rounded-lg shadow-sm text-indigo-600 dark:text-indigo-400">
                            <Slash size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-1">How to use</h4>
                            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                                In any chat window, simply type <strong>/</strong> followed by your shortcode (e.g., <code>/invite</code>) to instantly insert the pre-curated response.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredResponses.map(resp => (
                            <div key={resp.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm font-mono font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                                            /{resp.shortcode}
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{resp.description}</span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(resp)} className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded"><Edit2 size={14}/></button>
                                        <button onClick={() => handleDelete(resp.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mb-3 flex-1 overflow-hidden relative">
                                     <p className="line-clamp-3">{resp.content}</p>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-medium">
                                    <span className="flex items-center gap-1"><CheckCircle size={10}/> Active</span>
                                    <span>Used {resp.usage} times</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
