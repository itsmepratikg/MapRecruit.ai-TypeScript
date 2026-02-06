import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell, MessageCircle, Monitor, XCircle, CheckCircle,
  Moon, Zap, AlertCircle, ChevronDown, ChevronUp, Info,
  Edit2, Save, Globe, LogOut
} from '../../components/Icons';
import { integrationService, WorkspaceIntegrations } from '../../services/integrationService';
import { useToast } from '../../components/Toast';

interface IntegrationCardProps {
  name: string;
  icon: React.ReactNode;
  status: { connected: boolean; email?: string };
  onConnect: () => void;
  onDisconnect: () => void;
  disabled?: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ name, icon, status, onConnect, onDisconnect, disabled }) => {
  return (
    <div className={`p-4 rounded-xl border transition-all ${status.connected ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${status.connected ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
            {icon}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{name}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {status.connected ? `Connected as ${status.email}` : 'Not connected'}
            </p>
          </div>
        </div>

        {status.connected ? (
          <button
            onClick={onDisconnect}
            disabled={disabled}
            className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="Disconnect"
          >
            <XCircle size={18} />
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={disabled}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

// --- Constants & Schema ---

const NOTIFICATION_MODES = [
  { id: 'ALL', label: 'All Channels', icon: Zap, color: 'text-amber-500' },
  { id: 'CHAT', label: 'In Chat Only', icon: MessageCircle, color: 'text-indigo-500' },
  { id: 'APP', label: 'In App Only', icon: Monitor, color: 'text-blue-500' },
  { id: 'NONE', label: 'None', icon: XCircle, color: 'text-slate-400' }
];

const NOTIFICATION_SCHEMA = [
  {
    id: 'INTERVIEWS',
    label: 'Interviews & Scheduling',
    description: 'Updates regarding candidate interview logistics and status changes.',
    items: [
      { id: 'int_reminder_person', label: 'In-person Interview Reminder' },
      { id: 'int_completed', label: 'Interview Completed' },
      { id: 'slot_booked', label: 'Slot Booked' },
      { id: 'slot_cancelled', label: 'Slot Cancelled' },
      { id: 'slot_rescheduled', label: 'Slot Rescheduled' },
      { id: 'resched_new_host', label: 'Rescheduled to New Host' },
      { id: 'slot_booked_no_camp', label: 'Slot Booked without Campaign' },
      { id: 'int_reminder_video', label: 'Video Interview Reminder' },
      { id: 'int_reminder_phone', label: 'Phone Interview Reminder' }
    ]
  },
  {
    id: 'SOURCE_AI',
    label: 'Source AI',
    description: 'Alerts related to sourcing engine activities and integrations.',
    items: [
      { id: 'job_board_search', label: 'JobBoards Search Executed' }
    ]
  },
  {
    id: 'CAMPAIGNS',
    label: 'Campaign Management',
    description: 'Notifications about campaign health, capacity, and member activity.',
    items: [
      { id: 'camp_user_added', label: 'User added to Campaign' },
      { id: 'camp_slots_expiring', label: 'Campaign Slots expiring soon' },
      { id: 'camp_slots_exhausted', label: 'Campaign Slots Exhausted' },
      { id: 'camp_closed', label: 'Campaign Closed' },
      { id: 'camp_created', label: 'Campaign Created' },
      { id: 'camp_link', label: 'Link Campaign' },
      { id: 'camp_folder_link', label: 'Link Campaign Folder' },
      { id: 'camp_unlink', label: 'Unlinked from Campaign' }
    ]
  },
  {
    id: 'PROFILES',
    label: 'Profiles & Candidates',
    description: 'Updates on candidate data parsing and sharing.',
    items: [
      { id: 'prof_uploaded', label: 'Profiles Uploaded' },
      { id: 'resume_parsed', label: 'Resumes Parsed' },
      { id: 'prof_shared', label: 'Profile Shared' }
    ]
  },
  {
    id: 'FOLDERS',
    label: 'Folder Organization',
    description: 'Activity related to candidate folders and grouping.',
    items: [
      { id: 'folder_shared', label: 'Folder Shared' },
      { id: 'folder_linked', label: 'Link Folder' },
      { id: 'folder_unlinked', label: 'Unlinked from Campaign Folder' }
    ]
  }
];

// --- Sub-Components ---

interface NotificationRowProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const NotificationRow: React.FC<NotificationRowProps> = ({ label, value, onChange, disabled }) => {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 px-3 rounded-lg transition-colors ${disabled ? 'opacity-70' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{label}</span>

      <div className={`flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 gap-1 ${disabled ? 'pointer-events-none' : ''}`}>
        {NOTIFICATION_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = value === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onChange(mode.id)}
              disabled={disabled}
              className={`p-1.5 rounded-md transition-all relative group ${isActive ? 'bg-white dark:bg-slate-700 shadow-sm' : disabled ? '' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
              title={mode.label}
            >
              <Icon size={16} className={isActive ? mode.color : 'text-slate-400'} />
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] bg-slate-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-10">
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface CategorySectionProps {
  category: typeof NOTIFICATION_SCHEMA[0];
  settings: Record<string, string>;
  onUpdate: (id: string, val: string) => void;
  disabled?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, settings, onUpdate, disabled }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all h-full flex flex-col">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors shrink-0"
      >
        <div className="text-left">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{category.label}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{category.description}</p>
        </div>
        <div className="text-slate-400">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-1 flex-1">
          {category.items.map(item => (
            <NotificationRow
              key={item.id}
              label={item.label}
              value={settings[item.id] || 'APP'} // Default to In-App if not set
              onChange={(val) => onUpdate(item.id, val)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const UserNotifications = () => {
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [dnd, setDnd] = useState(false);
  const [integrations, setIntegrations] = useState<WorkspaceIntegrations>({
    google: { connected: false },
    microsoft: { connected: false }
  });

  // Load integration status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      const status = await integrationService.getStatus();
      setIntegrations(status);
    };
    fetchStatus();
  }, []);

  const handleConnectGoogle = () => {
    integrationService.connectGoogle();
  };

  const handleConnectMicrosoft = () => {
    addToast("MS Teams integration coming soon!", "info");
  };

  const handleDisconnect = async (provider: 'google' | 'microsoft') => {
    try {
      await integrationService.disconnect(provider);
      setIntegrations(prev => ({
        ...prev,
        [provider]: { connected: false }
      }));
      addToast(`${provider === 'google' ? 'Google' : 'Microsoft'} disconnected`, "success");
    } catch (err) {
      addToast("Failed to disconnect", "error");
    }
  };

  // State for all individual settings
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Backup state for cancel
  const [originalDnd, setOriginalDnd] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<Record<string, string>>({});

  const handleEdit = () => {
    setOriginalDnd(dnd);
    setOriginalSettings({ ...settings });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDnd(originalDnd);
    setSettings(originalSettings);
    setIsEditing(false);
    addToast("Changes discarded", "info");
  };

  const handleUpdateSetting = (id: string, val: string) => {
    setSettings(prev => ({ ...prev, [id]: val }));
  };

  const handleSave = () => {
    console.log("Saving Notification Preferences:", { dnd, settings });
    addToast("Notification preferences updated successfully", "success");
    setIsEditing(false);
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-300 pb-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Bell size={22} className="text-emerald-500" /> User Notifications
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Control how and where you receive alerts, updates, and system messages.
            </p>
          </div>

          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={handleEdit}
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
                  onClick={handleSave}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-8">

          {/* Legend / Info Note - Moved to Top */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-start gap-3">
            <Info size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              <strong>Note:</strong> "All Channels" includes Email, SMS (if enabled), Workspace Chat (Teams/Slack), and In-App notifications. "In Chat Only" suppresses email and in-app toasts.
            </p>
          </div>

          {/* Do Not Disturb */}
          <div className={`p-6 rounded-xl border transition-all ${dnd ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${dnd ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                  <Moon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Do Not Disturb</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Pause all toast notifications and popups. Urgent alerts will still appear in the Notification Center.
                  </p>
                </div>
              </div>
              <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={dnd}
                  onChange={(e) => isEditing && setDnd(e.target.checked)}
                  disabled={!isEditing}
                />
                <div className="w-14 h-7 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Workspace Integrations */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 px-1">
              <Globe size={18} className="text-indigo-500" /> Workspace Integrations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IntegrationCard
                name="Google Chat & Drive"
                icon={<span className="font-bold text-lg">G</span>}
                status={integrations.google}
                onConnect={handleConnectGoogle}
                onDisconnect={() => handleDisconnect('google')}
                disabled={!isEditing}
              />
              <IntegrationCard
                name="Microsoft Teams"
                icon={<div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <div className="bg-orange-500 w-1.5 h-1.5"></div>
                  <div className="bg-green-500 w-1.5 h-1.5"></div>
                  <div className="bg-blue-500 w-1.5 h-1.5"></div>
                  <div className="bg-yellow-500 w-1.5 h-1.5"></div>
                </div>}
                status={integrations.microsoft}
                onConnect={handleConnectMicrosoft}
                onDisconnect={() => handleDisconnect('microsoft')}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Granular Settings */}
          <div className={dnd ? 'opacity-50 pointer-events-none filter grayscale transition-all duration-300' : 'transition-all duration-300'}>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 px-2">
              {NOTIFICATION_MODES.map(mode => (
                <div key={mode.id} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <mode.icon size={14} className={mode.color} />
                  <span>{mode.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {NOTIFICATION_SCHEMA.map(cat => (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  settings={settings}
                  onUpdate={handleUpdateSetting}
                  disabled={!isEditing}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
