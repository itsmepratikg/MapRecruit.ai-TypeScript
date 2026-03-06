import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GitBranch, Headset } from '../Icons';
import { SupportRequestModal } from '../Security/SupportRequestModal';
import { useUserContext } from '../../context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface NotFoundProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    showSupportButton?: boolean;
    onGoBack?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({
    title,
    description,
    icon,
    showSupportButton = true,
    onGoBack
}) => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { userProfile } = useUserContext();
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    const activeCompanyId = userProfile?.currentCompanyID || userProfile?.companyID || userProfile?.companyId || 'UNKNOWN';
    const activeClientId = userProfile?.activeClientID || userProfile?.clientID || userProfile?.clientId || 'UNKNOWN';
    const userId = userProfile?._id || 'UNKNOWN';

    const handleGoBack = () => {
        if (onGoBack) {
            onGoBack();
        } else if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/dashboard'); // Fallback if direct link
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="mb-8">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner text-slate-400">
                    {icon || <GitBranch size={48} />}
                </div>
                <h1 className="text-6xl font-black text-slate-200 dark:text-slate-700 mb-4 tracking-tight">404</h1>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title || t("Feature Not Enabled")}</h2>
                <p className="max-w-md mx-auto text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {description || t("The requested feature is not enabled for your current configuration. If you believe this is an error, please reach out to our support team.")}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleGoBack}
                    className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all shadow-sm active:scale-95"
                >
                    {t("Go Back")}
                </button>
                {showSupportButton && (
                    <button
                        onClick={() => setIsSupportOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
                    >
                        <Headset size={18} /> {t("Contact Support")}
                    </button>
                )}
            </div>

            {isSupportOpen && (
                <SupportRequestModal
                    isOpen={isSupportOpen}
                    onClose={() => setIsSupportOpen(false)}
                    userId={String(userId)}
                    currentUrl={window.location.origin + location.pathname}
                    activeClientID={String(activeClientId)}
                    activeCompanyID={String(activeCompanyId)}
                />
            )}
        </div>
    );
};
