
import React, { useState } from 'react';
import { 
  FileEdit, FileText, CheckCircle, Download, Share2, MoreHorizontal, 
  Shield, Lock, Star, ChevronRight 
} from './Icons';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
    "Active": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    "Closed": "bg-red-500 text-white border-red-500 dark:bg-red-600 dark:border-red-600",
    "Archived": "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
    "On Assignment": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
    "Sent": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    "Scheduled": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
    "Completed": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    "Full Time": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    "Contract": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700"
  };
  if (status === "Closed") return <span className="px-3 py-0.5 rounded text-[10px] font-medium bg-red-500 text-white shadow-sm dark:bg-red-600">{status}</span>;
  return <span className={`px-2.5 py-0.5 rounded text-[10px] font-medium border ${styles[status] || 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'}`}>{status}</span>;
};

export const SectionCard: React.FC<{ title: string, id?: string, children?: React.ReactNode, className?: string }> = ({ title, id, children, className = "" }) => (
  <div id={id} className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden ${className}`}>
    <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
      <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export const ActionIcons = () => (
  <div className="flex items-center gap-2">
    <button title="Edit" className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded border border-slate-200 dark:border-slate-600"><FileEdit size={16} /></button>
    <button title="Resume" className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/40"><FileText size={16} /></button>
    <button title="Verify" className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded border border-slate-200 dark:border-slate-600"><CheckCircle size={16} /></button>
    <button title="Download" className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded border border-slate-200 dark:border-slate-600"><Download size={16} /></button>
    <button title="Share" className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded border border-slate-200 dark:border-slate-600"><Share2 size={16} /></button>
    <button title="More" className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded border border-slate-200 dark:border-slate-600"><MoreHorizontal size={16} /></button>
  </div>
);

export const SecureContactCard: React.FC<{ contact: any }> = ({ contact }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div 
      className="bg-slate-900 dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-700 shadow-md relative group transition-all hover:shadow-lg hover:border-emerald-500/30"
      onMouseDown={() => setRevealed(true)}
      onMouseUp={() => setRevealed(false)}
      onMouseLeave={() => setRevealed(false)}
      onTouchStart={() => setRevealed(true)}
      onTouchEnd={() => setRevealed(false)}
    >
      <div className="bg-slate-800 dark:bg-slate-900 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center gap-2 text-sm"><Shield size={14} className="text-emerald-400"/> Secure Contact</h3>
        <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-600 px-1.5 rounded">Confidential</span>
      </div>
      <div className="p-4 relative select-none h-24 flex flex-col justify-center">
        {!revealed && (
          <div className="absolute inset-0 z-10 backdrop-blur-md bg-slate-900/60 dark:bg-slate-950/60 flex flex-col items-center justify-center cursor-pointer group-hover:bg-slate-900/50 dark:group-hover:bg-slate-950/50 transition-colors">
            <Lock className="text-slate-400 mb-1 group-hover:text-emerald-400 transition-colors" size={20} />
            <p className="text-slate-300 text-xs font-medium">Click & Hold to Reveal</p>
          </div>
        )}
        <div className={`space-y-2 transition-all duration-300 ${revealed ? 'opacity-100 blur-none' : 'opacity-40 blur-sm'}`}>
           <div className="text-xs text-slate-500">Email: <span className="text-emerald-400 font-mono text-sm ml-2">{contact.email}</span></div>
           <div className="text-xs text-slate-500 mt-2">Phone: <span className="text-emerald-400 font-mono text-sm ml-2">{contact.phone}</span></div>
        </div>
      </div>
    </div>
  );
};

export const StarRating: React.FC<{ rating?: number, onRate?: (r: number) => void }> = ({ rating = 0, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div 
      className="flex items-center gap-1"
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button 
          key={star} 
          onClick={() => onRate && onRate(star)} 
          onMouseEnter={() => setHoverRating(star)}
          className={`focus:outline-none transition-transform ${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star 
            size={16} 
            className={`${
              star <= (hoverRating || rating) 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'fill-slate-100 text-slate-300 dark:fill-slate-700 dark:text-slate-600'
            } transition-colors duration-150`} 
          />
        </button>
      ))}
    </div>
  );
};

export const EmptyView = ({ title, message, icon: Icon }: any) => (
  <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-dashed animate-in zoom-in duration-300">
    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6 shadow-sm">
      <Icon size={40} className="text-slate-300 dark:text-slate-500" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">{message}</p>
    <button className="mt-6 px-5 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">
        Create New Record
    </button>
  </div>
);

export const ChatBubble: React.FC<{ message: any, isBot: boolean }> = ({ message, isBot }) => (
  <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}>
    <div className={`max-w-[85%] rounded-2xl p-4 ${
      isBot 
        ? 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-slate-200 shadow-sm rounded-tl-none' 
        : 'bg-green-600 text-white rounded-tr-none shadow-md'
    }`}>
      <p className="text-sm leading-relaxed">{message.text}</p>
      
      {message.suggestions && (
        <div className="mt-3 flex flex-wrap gap-2">
          {message.suggestions.map((suggestion: any, idx: number) => (
            <button 
              key={idx}
              onClick={() => suggestion.action()}
              className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-full transition-colors font-medium flex items-center gap-1"
            >
              {suggestion.label}
              <ChevronRight size={12} />
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);
