
import React, { useState, useEffect } from 'react';
import {
  Lock, Shield, CheckCircle, XCircle, Eye, EyeOff,
  Save, RefreshCw, AlertCircle, Check, Key, Globe, LogOut, Edit2, AlertTriangle, Fingerprint, X
} from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { PasskeySettings } from './PasskeySettings';
import { useUserProfile } from '../../hooks/useUserProfile';
import { integrationService } from '../../services/integrationService';

// --- Mock Data for Global Defaults ---
const SECURITY_POLICIES = {
  sessionTimeout: '30 Minutes',
  passwordMinLength: 10,
  passwordMaxLength: 30,
  passwordExpiry: '90 Days',
  mfaEnabled: true
};

// --- Helper: Password Input Component ---
const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  hideToggle
}: {
  label: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  placeholder?: string,
  disabled?: boolean,
  hideToggle?: boolean
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full pl-3 pr-10 py-2.5 border rounded-lg text-sm outline-none transition-all ${disabled
            ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed'
            : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-slate-200'
            }`}
          placeholder={placeholder}
        />
        {!hideToggle && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            disabled={disabled}
            className={`absolute right-3 top-2.5 ${disabled ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Confirmation Modal ---
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, type = 'info', confirmText = 'Confirm' }: { isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void, type?: 'info' | 'danger', confirmText?: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col items-center text-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${type === 'danger' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
            {type === 'danger' ? <AlertTriangle size={24} /> : <Fingerprint size={24} />}
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2 text-white rounded-lg font-bold shadow-sm transition-colors text-sm ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

export const AuthSync = () => {
  const { addToast } = useToast();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'PASSWORD' | 'LOGOUT' | 'PASSKEY' | null>(null);
  const [showPasskeyManager, setShowPasskeyManager] = useState(false);

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [ssoStatus, setSsoStatus] = useState({
    google: true,
    microsoft: false,
    passkey: false
  });

  // Check for existing passkey in storage on load
  // Sync with Real User Profile for Passkey Status
  const { userProfile } = useUserProfile();

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const status = await integrationService.getStatus();
        setSsoStatus(prev => ({
          ...prev,
          google: status.google.connected,
          microsoft: status.microsoft.connected
        }));
      } catch (error) {
        console.error("Failed to sync integration status", error);
      }
    };
    fetchIntegrations();
  }, []);

  useEffect(() => {
    // Check if user has ANY passkeys registered in the profile object
    const hasPasskey = userProfile?.passkeys && Object.keys(userProfile.passkeys).length > 0;

    setSsoStatus(prev => ({
      ...prev,
      passkey: !!hasPasskey
    }));
  }, [userProfile]);

  // Validation State
  const [validity, setValidity] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
    match: false
  });

  // Real-time Validation Effect
  useEffect(() => {
    const pwd = passwords.new;
    setValidity({
      length: pwd.length >= 10 && pwd.length <= 30,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
      match: pwd.length > 0 && pwd === passwords.confirm
    });
  }, [passwords.new, passwords.confirm]);

  // Current password is no longer required for validation in this flow
  const isFormValid = Object.values(validity).every(Boolean);

  // -- Handlers --

  const initiatePasswordUpdate = () => {
    if (isFormValid) {
      setConfirmAction('PASSWORD');
    } else {
      addToast("Please satisfy all password requirements.", "error");
    }
  };

  const confirmPasswordUpdate = () => {
    // Simulate API call
    setTimeout(() => {
      addToast("Password updated successfully. Please re-login.", "success");
      setPasswords({ current: '', new: '', confirm: '' });
      setIsEditing(false);
      setConfirmAction(null);
    }, 800);
  };

  const initiateLogout = () => {
    setConfirmAction('LOGOUT');
  };

  const confirmLogout = () => {
    setTimeout(() => {
      addToast("Logged out from all other devices.", "success");
      setConfirmAction(null);
    }, 500);
  };

  const confirmPasskeySetup = async () => {
    // Check for WebAuthn support
    if (!window.PublicKeyCredential) {
      addToast("Biometric passkeys are not supported on this device/browser.", "error");
      setConfirmAction(null);
      return;
    }

    try {
      // 1. Generate Challenge (In production, this must come from the server)
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // 2. User Info
      const userId = "usr_123_demo";
      const userIdBuffer = Uint8Array.from(userId, c => c.charCodeAt(0));

      // 3. Create Credentials Options
      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "MapRecruit ATS",
          // Use window.location.hostname to support various preview environments
          // Note: navigator.credentials.create requires a secure context (HTTPS or localhost)
          id: window.location.hostname
        },
        user: {
          id: userIdBuffer,
          name: "pratik.gaurav@maprecruit.ai",
          displayName: "Pratik Gaurav"
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },   // ES256
          { type: "public-key", alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform", // Forces TouchID/FaceID/Windows Hello
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "none"
      };

      // This triggers the browser's native biometric dialog
      const credential = await navigator.credentials.create({ publicKey });

      if (credential) {
        console.log("WebAuthn Credential Created:", credential);

        // Store credential ID locally as requested for simulation persistence
        localStorage.setItem('maprecruit_passkey_id', credential.id);

        setSsoStatus(prev => ({ ...prev, passkey: true }));
        addToast("Biometric Passkey registered successfully.", "success");
      }
    } catch (err: any) {
      console.error("WebAuthn Error:", err);

      if (err.name === 'NotAllowedError' || (err.message && err.message.includes('not enabled'))) {
        // Handle both User Cancellation AND Feature Policy Block
        if (err.message && err.message.includes('publickey-credentials-create')) {
          addToast("Feature blocked: WebAuthn permission missing in iframe.", "error");
        } else {
          addToast("Passkey setup cancelled or not allowed.", "info");
        }
      } else if (err.name === 'SecurityError') {
        addToast("Security Error: Passkeys require HTTPS or localhost.", "error");
      } else {
        addToast("Failed to create passkey. Ensure your device supports biometrics.", "error");
      }
    } finally {
      setConfirmAction(null);
    }
  };

  const handleGlobalSave = () => {
    // If new password fields are filled, treat it as a password update attempt
    if (passwords.new) {
      initiatePasswordUpdate();
    } else {
      // Otherwise, just save SSO/Config settings
      addToast("Settings saved successfully.", "success");
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPasswords({ current: '', new: '', confirm: '' });

    // Revert visual state if user cancelled changes without saving
    // (Here we just reload status from storage or default)
    const existingPasskey = localStorage.getItem('maprecruit_passkey_id');
    setSsoStatus(prev => ({ ...prev, passkey: !!existingPasskey }));

    addToast("Changes discarded", "info");
  };

  const toggleSSO = async (provider: 'google' | 'microsoft' | 'passkey') => {
    if (!isEditing) return;

    if (provider === 'passkey') {
      if (!ssoStatus.passkey) {
        // Enabling Passkey triggers the manager modal
        setShowPasskeyManager(true);
      } else {
        // Disabling Passkey (Immediate)
        setSsoStatus(prev => ({ ...prev, passkey: false }));
        localStorage.removeItem('maprecruit_passkey_id'); // Clear legacy if exists
        addToast("Passkey sign-in disabled.", "info");
      }
      return;
    }

    // Handle OAuth Providers
    if (!ssoStatus[provider]) {
      // Connect Logic
      if (provider === 'google') {
        integrationService.connectGoogle();
      } else if (provider === 'microsoft') {
        integrationService.connectMicrosoft();
      }
    } else {
      // Disconnect Logic
      try {
        await integrationService.disconnect(provider);
        setSsoStatus(prev => ({ ...prev, [provider]: false }));
        addToast(`${provider === 'google' ? 'Google' : 'Microsoft'} disconnected`, "success");
      } catch (error) {
        addToast("Failed to disconnect", "error");
      }
    }
  };

  const renderRequirement = (isValid: boolean, label: string) => (
    <div className={`flex items-center gap-2 text-xs transition-colors duration-200 ${isValid ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
      {isValid ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600"></div>}
      {label}
    </div>
  );

  return (
    <div className="p-8 lg:p-12">
      {/* Passkey Manager Modal */}
      {showPasskeyManager && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Passkey Management</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add or update biometric keys for secure sign-in</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasskeyManager(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <PasskeySettings isModal={true} />
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex justify-end">
              <button
                onClick={() => setShowPasskeyManager(false)}
                className="px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmAction === 'PASSWORD'}
        title="Update Password?"
        message="Are you sure you want to change your password? You will need to log in again on all devices."
        onConfirm={confirmPasswordUpdate}
        onCancel={() => setConfirmAction(null)}
        type="danger"
      />

      <ConfirmModal
        isOpen={confirmAction === 'LOGOUT'}
        title="Log Out All Devices?"
        message="This will terminate all active sessions except this one. You will need to sign in again on other devices."
        onConfirm={confirmLogout}
        onCancel={() => setConfirmAction(null)}
        type="danger"
      />

      <ConfirmModal
        isOpen={confirmAction === 'PASSKEY'}
        title="Setup Passkey"
        message="Register your device's biometrics (Touch ID, Face ID, or Windows Hello) for a faster, passwordless sign-in experience."
        onConfirm={confirmPasskeySetup}
        onCancel={() => setConfirmAction(null)}
        type="info"
        confirmText="Register Biometrics"
      />

      <div className="max-w-6xl mx-auto animate-in fade-in duration-300 pb-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Lock size={22} className="text-emerald-500" /> Password & Authentication
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your login credentials, session policies, and single sign-on connections.
            </p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <Edit2 size={16} /> Edit Settings
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGlobalSave}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT COLUMN: Password Management */}
          <div className="lg:col-span-7 space-y-8">

            <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-opacity duration-300 ${!isEditing ? 'opacity-90' : ''}`}>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <Key size={18} className="text-slate-400" /> Change Password
              </h3>

              <div className="space-y-5 max-w-lg">
                <PasswordInput
                  label="Current Password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  disabled={true}
                  hideToggle={true}
                  placeholder="Not required"
                />

                <div className="pt-2"></div>

                <PasswordInput
                  label="New Password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  disabled={!isEditing}
                />

                {/* Requirements - Only highlight when editing or typing */}
                <div className={`bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700 transition-opacity ${!isEditing ? 'opacity-50 grayscale' : ''}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Requirements</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                    {renderRequirement(validity.length, "10 - 30 characters")}
                    {renderRequirement(validity.upper, "Uppercase letter (A-Z)")}
                    {renderRequirement(validity.lower, "Lowercase letter (a-z)")}
                    {renderRequirement(validity.number, "One number (0-9)")}
                    {renderRequirement(validity.special, "One special character")}
                  </div>
                </div>

                <PasswordInput
                  label="Confirm Password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  disabled={!isEditing}
                />

                {passwords.confirm.length > 0 && !validity.match && isEditing && (
                  <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-left-1">
                    <XCircle size={12} /> Passwords do not match
                  </p>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={initiatePasswordUpdate}
                    disabled={!isEditing || !isFormValid}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Save size={16} /> Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Options */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Session Management</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Log out of all other active sessions across devices.</p>
              </div>
              <button
                onClick={initiateLogout}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 rounded-lg text-sm font-medium transition-colors"
              >
                Log Out All Devices
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Policies & SSO */}
          <div className="lg:col-span-5 space-y-8">

            {/* Security Policies (Global Defaults) */}
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-indigo-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Organization Policies</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Session Timeout</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{SECURITY_POLICIES.sessionTimeout}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Password Expiry</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{SECURITY_POLICIES.passwordExpiry}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Min/Max Length</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
                    {SECURITY_POLICIES.passwordMinLength} - {SECURITY_POLICIES.passwordMaxLength} chars
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm py-2">
                  <span className="text-slate-500 dark:text-slate-400">MFA Enforcement</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${SECURITY_POLICIES.mfaEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-slate-200 text-slate-600'}`}>
                    {SECURITY_POLICIES.mfaEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-3 items-start border border-blue-100 dark:border-blue-800">
                <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  These settings are configured by your Organization Admin. Contact IT support if you need an exception.
                </p>
              </div>
            </div>

            {/* Workspace Sign-In (SSO) */}
            <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-opacity ${!isEditing ? 'opacity-80' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Globe size={18} className="text-blue-500" /> Workspace Sign-in
                </h3>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">SSO</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Connect your corporate account or use passkeys for easier access.
              </p>

              <div className="space-y-3">
                {/* Google */}
                <div className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${ssoStatus.google ? 'bg-slate-50 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-900/30' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      {/* Google G Icon Mock */}
                      <span className="font-bold text-blue-600 text-lg">G</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Google Workspace</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ssoStatus.google ? <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle size={10} /> Connected</span> : 'Not Connected'}
                      </p>
                    </div>
                  </div>
                  <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                    <input type="checkbox" className="sr-only peer" checked={ssoStatus.google} onChange={() => toggleSSO('google')} disabled={!isEditing} />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Microsoft */}
                <div className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${ssoStatus.microsoft ? 'bg-slate-50 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-900/30' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      {/* Microsoft Icon Mock */}
                      <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                        <div className="bg-orange-500 w-1.5 h-1.5"></div>
                        <div className="bg-green-500 w-1.5 h-1.5"></div>
                        <div className="bg-blue-500 w-1.5 h-1.5"></div>
                        <div className="bg-yellow-500 w-1.5 h-1.5"></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Microsoft 365</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ssoStatus.microsoft ? <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle size={10} /> Connected</span> : 'Not Connected'}
                      </p>
                    </div>
                  </div>
                  <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                    <input type="checkbox" className="sr-only peer" checked={ssoStatus.microsoft} onChange={() => toggleSSO('microsoft')} disabled={!isEditing} />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Passkey */}
                <div className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${ssoStatus.passkey ? 'bg-slate-50 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-900/30' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm text-slate-700">
                      <Fingerprint size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Passkey Sign-in</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ssoStatus.passkey ? <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle size={10} /> Enabled (Multi-device)</span> : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {ssoStatus.passkey && (
                      <button
                        onClick={() => setShowPasskeyManager(true)}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Manage Keys
                      </button>
                    )}
                    <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                      <input type="checkbox" className="sr-only peer" checked={ssoStatus.passkey} onChange={() => toggleSSO('passkey')} disabled={!isEditing} />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
