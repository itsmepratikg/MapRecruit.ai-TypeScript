import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import PermissionToggle from './PermissionToggle';

// Recursive item renderer
const PermissionItem = ({ label, data, path, onChange, readOnly }: any) => {
    // Determine permissions
    const hasEnabled = 'enabled' in data;
    const hasVisible = 'visible' in data;
    const hasEditable = 'editable' in data;

    // Find delete key
    const deleteKey = Object.keys(data).find(k => (k.startsWith('delete') || k.startsWith('remove')) && typeof data[k] === 'boolean');

    const hasAnyPermission = hasEnabled || hasVisible || hasEditable || deleteKey;

    // Find children (nested objects)
    const childrenKeys = Object.keys(data).filter(k =>
        typeof data[k] === 'object' && data[k] !== null && !Array.isArray(data[k])
    );

    const handleToggle = (key: string, val: boolean) => {
        onChange([...path, key], val);
    };

    const formatLabel = (key: string) => {
        const result = key.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    return (
        <div className="py-2">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors">
                <span className="font-medium text-slate-700 dark:text-slate-300" title={label}>
                    {label}
                </span>

                {hasAnyPermission && (
                    <div className="flex items-center gap-6 flex-wrap shrink-0">
                        {hasEnabled && (
                            <PermissionToggle
                                label="Enabled"
                                checked={data.enabled}
                                onChange={() => handleToggle('enabled', !data.enabled)}
                                readOnly={readOnly}
                            />
                        )}
                        {hasVisible && (
                            <PermissionToggle
                                label="Visible"
                                checked={data.visible}
                                onChange={() => handleToggle('visible', !data.visible)}
                                readOnly={readOnly}
                            />
                        )}
                        {hasEditable && (
                            <PermissionToggle
                                label="Editable"
                                checked={data.editable}
                                onChange={() => handleToggle('editable', !data.editable)}
                                readOnly={readOnly}
                            />
                        )}
                        {deleteKey && (
                            <PermissionToggle
                                label="Deletable"
                                checked={data[deleteKey]}
                                onChange={() => handleToggle(deleteKey, !data[deleteKey])}
                                readOnly={readOnly}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Recursion for children with Vertical Line */}
            {childrenKeys.length > 0 && (
                <div className="ml-5 pl-5 border-l-2 border-slate-200 dark:border-slate-700 mt-1 space-y-1">
                    {childrenKeys.map(key => (
                        <PermissionItem
                            key={key}
                            label={formatLabel(key)}
                            data={data[key]}
                            path={[...path, key]}
                            onChange={onChange}
                            readOnly={readOnly}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface PermissionAccordionProps {
    label: string;
    data: any;
    categoryKey: string;
    onChange: (path: string[], value: any) => void;
    readOnly?: boolean;
}

const PermissionAccordion: React.FC<PermissionAccordionProps> = ({ label, data, categoryKey, onChange, readOnly }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Calculate Summary Counts Recursively
    const counts = useMemo(() => {
        let c = { enabled: 0, visible: 0, editable: 0 };

        const traverse = (obj: any) => {
            if (!obj || typeof obj !== 'object') return;

            if (obj.enabled === true) c.enabled++;
            if (obj.visible === true) c.visible++;
            if (obj.editable === true) c.editable++;

            Object.keys(obj).forEach(key => {
                const val = obj[key];
                if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                    traverse(val);
                }
            });
        };

        traverse(data);
        return c;
    }, [data]);

    return (
        <div className="bg-white border-b border-gray-200 first:border-t border-x rounded-none first:rounded-t-lg last:rounded-b-lg shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown size={20} className="text-indigo-500" /> : <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600" />}
                    <h3 className={`text-lg font-semibold transition-colors ${isOpen ? 'text-indigo-900 line-clamp-1' : 'text-gray-800'}`}>{label}</h3>
                </div>

                {/* Summary Indicators */}
                <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${counts.enabled > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'text-gray-400 bg-gray-50'}`}>
                        {counts.enabled > 0 && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                        <span>Enabled ({counts.enabled})</span>
                    </div>

                    <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${counts.visible > 0 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-400'}`}>
                        <span>Visible ({counts.visible})</span>
                    </div>

                    <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${counts.editable > 0 ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'text-gray-400'}`}>
                        <span>Editable ({counts.editable})</span>
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                    <PermissionItem
                        label={label}
                        data={data}
                        path={[categoryKey]}
                        onChange={onChange}
                        readOnly={readOnly}
                        level={0}
                    />
                </div>
            )}
        </div>
    );
};

export default PermissionAccordion;
