
import React from 'react';
import { FileText } from '../../../components/Icons';

export const JobDescription = () => (
  <div className="p-8 h-full overflow-y-auto max-w-5xl bg-white dark:bg-slate-900">
     <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Job Description</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg font-medium transition-colors">
           <FileText size={14}/> Edit JD
        </button>
     </div>
     <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300">
        <h4 className="text-slate-800 dark:text-slate-100 font-bold text-lg mb-2">About the Role</h4>
        <p className="mb-4">We are looking for a skilled Warehouse Associate to participate in our warehouse operations and activities. Warehouse Associate responsibilities include storing materials, picking, packing and scanning orders. The goal is to increase efficiency, profitability and customer satisfaction.</p>
        
        <h4 className="text-slate-800 dark:text-slate-100 font-bold text-lg mb-2">Responsibilities</h4>
        <ul className="list-disc pl-5 space-y-1 mb-4">
           <li>Prepare and complete orders for delivery or pickup according to schedule (load, pack, wrap, label, ship)</li>
           <li>Receive and process warehouse stock products (pick, unload, label, store)</li>
           <li>Perform inventory controls and keep quality standards high for audits</li>
           <li>Keep a clean and safe working environment and optimize space utilization</li>
           <li>Report any discrepancies</li>
           <li>Communicate and cooperate with supervisors and coworkers</li>
           <li>Operate and maintain preventively warehouse vehicles and equipment</li>
           <li>Follow quality service standards and comply with procedures, rules and regulations</li>
        </ul>

        <h4 className="text-slate-800 dark:text-slate-100 font-bold text-lg mb-2">Requirements</h4>
        <ul className="list-disc pl-5 space-y-1">
           <li>Proven working experience as a warehouse worker</li>
           <li>Proficiency in inventory software, databases and systems</li>
           <li>Familiarity with modern warehousing practices and methods</li>
           <li>Good organisational and time management skills</li>
           <li>Ability to lift heavy objects</li>
           <li>Current forklift license</li>
           <li>High school degree</li>
        </ul>
     </div>
  </div>
);
