import React, { useState, useRef, useEffect } from 'react';
import {
    AlertCircle, AlertTriangle, Heart, FileText, UserCheck, UserX, User,
    CheckCircle, Ban, Users, FileEdit, Eye, EyeOff, Download, Link, Mail,
    MessageSquare, Share2, FolderPlus, Tag, Settings, ExternalLink, Video,
    Upload, Edit3, MoreHorizontal
} from 'lucide-react';

interface HeroWidgetsProps {
    widgets: any; // profileWidgets from schema
    metaData: any;
    permissions: { canEdit: boolean };
    onAction: (action: string, data?: any) => void;
    matchScore?: number;
    shortlistStatus?: 'shortlisted' | 'rejected' | 'none';
}

export const HeroWidgets: React.FC<HeroWidgetsProps> = ({
    widgets = {},
    metaData = {},
    permissions = { canEdit: true },
    onAction,
    matchScore,
    shortlistStatus = 'none'
}) => {
    const [showOverflow, setShowOverflow] = useState(false);
    const [showShortlistOptions, setShowShortlistOptions] = useState(false);

    const overflowRef = useRef<HTMLDivElement>(null);
    const shortlistRef = useRef<HTMLDivElement>(null);

    // Close popovers on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (overflowRef.current && !overflowRef.current.contains(event.target as Node)) {
                setShowOverflow(false);
            }
            if (shortlistRef.current && !shortlistRef.current.contains(event.target as Node)) {
                setShowShortlistOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper to render standard button widget
    const renderBtn = (key: string, icon: React.ReactNode, label: string, colorClass: string, onClick: () => void, textValue?: string) => {
        return (
            <button
                key={key}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                    setShowOverflow(false);
                }}
                title={label}
                className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group ${colorClass}`}
            >
                {icon}
                {textValue && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">{textValue}</span>}
            </button>
        );
    };

    // Logic for State-Dependent Widgets
    const isDuplicate = !!metaData.originalID;
    const isMissingInfo = metaData.missingMandatoryFields && metaData.missingMandatoryFields.length > 0;

    // Placeholder States
    const isFavourite = false;
    const hasResume = true;
    const isOptOut = false;
    const isRecommended = false;
    const isViewed = true;
    const automationEligible = true;

    // --- SHORTLIST WIDGET WITH POPOVER ---
    const renderShortlistWidget = () => {
        if (!widgets.shortListWidget) return null;

        return (
            <div key="shortlist" className="relative" ref={shortlistRef}>
                <button
                    onClick={() => setShowShortlistOptions(!showShortlistOptions)}
                    title="Shortlist Status"
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {shortlistStatus === 'shortlisted' ? <UserCheck size={18} className="text-green-600" /> :
                        shortlistStatus === 'rejected' ? <UserX size={18} className="text-red-600" /> :
                            <User size={18} className="text-slate-400" />}
                </button>

                {showShortlistOptions && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 flex gap-2 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => { onAction('shortlist_accept'); setShowShortlistOptions(false); }}
                            className="p-3 bg-slate-50 hover:bg-green-50 rounded-lg text-slate-400 hover:text-green-600 transition-colors"
                            title="Shortlist"
                        >
                            <UserCheck size={20} />
                        </button>
                        <button
                            onClick={() => { onAction('shortlist_reject'); setShowShortlistOptions(false); }}
                            className="p-3 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                            title="Reject"
                        >
                            <UserX size={20} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Collect ALL enabled widgets in order
    const allWidgets: React.ReactNode[] = [
        // 1. Alerts
        (isDuplicate && widgets.duplicateWidget) && renderBtn('duplicate', <AlertCircle size={18} />, "Duplicate Profile", "text-yellow-500 hover:bg-yellow-50 animate-pulse", () => onAction('duplicate')),
        (isMissingInfo && widgets.attentionWidget) && renderBtn('attention', <AlertTriangle size={18} />, "Missing Information", "text-amber-500 hover:bg-amber-50", () => onAction('attention')),

        // 2. Core Actions
        (widgets.editProfileWidget && permissions.canEdit) && renderBtn('edit_global', <Edit3 size={18} />, "Edit Profile", "text-slate-600 hover:text-green-600 hover:bg-green-50", () => onAction('edit_global')),

        widgets.resumeWidget && renderBtn('resumeWidget', <FileText size={18} />, "View Resume", hasResume ? "text-blue-600 hover:bg-blue-50" : "text-slate-300", () => onAction('view_resume')),

        // SHORTLIST (Special)
        renderShortlistWidget(),

        widgets.favouriteWidget && renderBtn('favouriteWidget', <Heart size={18} className={isFavourite ? "fill-red-500 text-red-500" : ""} />, "Favourite", isFavourite ? "text-red-500" : "text-slate-400 hover:text-red-500", () => onAction('toggle_fav')),

        widgets.unSubscribeWidget && renderBtn('unsubscribe', isOptOut ? <Ban size={18} className="text-red-500" /> : <CheckCircle size={18} className="text-green-500" />, "Contact Status", "hover:bg-slate-100", () => onAction('unsubscribe')),

        // ... Rest of widgets
        widgets.referralWidget && renderBtn('referralWidget', <Users size={18} />, "Referral", isRecommended ? "text-purple-600" : "text-slate-300", () => onAction('referral')),

        widgets.profileSummaryWidget && renderBtn('profileSummaryWidget', <FileEdit size={18} />, "GenAI Summary", "text-slate-600 hover:text-indigo-600", () => onAction('genai_summary')),

        widgets.profileViewedWidget && renderBtn('profileViewedWidget', isViewed ? <Eye size={18} /> : <EyeOff size={18} />, "Viewed Status", "text-slate-500", () => onAction('toggle_viewed')),

        widgets.downloadProfileWidget && renderBtn('downloadProfileWidget', <Download size={18} />, "Download", "text-slate-600", () => onAction('download')),

        widgets.linkCampaignWidget && renderBtn('linkCampaignWidget', <Link size={18} />, "Link to Campaign", "text-slate-600", () => onAction('link_campaign')),

        widgets.massEmailWidget && renderBtn('massEmailWidget', <Mail size={18} />, "Email Candidate", "text-slate-600", () => onAction('email')),

        widgets.massSMSWidget && renderBtn('massSMSWidget', <MessageSquare size={18} />, "SMS Candidate", "text-slate-600", () => onAction('sms')),

        widgets.profileShareWidget && renderBtn('profileShareWidget', <Share2 size={18} />, "Share Profile", "text-slate-600", () => onAction('share')),

        widgets.linkFolderWidget && renderBtn('linkFolderWidget', <FolderPlus size={18} />, "Add to Folder", "text-slate-600", () => onAction('folder')),

        widgets.tagsAttachWidget && renderBtn('tagsAttachWidget', <Tag size={18} />, "Manage Tags", "text-slate-600", () => onAction('tags')),

        widgets.skipAutomationWidget && renderBtn('automation', <Settings size={18} className={automationEligible ? "text-green-600" : "text-slate-400"} />, "Automation Eligibility", "hover:bg-slate-100", () => onAction('automation')),

        widgets.exportProfileWidget && renderBtn('exportProfileWidget', <ExternalLink size={18} />, "Export / Open Link", "text-slate-600", () => onAction('export')),

        widgets.directVideoWidget && renderBtn('directVideoWidget', <Video size={18} />, "Direct Video Call", "text-slate-600", () => onAction('video_call')),

        widgets.uploadResumesWidget && renderBtn('uploadResumesWidget', <Upload size={18} />, "Upload New Resume", "text-slate-600", () => onAction('upload_resume'))

    ].filter(Boolean); // Filter out false/nulls

    // SLICE LOGIC
    const VISIBLE_COUNT = 6;
    const visibleWidgets = allWidgets.slice(0, VISIBLE_COUNT);
    const overflowWidgets = allWidgets.slice(VISIBLE_COUNT);

    return (
        <div className="flex items-center gap-1 relative">

            {/* Render Visible Widgets */}
            {visibleWidgets.map((widget, idx) => (
                <React.Fragment key={idx}>
                    {widget}
                </React.Fragment>
            ))}

            {/* Overflow Menu Trigger */}
            {overflowWidgets.length > 0 && (
                <div className="relative" ref={overflowRef}>
                    <button
                        onClick={() => setShowOverflow(!showOverflow)}
                        className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${showOverflow ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}
                        title="More Actions"
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {/* Dropdown Content */}
                    {showOverflow && (
                        <div className="absolute top-10 right-0 z-[100] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2.5 w-[220px] animate-in slide-in-from-top-2 duration-200 origin-top-right ring-4 ring-black/5 dark:ring-white/5">
                            <div className="grid grid-cols-4 gap-1.5">
                                {overflowWidgets.map((widget, idx) => (
                                    <div key={idx} className="flex justify-center h-10 w-10">
                                        {widget}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};
