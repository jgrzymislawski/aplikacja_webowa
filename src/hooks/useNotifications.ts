import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getNotifications, markAsRead as markAsReadApi } from "../api/notificationService";

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

  // 🔥 Blokada podwójnego uruchamiania w React 18
  const initialized = useRef(false);

  // POLLING
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const load = async () => {
      try {
        const res = await getNotifications();
        const api: Notification[] = res.content ?? [];

        setNotifications((prev: Notification[]) => {
          // scal API + WebSocket
          const merged = [
            ...api.filter((a: Notification) => !prev.some((p: Notification) => p.id === a.id)),
            ...prev
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

  // WEBSOCKET
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const socket = new SockJS("http://localhost:8080/api/ws");

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

        setNotifications((prev: Notification[]) => [
          notification,
          ...prev
        ]);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  // MARK AS READ
  const markAsRead = async (id: string) => {
    await markAsReadApi(id);

    setNotifications((prev: Notification[]) =>
      prev.filter((n: Notification) => n.id !== id)
    );
  };

  return { notifications, markAsRead };
};
