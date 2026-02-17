import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Determine Socket URL (strip /api if present)
const getSocketUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return apiUrl.includes('/api') ? apiUrl.replace('/api', '') : apiUrl;
};

export interface UserPresence {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
    color: string;
    campaignId?: string; // Current room
    page?: string;      // Specific page/tab within campaign
    lastActive?: number;
    status?: 'active' | 'idle';
    role?: string;
    location?: string;
}

interface WebSocketContextType {
    socket: Socket | null;
    activeUsers: Map<string, UserPresence>;
    isConnected: boolean;
    joinRoom: (campaignId: string, user: Omit<UserPresence, 'lastActive' | 'campaignId' | 'status'>, page?: string) => void;
    leaveRoom: (campaignId: string, userId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [activeUsers, setActiveUsers] = useState<Map<string, UserPresence>>(new Map());
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(getSocketUrl(), {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketInstance.on('connect', () => {
            console.log('WebSocket Connected:', socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
            setActiveUsers(new Map()); // Clear on disconnect
        });

        // 1. Initial Sync (Full list for the room)
        socketInstance.on('room-sync', (users: UserPresence[]) => {
            console.log('[WebSocketContext] Syncing room users:', users.length);
            setActiveUsers(prev => {
                const next = new Map();
                users.forEach(u => next.set(u.id, u));
                return next;
            });
        });

        // 2. Granular Join
        socketInstance.on('user-joined', (user: UserPresence) => {
            console.log('[WebSocketContext] User joined:', user.firstName);
            setActiveUsers(prev => {
                const next = new Map(prev);
                next.set(user.id, user);
                return next;
            });
        });

        // 3. Granular Leave
        socketInstance.on('user-left', (data: { userId: string, socketId: string }) => {
            console.log('[WebSocketContext] User left:', data.userId);
            setActiveUsers(prev => {
                const next = new Map(prev);
                next.delete(data.userId);
                return next;
            });
        });

        // 4. Granular Update (Status/Page)
        socketInstance.on('user-updated', (data: Partial<UserPresence> & { userId: string }) => {
            console.log('[WebSocketContext] User updated:', data.userId, data.status || data.page);
            setActiveUsers(prev => {
                const existing = prev.get(data.userId);
                if (!existing) return prev;
                const next = new Map(prev);
                next.set(data.userId, { ...existing, ...data });
                return next;
            });
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const joinRoom = useCallback((campaignId: string, user: Omit<UserPresence, 'lastActive' | 'campaignId' | 'status'>, page?: string) => {
        if (socket) {
            socket.emit('join-page', { campaignId, user: { ...user, page } });
        }
    }, [socket]);

    const leaveRoom = useCallback((campaignId: string, userId: string) => {
        if (socket) {
            socket.emit('leave-page', { campaignId, userId });
        }
    }, [socket]);

    return (
        <WebSocketContext.Provider value={{ socket, activeUsers, isConnected, joinRoom, leaveRoom }}>
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
