
import React, { useMemo } from 'react';

// Using a simplified user interface for the selector
interface User {
    id: string;
    name?: string;
    email?: string; // Used for display or secondary info
    avatar?: string;
}

export interface TeamsState {
    ownerID: string[];
    managerID: string[];
    recruiterID: string[];
}

interface TeamSelectorProps {
    teams: TeamsState;
    onChange: (teams: TeamsState) => void;
    users: User[];
    currentUserID: string;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ teams, onChange, users, currentUserID }) => {

    // Helper to handle selection toggling
    const handleToggle = (role: keyof TeamsState, userId: string) => {
        const currentIds = teams[role];
        const newIds = currentIds.includes(userId)
            ? currentIds.filter(id => id !== userId)
            : [...currentIds, userId];

        onChange({
            ...teams,
            [role]: newIds
        });
    };

    // Helper to check if a user is disabled for a specific role (mutual exclusion)
    const isDisabled = (role: keyof TeamsState, userId: string) => {
        // Collect all IDs selected in OTHER roles
        const otherRoles = (Object.keys(teams) as Array<keyof TeamsState>)
            .filter(r => r !== role);

        // Check if user is in any other role array
        return otherRoles.some(r => teams[r].includes(userId));
    };

    // Render a user list/dropdown for a specific role
    const renderUserList = (role: keyof TeamsState, label: string) => {
        return (
            <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-md p-2 bg-white dark:bg-slate-800">
                    {users.map(user => {
                        const isSelected = teams[role].includes(user.id);
                        const disabled = isDisabled(role, user.id);
                        const isMe = user.id === currentUserID;

                        return (
                            <div
                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors
                  ${disabled ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}
                  ${isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 border' : 'border border-transparent'}
                `}
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center
                  ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 dark:border-slate-600'}
                `}>
                                    {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>

                                <div className="flex items-center gap-2 overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} className="w-6 h-6 rounded-full" alt={user.name || 'User'} />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300">
                                            {(user.name || user.email || '?').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex flex-col truncate">
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                            {user.name || user.email || 'Unknown User'} {isMe && <span className="text-xs text-emerald-500">(You)</span>}
                                        </span>
                                        <span className="text-xs text-slate-400 truncate">{user.email || ''}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderUserList('ownerID', 'Owners')}
                {renderUserList('managerID', 'Hiring Managers')}
                {renderUserList('recruiterID', 'Recruiters')}
            </div>
            <p className="text-xs text-slate-500 italic">
                * A user can only be assigned to one role per campaign.
            </p>
        </div>
    );
};

export default TeamSelector;
