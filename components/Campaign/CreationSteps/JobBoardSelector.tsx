
import React from 'react';

interface JobBoardSelectorProps {
    selectedBoards: string[];
    onChange: (boards: string[]) => void;
}

const JOB_BOARDS = [
    { id: 'Linkedin', label: 'LinkedIn', icon: 'test' }, // Potentially add icons later
    { id: 'AppCast', label: 'AppCast' },
    { id: 'Indeed', label: 'Indeed' },
];

const JobBoardSelector: React.FC<JobBoardSelectorProps> = ({ selectedBoards, onChange }) => {

    const handleToggle = (boardId: string) => {
        if (selectedBoards.includes(boardId)) {
            onChange(selectedBoards.filter(id => id !== boardId));
        } else {
            onChange([...selectedBoards, boardId]);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Publish to Job Boards
                <span className="ml-2 text-xs font-normal text-slate-500">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {JOB_BOARDS.map(board => {
                    const isSelected = selectedBoards.includes(board.id);
                    return (
                        <div
                            key={board.id}
                            onClick={() => handleToggle(board.id)}
                            className={`
                            relative flex items-center p-3 border rounded-lg cursor-pointer transition-all
                            ${isSelected
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 ring-1 ring-emerald-500'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500'}
                        `}
                        >
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {board.label}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {isSelected ? 'Enabled' : 'Click to enable'}
                                </p>
                            </div>

                            <div className={`
                            w-5 h-5 rounded border flex items-center justify-center ml-3
                            ${isSelected
                                    ? 'bg-emerald-600 border-emerald-600'
                                    : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900'}
                        `}>
                                {isSelected && (
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default JobBoardSelector;
