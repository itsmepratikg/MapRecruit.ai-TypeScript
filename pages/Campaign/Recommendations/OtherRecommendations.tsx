
import React from 'react';
import { ThumbsUp } from '../../../components/Icons';

export const OtherRecommendations = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <ThumbsUp size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Other Recommendations</h3>
      <p className="max-w-md mx-auto mt-2">AI-driven suggestions for campaign optimization will appear here.</p>
  </div>
);
