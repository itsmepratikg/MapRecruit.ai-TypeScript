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
import { RolesPermissions } from './RolesPermissions';
import { AuthSync } from './AuthSync';
import { UserNotifications } from './UserNotifications';
import { Routes, Route, Navigate } from 'react-router-dom';

interface MyAccountProps {
  activeTab: string; // Legacy, ignored in favor of routes
  userOverride?: any;
}

export const MyAccount = ({ userOverride }: MyAccountProps) => {

  const getPath = (id: string) => {
    const map: Record<string, string> = {
      'BASIC_DETAILS': 'BasicDetails',
      'COMM_PREFS': 'Communication',
      'USER_PREFS': 'Appearance',
      'CALENDAR': 'Calendar',
      'ROLES_PERMISSIONS': 'RolesPermissions',
      'AUTH_SYNC': 'AuthSync',
      'USER_NOTIFICATIONS': 'UserNotifications',
      'LAST_LOGIN': 'LastLogin'
    };
    if (map[id]) return map[id];
    return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  }

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Routes>
          <Route path="/" element={<Navigate to={getPath('BASIC_DETAILS')} replace />} />
          <Route path={getPath('BASIC_DETAILS')} element={<BasicDetails userOverride={userOverride} />} />
          <Route path={getPath('COMM_PREFS')} element={<Communication />} />
          <Route path={getPath('USER_PREFS')} element={<Appearance />} />
          <Route path={getPath('CALENDAR')} element={<CalendarSettings />} />
          <Route path={getPath('ROLES_PERMISSIONS')} element={<RolesPermissions />} />
          <Route path={getPath('AUTH_SYNC')} element={<AuthSync />} />
          <Route path={getPath('USER_NOTIFICATIONS')} element={<UserNotifications />} />
          <Route path={getPath('LAST_LOGIN')} element={<div className="p-8 lg:p-12"><AccountPlaceholder title="Last Login Sessions" description={`Review recent login activity for ${userOverride ? userOverride.name : 'your account'}.`} icon={Clock} /></div>} />
          <Route path="*" element={<Navigate to={getPath('BASIC_DETAILS')} replace />} />
        </Routes>
      </div>
    </div>
  );
};
