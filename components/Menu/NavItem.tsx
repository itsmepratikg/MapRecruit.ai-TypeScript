import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  view?: string;
  icon: any;
  label: string;
  activeTab?: boolean;
  onClick?: () => void;
  activeView?: string;
  isCollapsed: boolean;
  noHighlight?: boolean;
  to?: string;
  [key: string]: any;
}

export const NavItem: React.FC<NavItemProps> = ({
  view,
  icon: Icon,
  label,
  activeTab,
  onClick,
  activeView,
  isCollapsed,
  noHighlight,
  to,
  ...rest
}) => {
  const baseClass = `w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${isCollapsed ? 'justify-center' : ''}`;
  const activeClass = 'bg-emerald-100 text-emerald-900 font-bold shadow-sm';
  const inactiveClass = 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200';

  if (to) {
    return (
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) => `${baseClass} ${!noHighlight && (isActive || activeTab) ? activeClass : inactiveClass}`}
        title={isCollapsed ? label : ''}
        {...rest}
      >
        {({ isActive }) => (
          <>
            <Icon size={20} className={!noHighlight && (isActive || activeTab) ? 'text-emerald-700' : 'text-slate-400 dark:text-slate-500'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>{label}</span>
          </>
        )}
      </NavLink>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${!noHighlight && ((view && activeView === view) || activeTab) ? activeClass : inactiveClass}`}
      title={isCollapsed ? label : ''}
      {...rest}
    >
      <Icon size={20} className={!noHighlight && ((view && activeView === view) || activeTab) ? 'text-emerald-700' : 'text-slate-400 dark:text-slate-500'} />
      <span className={isCollapsed ? 'hidden' : 'block'}>{label}</span>
    </button>
  );
};
