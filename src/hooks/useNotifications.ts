import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  getNotifications,
  markAsRead as markAsReadApi,
} from "../api/notificationService";

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
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const load = async () => {
      try {
        const res = await getNotifications();
        const api: Notification[] = res.content ?? [];

        setNotifications((prev) => {
          const merged = [
            ...api.filter((a) => !prev.some((p) => p.id === a.id)),
            ...prev,
          ];
          return merged;
        });
      } catch (e) {
        console.error("Polling error:", e);
      }
    };

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const WS_URL = import.meta.env.PROD
      ? "https://wydatkomat.tech/api/ws"
      : "http://localhost:8080/api/ws";

    const socket = new SockJS(WS_URL);

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
        setNotifications((prev) => [notification, ...prev]);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const markAsRead = async (id: string) => {
    await markAsReadApi(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, markAsRead };
};
