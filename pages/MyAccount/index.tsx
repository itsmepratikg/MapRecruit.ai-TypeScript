
import React from 'react';
import { 
  User, MessageSquare, SlidersHorizontal, Calendar, 
  Shield, Lock, Clock, Activity 
} from '../../components/Icons';
import { AccountPlaceholder } from './components/AccountPlaceholder';
import { Appearance } from './Appearance';
import { BasicDetails } from './BasicDetails';

interface MyAccountProps {
  activeTab: string;
}

export const MyAccount = ({ activeTab }: MyAccountProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'BASIC_DETAILS':
        return <BasicDetails />;
      case 'COMM_PREFS':
        return <AccountPlaceholder title="Communication" description="Configure how and when you want to be notified via Email and SMS." icon={MessageSquare} />;
      case 'USER_PREFS':
        return <Appearance />;
      case 'CALENDAR':
        return <AccountPlaceholder title="Calendar Settings" description="Sync your external calendars and manage availability slots for interviews." icon={Calendar} />;
      case 'ROLES_PERMISSIONS':
        return <AccountPlaceholder title="Roles & Permissions" description="View your assigned roles and specific access rights within the platform." icon={Shield} />;
      case 'AUTH_SYNC':
        return <AccountPlaceholder title="Password & Authentication" description="Manage 2FA, password changes, and connected third-party accounts." icon={Lock} />;
      case 'LAST_LOGIN':
        return <AccountPlaceholder title="Last Login Sessions" description="Review your recent login activity, IP addresses, and device history for security." icon={Clock} />;
      default:
        return <AccountPlaceholder title="My Account" description="Select a category from the sidebar to manage your account settings." icon={User} />;
    }
  };

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
         {renderContent()}
      </div>
    </div>
  );
};
