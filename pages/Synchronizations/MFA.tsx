
import React, { useState, useEffect } from 'react';
import { 
  Shield, Smartphone, CheckCircle, AlertTriangle, 
  QrCode, Copy, ArrowRight, RefreshCw, Trash2, Lock, Building2
} from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { useUserProfile } from '../../hooks/useUserProfile';

type MFAStatus = 'DISABLED' | 'SETUP' | 'VERIFY' | 'ACTIVE';

export const MFA = () => {
  const { addToast } = useToast();
  const { userProfile } = useUserProfile();
  
  // Simulation State
  const [status, setStatus] = useState<MFAStatus>('DISABLED');
  const [orgEnforced, setOrgEnforced] = useState(false); // Mock Org Setting
  const [verificationCode, setVerificationCode] = useState('');
  const [secret] = useState('JBSWY3DPEHPK3PXP'); // Mock Base32 Secret
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Generate QR Code URL for TOTP
    // Format: otpauth://totp/Issuer:Account?secret=Secret&issuer=Issuer
    const label = `MapRecruit:${userProfile.email}`;
    const issuer = 'MapRecruit';
    const otpAuthUrl = `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}`;
    
    // Using a public API to generate QR for the demo visuals
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpAuthUrl)}`);
  }, [userProfile.email, secret]);

  const handleStartSetup = () => {
    setStatus('SETUP');
  };

  const handleVerify = () => {
    if (verificationCode.length !== 6) {
        addToast("Please enter a valid 6-digit code", "error");
        return;
    }
    // Mock Verification Logic
    setStatus('ACTIVE');
    addToast("MFA Successfully Enabled", "success");
    setVerificationCode('');
  };

  const handleRemove = () => {
    if (orgEnforced) {
        addToast("Cannot disable MFA. It is enforced by your organization.", "error");
        return;
    }
    if (confirm("Are you sure you want to remove MFA? Your account will be less secure.")) {
        setStatus('DISABLED');
        addToast("MFA has been disabled", "info");
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Shield size={24} className="text-emerald-500" /> Multi-Factor Authentication (MFA)
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
                Secure your account by requiring a code from an authenticator app (Google Authenticator, Microsoft Authenticator, etc.) during sign-in.
            </p>
        </div>

        {/* Stage 1: Organization Policy Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${orgEnforced ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
            <div className={`p-2 rounded-lg ${orgEnforced ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                <Building2 size={20} />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Stage 1: Organization Policy</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {orgEnforced 
                        ? "Your organization requires MFA for all accounts. You must register a device to access sensitive data." 
                        : "MFA is currently optional for your organization, but highly recommended for security."}
                </p>
            </div>
            {/* Mock Toggle for Demo purposes */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Demo: Enforce?</span>
                <button 
                    onClick={() => {
                        setOrgEnforced(!orgEnforced);
                        if (!orgEnforced && status === 'DISABLED') setStatus('SETUP'); // Auto-start if enforced
                    }}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${orgEnforced ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${orgEnforced ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
            </div>
        </div>

        {/* Info Box regarding Login Types */}
        <div className="flex gap-3 items-center p-3 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
            <Lock size={14} />
            <span>
                <strong>Note:</strong> MFA verification is only required for standard ID/Password logins. SSO (Google/Microsoft) and Passkey logins handle their own verification steps.
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Panel: Status & Actions */}
            <div className="space-y-6">
                
                {/* Current Status Card */}
                <div className={`p-6 rounded-xl border-2 transition-all ${status === 'ACTIVE' ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Status</span>
                        {status === 'ACTIVE' ? (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold">
                                <CheckCircle size={12} /> Enabled
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold">
                                Disabled
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                            <Smartphone size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Authenticator App</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Time-based One-Time Password (TOTP)</p>
                        </div>
                    </div>

                    {status === 'DISABLED' && (
                        <button 
                            onClick={handleStartSetup}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                            Configure MFA <ArrowRight size={16} />
                        </button>
                    )}

                    {status === 'ACTIVE' && (
                        <div className="space-y-3">
                            <button 
                                onClick={() => setStatus('SETUP')}
                                className="w-full py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={16} /> Re-configure
                            </button>
                            <button 
                                onClick={handleRemove}
                                disabled={orgEnforced}
                                className={`w-full py-2.5 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 ${orgEnforced ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Trash2 size={16} /> Remove MFA
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Setup Wizard (Stage 2) */}
            {(status === 'SETUP' || status === 'VERIFY') && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg animate-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Stage 2: Device Registration</h3>
                        <div className="flex gap-1">
                            <span className={`w-2 h-2 rounded-full ${status === 'SETUP' ? 'bg-indigo-600' : 'bg-slate-300'}`}></span>
                            <span className={`w-2 h-2 rounded-full ${status === 'VERIFY' ? 'bg-indigo-600' : 'bg-slate-300'}`}></span>
                        </div>
                    </div>

                    {status === 'SETUP' ? (
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-lg border border-slate-200 flex justify-center">
                                {/* Using real QR generation API for demo visualization */}
                                <img src={qrUrl} alt="MFA QR Code" className="w-40 h-40 mix-blend-multiply" />
                            </div>
                            
                            <div className="text-center space-y-2">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Scan this code with your app</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Open Google Authenticator or Microsoft Authenticator and scan the QR code above.
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="text-xs text-slate-500 dark:text-slate-400 overflow-hidden">
                                    <span className="block font-bold uppercase mb-1">Manual Entry Key</span>
                                    <span className="font-mono text-slate-700 dark:text-slate-300 tracking-wider">{secret}</span>
                                </div>
                                <button onClick={() => { navigator.clipboard.writeText(secret); addToast("Secret copied", "success"); }} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 dark:text-slate-400">
                                    <Copy size={16} />
                                </button>
                            </div>

                            <button 
                                onClick={() => setStatus('VERIFY')}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors"
                            >
                                Next Step
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <QrCode size={24} />
                                </div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">Enter Verification Code</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Enter the 6-digit code generated by your authenticator app to verify the connection.
                                </p>
                            </div>

                            <div>
                                <input 
                                    type="text" 
                                    placeholder="000000" 
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full text-center text-2xl tracking-widest font-mono py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none bg-white dark:bg-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setStatus('SETUP')}
                                    className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Back
                                </button>
                                <button 
                                    onClick={handleVerify}
                                    disabled={verificationCode.length !== 6}
                                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors"
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Stage 3: Active State Visual */}
            {status === 'ACTIVE' && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800 p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">MFA is Active</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 max-w-xs leading-relaxed">
                        Your account is secured. We will ask for a code whenever you sign in with your password.
                    </p>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
