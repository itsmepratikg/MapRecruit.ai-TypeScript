
import React from 'react';

export const Integrations = () => (
  <div className="p-8 h-full overflow-y-auto bg-white dark:bg-slate-900">
     <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200">Source Integrations</h3>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['LinkedIn Recruiter', 'Indeed', 'ZipRecruiter', 'Monster', 'Dice', 'CareerBuilder'].map(platform => (
          <div key={platform} className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-all bg-white dark:bg-slate-800">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full mb-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 text-lg shadow-sm">
                {platform[0]}
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{platform}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Connect to source candidates directly from {platform}.</p>
              <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors w-full">Connect</button>
          </div>
        ))}
     </div>
  </div>
);
