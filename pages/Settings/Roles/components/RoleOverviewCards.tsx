import React, { useMemo } from 'react';
import { Shield, Users } from 'lucide-react';

interface RoleOverviewCardsProps {
    roles: any[];
    userCounts: Record<string, number>;
    onSelectRole: (role: any) => void;
}

const RoleOverviewCards: React.FC<RoleOverviewCardsProps> = ({ roles, userCounts, onSelectRole }) => {

    // Helper to determine color based on role name or level (if available)
    const getColorTheme = (role: any) => {
        const name = (role.name || role.roleName || '').toLowerCase();
        if (name.includes('super') || name.includes('admin')) return 'indigo';
        if (name.includes('recruit')) return 'emerald';
        if (name.includes('hiring') || name.includes('manager')) return 'blue';
        if (name.includes('sourc')) return 'orange';
        if (name.includes('candidate') || name.includes('view')) return 'gray';
        return 'purple';
    };

    const getCardStyle = (color: string) => {
        const baseStyle = "relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden group transition-all cursor-pointer text-left w-full hover:shadow-md hover:border-indigo-300";
        return baseStyle;
    };

    const getBadgeColor = (color: string) => {
        const map: any = {
            indigo: 'bg-indigo-500',
            orange: 'bg-orange-500',
            blue: 'bg-blue-500',
            gray: 'bg-slate-500',
            emerald: 'bg-emerald-500',
            purple: 'bg-purple-500',
        };
        return map[color] || 'bg-blue-500';
    };

    const getPillColor = (color: string) => {
        const map: any = {
            indigo: 'text-indigo-600 bg-indigo-50',
            orange: 'text-orange-600 bg-orange-50',
            blue: 'text-blue-600 bg-blue-50',
            gray: 'text-slate-600 bg-slate-100',
            emerald: 'text-emerald-600 bg-emerald-50',
            purple: 'text-purple-600 bg-purple-50',
        };
        return map[color] || 'text-blue-600 bg-blue-50';
    };

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-100 p-1.5 rounded-md">
                    <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">Role Overview</h3>
                    <p className="text-xs text-gray-500">Active roles in your organization</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {roles.map((role) => {
                    const color = getColorTheme(role);
                    const userCount = userCounts[role._id] || 0;

                    return (
                        <button key={role._id} onClick={() => onSelectRole(role)} className={getCardStyle(color)}>
                            <div className={`absolute top-0 left-0 w-1 h-full ${getBadgeColor(color)}`}></div>

                            <div className="pl-3">
                                <h4 className="font-bold text-gray-900 truncate" title={role.roleName}>{role.roleName}</h4>
                                <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2 min-h-[2.5em]">{role.description || "No description provided"}</p>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center text-xs text-gray-500 gap-1" title={`${userCount} active users`}>
                                        <Users size={12} />
                                        <span className="font-medium">{userCount} users</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${getPillColor(color)}`}>
                                        {role.isSystem ? 'System' : 'Custom'}
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
                {/* Add New Role Mock Card if needed or keep it clean */}
            </div>
        </div>
    );
};

export default RoleOverviewCards;
