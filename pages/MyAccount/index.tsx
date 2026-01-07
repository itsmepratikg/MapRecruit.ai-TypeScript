
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

interface MyAccountProps {
  activeTab: string;
}

export const MyAccount = ({ activeTab }: MyAccountProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'BASIC_DETAILS':
        return <BasicDetails />;
      case 'COMM_PREFS':
        return <Communication />;
      case 'USER_PREFS':
        return <Appearance />;
      case 'CALENDAR':
        return <CalendarSettings />;
      case 'ROLES_PERMISSIONS':
        return <RolesPermissions />;
      case 'AUTH_SYNC':
        return <AuthSync />;
      case 'LAST_LOGIN':
        return <div className="p-8 lg:p-12"><AccountPlaceholder title="Last Login Sessions" description="Review your recent login activity, IP addresses, and device history for security." icon={Clock} /></div>;
      default:
        return <div className="p-8 lg:p-12"><AccountPlaceholder title="My Account" description="Select a category from the sidebar to manage your account settings." icon={User} /></div>;
    }
  };

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto">
         {renderContent()}
      </div>
    </div>
  );
};
