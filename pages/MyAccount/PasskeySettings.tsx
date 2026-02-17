import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Fingerprint, Monitor, Smartphone, Tablet,
    CheckCircle2, Plus, ShieldCheck, Trash2
} from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { passkeyService } from '../../services/api';
import { startRegistration } from '@simplewebauthn/browser';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useEffect } from 'react';

export const PasskeySettings = ({ isModal = false }: { isModal?: boolean }) => {
    const { t } = useTranslation();
    const { addToast, addPromise } = useToast();
    const { userProfile, refetchProfile, saveProfile } = useUserProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [currentDeviceType, setCurrentDeviceType] = useState<string>('');

    useEffect(() => {
        const ua = navigator.userAgent;
        let type = 'desktop';
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            type = 'tablet';
        } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|browser)OS|WebOS|BrowserNG|WebE/i.test(ua)) {
            type = 'mobile';
        }
        setCurrentDeviceType(type);
    }, []);

    const deviceSlots = [
        { id: 'desktop', label: t('Desktop Passkey'), icon: Monitor, color: 'text-blue-500' },
        { id: 'mobile', label: t('Mobile Passkey'), icon: Smartphone, color: 'text-emerald-500' },
        { id: 'tablet', label: t('Tablet Passkey'), icon: Tablet, color: 'text-indigo-500' },
    ];

    const handleRegister = async (deviceType: string) => {
        if (!window.PublicKeyCredential) {
            addToast(t("Passkeys are not supported by this browser."), "error");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Get options from server
            const options = await passkeyService.getRegistrationOptions(deviceType);

            // 2. Start WebAuthn registration
            const credential = await startRegistration({
                optionsJSON: options,
            });

            // 3. Verify with server
            const verifyAction = async () => {
                const response = await passkeyService.verifyRegistration(credential, deviceType);

                // Immediate Local Update (Optimistic UI)
                if (response.passkeys) {
                    saveProfile({
                        ...userProfile,
                        passkeys: response.passkeys
                    });
                }

                // Robust Server Sync
                if (refetchProfile) {
                    await refetchProfile();
                }
            };

            await addPromise(verifyAction(), {
                loading: t('Registering your device...'),
                success: t('Passkey registered successfully!'),
                error: t('Failed to register passkey.')
            });

        } catch (err: any) {
            console.error("Passkey Registration Error:", err);
            if (err.name === 'NotAllowedError') {
                addToast(t("Registration cancelled or timed out."), "info");
            } else {
                addToast(t("Registration failed. Please try again."), "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isRegistered = (slotId: string) => {
        return !!userProfile?.passkeys?.[slotId];
    };

    return (
        <div className={isModal ? "" : "p-8 lg:p-12 mb-20 max-w-4xl mx-auto"}>
            {!isModal && (
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('Passkey Security')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {t('Sign in faster and more securely using biometric authentication like Touch ID or Face ID.')}
                    </p>
                </div>
            )}

            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-6 mb-8 flex items-start gap-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-400 mb-1">{t('Why use Passkeys?')}</h4>
                    <p className="text-sm text-emerald-700/80 dark:text-emerald-400/70 leading-relaxed">
                        {t('Passkeys are more secure than passwords and are protected by your device\'s biometrics. They are resistant to phishing and credential leaks.')}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {deviceSlots.map((device) => {
                    const registered = isRegistered(device.id);
                    const isCurrent = device.id === currentDeviceType;
                    const Icon = device.icon;

                    return (
                        <div
                            key={device.id}
                            className={`flex items-center justify-between p-5 rounded-xl border transition-all ${registered
                                ? 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-900/50 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-dashed hover:border-emerald-500/30'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${registered ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                                    <Icon size={24} className={registered ? device.color : 'text-slate-400'} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        {device.label}
                                        {registered && <CheckCircle2 size={16} className="text-emerald-500" />}
                                        {isCurrent && !registered && (
                                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {t('Current Device')}
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {registered
                                            ? t('Registered and active for secure sign-in.')
                                            : t('Register a passkey for this slot.')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {isCurrent && !registered && (
                                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {t('Current Device')}
                                    </span>
                                )}
                                <button
                                    onClick={() => handleRegister(device.id)}
                                    disabled={isLoading}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${registered
                                        ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
                                        }`}
                                >
                                    {registered ? (
                                        <>{t('Update')}</>
                                    ) : (
                                        <><Plus size={16} /> {t('Add')}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                    <Fingerprint size={18} />
                    <span className="text-sm font-bold uppercase tracking-wider">{t('Security Tip')}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('For the best experience, we recommend registering a passkey on each device you use frequently.')}
                </p>
            </div>
        </div>
    );
};
