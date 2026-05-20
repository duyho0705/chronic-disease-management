import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useToast } from '../components/ui/ToastContext';

interface WebSocketContextType {
    isConnected: boolean;
    lastMessage: any;
    lastNotification: any;
}

const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
    lastMessage: null,
    lastNotification: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);
    const [lastNotification, setLastNotification] = useState<any>(null);
    const clientRef = useRef<Client | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket Connected');
                setIsConnected(true);

                // Subscribe to notifications
                client.subscribe('/user/queue/notifications', (message) => {
                    if (message.body) {
                        const notification = JSON.parse(message.body);
                        setLastNotification(notification);
                        showToast(notification.title, 'info');
                    }
                });

                // Subscribe to chat messages
                client.subscribe('/user/queue/messages', (message) => {
                    if (message.body) {
                        const chatMessage = JSON.parse(message.body);
                        setLastMessage(chatMessage);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
            },
            onWebSocketClose: () => {
                setIsConnected(false);
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [showToast]);

    return (
        <WebSocketContext.Provider value={{ isConnected, lastMessage, lastNotification }}>
            {children}
        </WebSocketContext.Provider>
    );
};
