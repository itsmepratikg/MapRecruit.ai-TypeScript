import React from 'react';

interface PermissionToggleProps {
    label: string;
    checked: boolean;
    onChange: () => void;
    readOnly?: boolean;
}

const PermissionToggle: React.FC<PermissionToggleProps> = ({ label, checked, onChange, readOnly }) => {
    return (
        <label className={`flex items-center gap-2 cursor-pointer select-none ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => !readOnly && onChange()}
                    disabled={readOnly}
                    className="sr-only peer"
                />
                <div className={`
          w-9 h-5 rounded-full transition-all duration-200 ease-in-out
          ${checked
                        ? 'bg-green-500 after:translate-x-full after:border-white'
                        : 'bg-gray-200 dark:bg-gray-600 after:border-gray-300'
                    }
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all
        `}></div>
            </div>
            <span className={`text-xs font-medium ${checked ? 'text-gray-900' : 'text-gray-500'}`}>
                {label}
            </span>
        </label>
    );
};

export default PermissionToggle;
