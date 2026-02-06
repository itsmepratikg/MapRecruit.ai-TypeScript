import React from 'react';
import {
  User, MessageSquare, SlidersHorizontal, Calendar,
  Shield, Lock, Clock, Activity
} from '../../components/Icons';
import { AccountPlaceholder } from './components/AccountPlaceholder';
import { Appearance } from './Appearance';
import { BasicDetails } from './BasicDetails';
import { Communication } from './Communication';
import { CalendarSettings } from './CalendarSettings';
import { CalendarWrapper } from './CalendarWrapper';
import { RolesPermissions } from './RolesPermissions';
import { AuthSync } from './AuthSync';
import { UserNotifications } from './UserNotifications';
import { LoginSessions } from './LoginSessions';
import { PasskeySettings } from './PasskeySettings';
import { Routes, Route, Navigate } from 'react-router-dom';

interface MyAccountProps {
  activeTab: string; // Legacy, ignored in favor of routes
  userOverride?: any;
}

export const MyAccount = ({ userOverride }: MyAccountProps) => {

  const getPath = (id: string) => {
    const map: Record<string, string> = {
      'BASIC_DETAILS': 'basicdetails',
      'COMM_PREFS': 'communication',
      'USER_PREFS': 'appearance',
      'CALENDAR': 'calendar',
      'ROLES_PERMISSIONS': 'rolepermissions',
      'AUTH_SYNC': 'authsync',
      'USER_NOTIFICATIONS': 'usernotifications',
      'SECURITY': 'security',
      'LAST_LOGIN': 'loginsessions'
    };
    if (map[id]) return map[id];
    return id.split('_').map(w => w.charAt(0).toLowerCase() + w.slice(1).toLowerCase()).join('');
  }

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Routes>
          <Route path="/" element={<Navigate to="basicdetails" replace />} />
          <Route path="basicdetails" element={<BasicDetails userOverride={userOverride} />} />
          <Route path="communication" element={<Communication />} />
          <Route path="appearance" element={<Appearance />} />
          <Route path="calendar/*" element={<CalendarWrapper />} />
          <Route path="rolepermissions" element={<RolesPermissions />} />
          <Route path="authsync" element={<AuthSync />} />
          <Route path="usernotifications" element={<UserNotifications />} />
          <Route path="security" element={<PasskeySettings />} />
          <Route path="loginsessions" element={<LoginSessions />} />
          {/* Prevent recursive loops by redirecting to the base absolute path if no match */}
          <Route path="*" element={<Navigate to="/myaccount/basicdetails" replace />} />
        </Routes>
      </div>
    </div>
  );
};
