import React, { memo } from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import { COLORS } from '../../data/profile';
import { Mail, MessageCircle, MapPin, Briefcase } from '../Icons';
import { useUserContext } from '../../context/UserContext';

interface CoPresenceAvatarsProps {
    campaignId: string;
    currentUserId: string;
}

const AvatarItem = memo(({ user, isMe }: { user: any, isMe: boolean }) => {
    const userColorObj = COLORS.find(c => c.name === user.color) || COLORS[0];
    const [isHovered, setIsHovered] = React.useState(false);
    const { userProfile } = useUserContext();

    const isGoogleConnected = userProfile?.integrations?.google?.connected;
    const isMicrosoftConnected = userProfile?.integrations?.microsoft?.connected;

    const handleChatClick = (type: 'google' | 'teams') => {
        if (type === 'google' && isGoogleConnected) {
            window.open(`https://mail.google.com/chat/u/0/#chat/dm/${user.email}`, '_blank');
        } else if (type === 'teams' && isMicrosoftConnected) {
            window.open(`https://teams.microsoft.com/l/chat/0/0?users=${user.email}`, '_blank');
        }
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`relative inline-block w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm ${!user.avatar ? userColorObj.class : 'bg-slate-200'} transition-all duration-200 hover:z-20 hover:scale-110 cursor-default`}
            >
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.firstName}
                        className="w-full h-full object-cover rounded-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-700">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                )}
                {/* Status Dot */}
                <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-800 ${user.status === 'idle' ? 'bg-amber-400' : 'bg-green-400'}`} />
            </div>

            {/* Rich Tooltip */}
            {isHovered && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-3">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${!user.avatar ? userColorObj.class : 'bg-slate-100'} border border-slate-200 dark:border-slate-700`}>
                                {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                    {user.firstName} {user.lastName} {isMe && '(You)'}
                                </div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'idle' ? 'bg-amber-400' : 'bg-green-400'}`}></span>
                                    {user.status === 'idle' ? 'Idle' : 'Active Now'}
                                </div>
                            </div>
                        </div>

                        {/* Snippet Info */}
                        <div className="space-y-1.5 py-2 border-y border-slate-100 dark:border-slate-700/50">
                            {user.role && (
                                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                    <Briefcase size={12} className="text-slate-400" />
                                    {user.role}
                                </div>
                            )}
                            {user.location && (
                                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                    <MapPin size={12} className="text-slate-400" />
                                    {user.location}
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                <Mail size={12} className="text-slate-400" />
                                <span className="truncate">{user.email}</span>
                            </div>
                        </div>

                        {/* Chat Options */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quick Connect</span>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleChatClick('google')}
                                    disabled={!isGoogleConnected}
                                    className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${isGoogleConnected ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'}`}
                                    title={!isGoogleConnected ? "Connect Google Workspace in Settings to enable" : "Chat on Google Chat"}
                                >
                                    <img src="https://www.gstatic.com/images/branding/product/1x/chat_24dp.png" className={`w-4 h-4 ${!isGoogleConnected && 'grayscale'}`} alt="" />
                                    Google
                                </button>
                                <button
                                    onClick={() => handleChatClick('teams')}
                                    disabled={!isMicrosoftConnected}
                                    className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${isMicrosoftConnected ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400' : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'}`}
                                    title={!isMicrosoftConnected ? "Connect Microsoft Workspace in Settings to enable" : "Chat on MS Teams"}
                                >
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg" className={`w-4 h-4 ${!isMicrosoftConnected && 'grayscale'}`} alt="" />
                                    Teams
                                </button>
                            </div>
                            {!isGoogleConnected && !isMicrosoftConnected && (
                                <p className="text-[9px] text-slate-400 italic text-center">Workspace not connected</p>
                            )}
                        </div>
                    </div>
                    {/* Arrow (Pointing Up) */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white dark:border-b-slate-800" />
                </div>
            )}
        </div>
    );
});

export const CoPresenceAvatars = ({ campaignId, currentUserId }: CoPresenceAvatarsProps) => {
    const { activeUsers } = useWebSocket();

    // Filter users in this campaign AND exclude self
    const otherUsersInRoom = React.useMemo(() => {
        return Array.from(activeUsers.values()).filter(u => {
            const isMe = String(u.id) === String(currentUserId);
            const inRoom = String(u.campaignId) === String(campaignId);
            return inRoom && !isMe;
        });
    }, [activeUsers, campaignId, currentUserId]);

    if (otherUsersInRoom.length === 0) return null;

    return (
        <div className="flex items-center -space-x-2 py-1 px-1">
            {otherUsersInRoom.map((user) => (
                <AvatarItem key={user.id} user={user} isMe={false} />
            ))}
        </div>
    );
};
