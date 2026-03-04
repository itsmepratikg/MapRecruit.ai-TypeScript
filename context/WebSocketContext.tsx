import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';

export interface UserPresence {
    id: string;
    _id?: string; // Support both formats
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
    color: string;
    campaignId?: string; // Current room
    page?: string;      // Specific page/tab within campaign
    lastActive?: string | number;
    status?: 'active' | 'idle';
    role?: string;
    location?: string;
}

interface WebSocketContextType {
    socket: any | null; // Kept for type compatibility, but set to null
    activeUsers: Map<string, UserPresence>;
    isConnected: boolean;
    joinRoom: (campaignId: string, user: Omit<UserPresence, 'lastActive' | 'campaignId' | 'status'>, page?: string) => void;
    leaveRoom: (campaignId: string, userId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [activeUsers, setActiveUsers] = useState<Map<string, UserPresence>>(new Map());
    const [isConnected, setIsConnected] = useState(true); // Always true for HTTP approach

    // State to track current room and user for heartbeats
    const [currentRoom, setCurrentRoom] = useState<{
        campaignId: string;
        user: Omit<UserPresence, 'lastActive' | 'campaignId' | 'status'>;
        page?: string;
    } | null>(null);

    const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

    const performHeartbeat = useCallback(async () => {
        if (!currentRoom) return;

        try {
            const { presenceService } = await import('../services/api');
            const responseData = await presenceService.heartbeat({
                userId: currentRoom.user.id || (currentRoom.user as any)._id,
                campaignId: currentRoom.campaignId,
                user: currentRoom.user,
                page: currentRoom.page
            });

            const users: UserPresence[] = responseData;
            const next = new Map<string, UserPresence>();
            users.forEach(u => {
                const uid = (u as any).userId || u.id || (u as any)._id;
                next.set(uid, { ...u, id: uid });
            });
            setActiveUsers(next);
        } catch (error) {
            console.error('[Presence] Heartbeat failed:', error);
        }
    }, [currentRoom]);

    // Handle heartbeat cycle
    useEffect(() => {
        if (!currentRoom) {
            setActiveUsers(new Map());
            if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
            return;
        }

        // Initial heartbeat
        performHeartbeat();

        // Setup 20-second interval
        heartbeatTimerRef.current = setInterval(performHeartbeat, 20000);

        return () => {
            if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
        };
    }, [currentRoom, performHeartbeat]);

    const joinRoom = useCallback((campaignId: string, user: Omit<UserPresence, 'lastActive' | 'campaignId' | 'status'>, page?: string) => {
        console.log(`[Presence] Joining campaign ${campaignId} at page ${page}`);
        setCurrentRoom({ campaignId, user: { ...user, id: user.id || (user as any)._id }, page });
    }, []);

    const leaveRoom = useCallback(async (campaignId: string, userId: string) => {
        console.log(`[Presence] Leaving campaign ${campaignId}`);
        setCurrentRoom(null);
        try {
            const { presenceService } = await import('../services/api');
            await presenceService.leave({ userId, campaignId });
        } catch (error) {
            console.error('[Presence] Leave failed:', error);
        }
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket: null, activeUsers, isConnected, joinRoom, leaveRoom }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

