
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle,
    Fingerprint, Globe, Shield, Command, Building2
} from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { useGoogleLogin } from '@react-oauth/google';
import { useMsal } from '@azure/msal-react';
import { authService, passkeyService } from '../../services/api';
import { startAuthentication } from '@simplewebauthn/browser';
import { SupportRequestModal } from '../../components/Security/SupportRequestModal';

interface LoginProps {
    onLogin: () => void;
}

export const Login = ({ onLogin }: LoginProps) => {
    const { t } = useTranslation();
    const { addToast, addPromise } = useToast();
    const { instance } = useMsal();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            addToast(t("Please enter both email and password."), "error");
            return;
        }

        setIsLoading(true);

        try {
            await authService.login(email, password);
            addToast(t('Successfully logged in!'), "success");
            onLogin();
        } catch (error: any) {
            const status = error.response?.status;
            const message = error.response?.data?.message || "";

            if (status === 404) {
                addToast(t("Account not found. Please check with the support team."), "error");
                setIsSupportOpen(true); // Open modal for 404 as requested
            } else if (status === 403 || status === 401) {
                addToast(message || t("Authentication failed."), "error");
                setIsSupportOpen(true);
            } else {
                addToast(t("An unexpected error occurred. Please try again later."), "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasskeyLogin = async () => {
        // Check for WebAuthn support
        if (!window.PublicKeyCredential) {
            addToast(t("WebAuthn is not supported on this device."), "error");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Get authentication options from server (email optional)
            const options = await passkeyService.getAuthenticationOptions(email || undefined);

            // 2. Start WebAuthn authentication
            const credential = await startAuthentication({
                optionsJSON: options,
            });

            // 3. Verify response with server
            await passkeyService.verifyLogin(email || undefined, credential);
            addToast(t('Authenticated with Passkey!'), "success");
            onLogin();

        } catch (err: any) {
            console.error("Passkey Auth Error:", err);

            const status = err.response?.status;
            const message = err.response?.data?.message || "";

            if (status === 404) {
                addToast(t("Account not found. Please check with the support team."), "error");
                setIsSupportOpen(true);
            } else if (status === 403 || status === 401) {
                addToast(message || t("Passkey authentication failed."), "error");
                setIsSupportOpen(true);
            } else if (err.name === 'NotAllowedError') {
                addToast(t("Passkey authentication was cancelled."), "info");
            } else {
                addToast(t("Passkey authentication failed. Please try again or use password."), "error");
            }
        } finally {
            setIsLoading(false);
        }
    };



    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            console.log("Google Login Success:", tokenResponse);

            try {
                // Use the new backend endpoint for real verification and login
                await authService.googleLogin(tokenResponse.access_token);

                addToast(t('Successfully logged in via Google!'), "success");
                onLogin();
            } catch (error) {
                console.error("Google Backend Login Failed:", error);
                // Fallback or Error handling
                addToast(t('Google login failed. Please try again.'), "error");
                setIsSupportOpen(true);
            } finally {
                setIsLoading(false);
            }
        },
        onError: (errorResponse) => {
            console.error("Google Login Error:", errorResponse);
            // Don't open support if user just closed the popup
            if ((errorResponse as any).error !== 'popup_closed_by_user') {
                addToast(t("Google Sign-In failed. Please try again."), "error");
                setIsSupportOpen(true);
            }
            setIsLoading(false);
        }
    });

    const handleMicrosoftLogin = async () => {
        setIsLoading(true);
        try {
            const response = await instance.loginPopup({
                scopes: ["User.Read", "Calendars.Read"]
            });
            console.log("Microsoft Login Success:", response);

            const msAuthAction = new Promise<void>((resolve) => {
                // Simulate backend validation
                setTimeout(() => {
                    localStorage.setItem('authToken', `ms-token-${response.accessToken.substring(0, 10)}`);
                    resolve();
                }, 800);
            });

            await addPromise(msAuthAction, {
                loading: t('Connecting to Microsoft...'),
                success: t('Successfully logged in via Microsoft!'),
                error: t('Microsoft login failed.')
            });

            onLogin();
        } catch (error: any) {
            console.error("Microsoft Login Error:", error);
            // Don't open support if user cancelled the login
            const isCancelled = error.name === 'BrowserAuthError' && error.errorCode === 'user_cancelled';
            if (!isCancelled) {
                addToast(t("Microsoft Sign-In failed. Please try again."), "error");
                setIsSupportOpen(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white dark:bg-slate-900 transition-colors duration-300">

            {/* Left Side - Visuals (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 z-0">
                    {/* Abstract Background */}
                    <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-emerald-900/30 blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/30 blur-3xl"></div>

                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                            <Command size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">MapRecruit</span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        {t("Intelligent Hiring")} <br />
                        <span className="text-emerald-400">{t("Simplified.")}</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                        {t("Streamline your recruitment process with AI-powered sourcing, matching, and engagement workflows designed for modern teams.")}
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 w-48">
                            <Shield size={24} className="text-emerald-400 mb-3" />
                            <div className="h-2 w-16 bg-white/20 rounded mb-2"></div>
                            <div className="h-2 w-24 bg-white/10 rounded"></div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 w-48 translate-y-4">
                            <Globe size={24} className="text-blue-400 mb-3" />
                            <div className="h-2 w-16 bg-white/20 rounded mb-2"></div>
                            <div className="h-2 w-24 bg-white/10 rounded"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>© 2025 MapRecruit.ai</span>
                        <span>•</span>
                        <a href="#" className="hover:text-white transition-colors">{t("Privacy")}</a>
                        <span>•</span>
                        <a href="#" className="hover:text-white transition-colors">{t("Terms")}</a>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-4">
                            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm text-white">
                                <Command size={28} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("Welcome back")}</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">{t("Please enter your details to sign in.")}</p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("Email Address")}</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="name@company.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("Password")}</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:bg-slate-700 dark:border-slate-600" />
                                <span className="text-slate-600 dark:text-slate-400">{t("Remember me")}</span>
                            </label>
                            <button type="button" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">{t("Forgot password?")}</button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>{t("Sign in")} <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400">{t("Or sign in with")}</span></div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => loginWithGoogle()}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium disabled:opacity-60"
                        >
                            {/* Google Icon SVG */}
                            <svg viewBox="0 0 48 48" width="18" height="18">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            {t("Google Workspace")}
                        </button>

                        <button
                            onClick={handleMicrosoftLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium disabled:opacity-60"
                        >
                            <svg viewBox="0 0 21 21" width="18" height="18" className="mr-1">
                                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                            </svg>
                            {t("Microsoft 365")}
                        </button>

                        <button
                            onClick={handlePasskeyLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium disabled:opacity-60"
                        >
                            <Fingerprint size={18} className="text-emerald-500" />
                            {t("Sign in via Passkey")}
                        </button>
                    </div>
                </div>
            </div>
            <SupportRequestModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
                userId={email || 'Unknown'}
                currentUrl={window.location.href}
                activeClientID="Unknown"
                activeCompanyID="Unknown"
            />
        </div >
    );
};
