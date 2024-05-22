import { HeadlessService } from "@novu/headless";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMe } from "./use-me";
import { IMessage } from "@novu/notification-center";

export function useNotifications() {
  const { me } = useMe();
  const [isLoading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<IMessage[]>([]);
  const headlessServiceRef = useRef<HeadlessService>();

  const markAllMessagesAsRead = () => {
    const headlessService = headlessServiceRef.current;

    if (headlessService) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => {
          return {
            ...notification,
            read: true,
          };
        })
      );

      headlessService.markAllMessagesAsRead({
        listener: () => {},
        onError: () => {},
      });
    }
  };

  const markMessageAsRead = (messageId: string) => {
    const headlessService = headlessServiceRef.current;

    if (headlessService) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => {
          if (notification._id === messageId) {
            return {
              ...notification,
              read: true,
            };
          }

          return notification;
        })
      );

      headlessService.markNotificationsAsRead({
        messageId: [messageId],
        listener: (_result) => {},
        onError: (_error) => {},
      });
    }
  };

  const fetchNotifications = useCallback(() => {
    const headlessService = headlessServiceRef.current;

    if (headlessService) {
      headlessService.fetchNotifications({
        listener: () => {},
        onSuccess: (response) => {
          setLoading(false);
          setNotifications(response.data);
        },
      });
    }
  }, []);

  const markAllMessagesAsSeen = () => {
    const headlessService = headlessServiceRef.current;

    if (headlessService) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          seen: true,
        }))
      );

      headlessService.markAllMessagesAsSeen({
        listener: () => {},
        onError: () => {},
      });
    }
  };

  useEffect(() => {
    const headlessService = headlessServiceRef.current;

    if (headlessService) {
      headlessService.listenNotificationReceive({
        listener: () => {
          fetchNotifications();
        },
      });
    }
  }, [fetchNotifications]);

  useEffect(() => {
    if (me && !headlessServiceRef.current) {
      const headlessService = new HeadlessService({
        applicationIdentifier: import.meta.env.VITE_NOVU_APPLICATION_ID,
        subscriberId: me.id,
      });

      headlessService.initializeSession({
        listener: () => {},
        onSuccess: () => {
          headlessServiceRef.current = headlessService;
          fetchNotifications();
        },
        onError: () => {},
      });
    }
  }, [fetchNotifications, me]);

  return {
    isLoading,
    markAllMessagesAsRead,
    markMessageAsRead,
    markAllMessagesAsSeen,
    hasUnseenNotificaitons: notifications.some(
      (notification) => !notification.seen
    ),
    notifications,
  };
}
