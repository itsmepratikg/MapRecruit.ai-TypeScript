
import React from 'react';
import { GitBranch } from 'lucide-react';

interface AutomationConfigProps {
    isEnabled: boolean;
    onToggle: (enabled: boolean) => void;
}

export const AutomationConfig = ({ isEnabled, onToggle }: AutomationConfigProps) => {
    return (
        <div className="flex flex-col h-full bg-white">
            {/* Status Bar */}
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${isEnabled ? 'text-green-600' : 'text-slate-400'}`}>
                        {isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button 
                        onClick={() => onToggle(!isEnabled)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? 'bg-green-600' : 'bg-slate-300'}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>
            
            {/* Configuration Content */}
            <div className="p-8 text-center space-y-4 flex-1 overflow-y-auto">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${isEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    <GitBranch size={32} />
                </div>
                <h3 className="font-bold text-slate-700">
                    {isEnabled ? 'Automation Active' : 'Enable Automation?'}
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    {isEnabled 
                        ? "Logic conditions are currently active for this transition. Editing functionality coming soon." 
                        : "Define criteria to automatically move candidates to the next stage."}
                </p>
                
                {!isEnabled && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left text-xs text-slate-500 mt-4 mx-auto max-w-xs">
                        <p className="font-bold mb-1">Coming Soon:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Score-based triggers</li>
                            <li>Keyword matching</li>
                            <li>Boolean logic gates</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
