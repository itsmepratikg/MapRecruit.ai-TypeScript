
import React from 'react';
import { Activity } from '../types/Activity';
import { sanitizeActivityHtml, getActivityActorName } from '../utils/activityUtils';
import {
    Mail, Upload, Paperclip, Eye, GitMerge, FileEdit, UserX, Activity as ActivityIcon,
    CheckCircle, User, MessageCircle, Calendar, Clock, Lock, Shield, FileText, Settings, RefreshCw
} from 'lucide-react';
import { PreviewModal } from './PreviewModal';

interface ActivityItemProps {
    activity: Activity;
    index: number;
    viewContext?: 'profile' | 'campaign' | 'global';
}

// Icon Mapping Logic
const getActivityIcon = (activityType: string) => {
    // Normalize string to handle case variations if needed, though usually consistent
    const type = activityType || '';

    if (type.includes('Email') || type.includes('Mail')) return <Mail size={16} />;
    if (type.includes('Upload')) return <Upload size={16} />;
    if (type.includes('Linked')) return <Paperclip size={16} />;
    if (type.includes('Viewed') || type.includes('View')) return <Eye size={16} />;
    if (type.includes('Merged')) return <GitMerge size={16} />;
    if (type.includes('Edit') || type.includes('Update')) return <FileEdit size={16} />;
    if (type.includes('Reject')) return <UserX size={16} />;
    if (type.includes('Create') || type.includes('Added')) return <CheckCircle size={16} />;
    if (type.includes('Status')) return <RefreshCw size={16} />;
    if (type.includes('Survey') || type.includes('Screening')) return <FileText size={16} />;
    if (type.includes('Settings')) return <Settings size={16} />;
    if (type.includes('Contact')) return <User size={16} />;

    // Default
    return <ActivityIcon size={16} />;
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity, index, viewContext = 'global' }) => {
    const [showPreview, setShowPreview] = React.useState(false);
    const date = new Date(activity.activityAt || activity.createdAt);

    // Select the best content string based on context
    let rawContent = '';
    if (viewContext === 'profile') {
        rawContent = activity.activity?.profileActivity || activity.activity?.commonActivity || '';
    } else if (viewContext === 'campaign') {
        rawContent = activity.activity?.campaignActivity || activity.activity?.commonActivity || '';
    } else {
        // Global/Common
        rawContent = activity.activity?.commonActivity || activity.activity?.userActivities || '';
    }

    // Fallback if specific one is empty
    if (!rawContent) {
        rawContent = activity.activity?.commonActivity || activity.activity?.profileActivity || activity.activity?.campaignActivity || '';
    }

    const htmlContent = sanitizeActivityHtml(rawContent);
    const actorName = getActivityActorName(activity);
    const icon = getActivityIcon(activity.activityType);

    // Format Date: e.g., "Monday, 30 June 2025" or "Today" check?
    // User screenshot shows: "Monday, 30 June 2025" as a header?
    // Attempt to follow the screenshot's "Activity -> Type -> By -> Time" inside the card.

    return (
        <div className="relative pl-8 pb-6 group animate-in slide-in-from-bottom-2 duration-300">
            {/* Timeline Line */}
            <div className="absolute left-[7px] top-6 bottom-[-24px] w-[2px] bg-slate-100 dark:bg-slate-700 group-last:hidden"></div>

            {/* Timeline Dot Removed as per request */}
            {/* <div className={`absolute -left-[1px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-sm z-10 flex items-center justify-center transition-colors ${index === 0 ? 'bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-900/20' : 'bg-slate-300 dark:bg-slate-600'}`}>
            </div> */}

            <div className="flex flex-col gap-2">

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all">
                    <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${index === 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-slate-50 text-slate-500 dark:bg-slate-700 dark:text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/20 dark:group-hover:text-emerald-400'}`}>
                            {/* Check if previewable (Email/SMS) */}
                            {(activity.activityType?.includes('Email') || activity.activityType?.includes('SMS') || activity.activityType?.includes('Message')) ? (
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="hover:scale-110 transition-transform cursor-pointer"
                                    title="View Preview"
                                >
                                    {icon}
                                </button>
                            ) : (
                                icon
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            {/* 1. Activity (Content) */}
                            {htmlContent ? (
                                <div
                                    className="text-sm font-medium text-slate-800 dark:text-slate-200 prose prose-sm max-w-none dark:prose-invert leading-snug mb-2 [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-700 dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300"
                                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                                />
                            ) : (
                                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                                    {activity.activityGroup} - {activity.activityType}
                                </div>
                            )}

                            {/* 1b. Updated Fields (Profile Edits) */}
                            {activity.updatedFields && activity.updatedFields.length > 0 && (
                                <div className="mt-2 mb-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-xs space-y-2 border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
                                    {activity.updatedFields.map((field, i) => {
                                        const formatVal = (val: any) => {
                                            if (typeof val === 'object' && val !== null) return JSON.stringify(val);
                                            return String(val ?? 'N/A');
                                        };
                                        return (
                                            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 border-b border-slate-100 dark:border-slate-600/50 last:border-0 pb-1.5 last:pb-0">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-[100px] shrink-0 capitalize">
                                                    {field.fieldName?.replace(/_/g, ' ') || 'Field'}:
                                                </span>
                                                <div className="flex items-start gap-2 flex-1 flex-wrap break-all">
                                                    <span className="text-red-400 dark:text-red-300/70 line-through decoration-red-300/50 bg-red-50 dark:bg-red-900/10 px-1 rounded">
                                                        {formatVal(field.oldValue)}
                                                    </span>
                                                    <span className="text-slate-400">→</span>
                                                    <span className="font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-1 rounded">
                                                        {formatVal(field.newValue)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                {/* 2. Activity Type */}
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                                    {activity.activityType}
                                </span>

                                {/* 3. By User */}
                                <span className="flex items-center gap-1">
                                    by <span className="font-medium text-slate-700 dark:text-slate-200">{actorName}</span>
                                </span>

                                {/* 4. Time */}
                                <span className="flex items-center gap-1 font-mono text-slate-400">
                                    <Clock size={10} />
                                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  • {date.toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal for Email/SMS/Message */}
            <PreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                title={`${activity.activityType} Preview`}
                content="" // TODO: Use activity.dataID to query 'communication' collection in the future
            />
        </div>
    );
};
