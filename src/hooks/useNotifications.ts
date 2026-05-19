import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { markAsRead as markAsReadApi } from "../api/notificationService";

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const socket = new SockJS("http://localhost:8080/ws");

    const stompClient = new Client({
      webSocketFactory: () => socket as unknown as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      debug: () => {},
    });

    stompClient.onConnect = () => {
      stompClient.subscribe("/user/notifications", (msg: { body: string }) => {
        const notification: Notification = JSON.parse(msg.body);
        setNotifications((prev) => [notification, ...(prev ?? [])]);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const markAsRead = async (id: string) => {
    await markAsReadApi(id);
    setNotifications((prev) =>
      (prev ?? []).map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  return { notifications, markAsRead };
};
