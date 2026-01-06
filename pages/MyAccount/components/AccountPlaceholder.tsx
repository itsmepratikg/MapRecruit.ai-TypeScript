
import React from 'react';

interface AccountPlaceholderProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

export const AccountPlaceholder: React.FC<AccountPlaceholderProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-600">
          <Icon size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
          {description}
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
            Documentation
          </button>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm">
            Edit Settings
          </button>
        </div>
      </div>
    </div>
  );
};
