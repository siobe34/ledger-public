export interface INotificationGroup {
    notifications: NotificationType[];
}

export interface INotificationItem {
    notificationItem: NotificationType;
    removeNotificationItem: (item: NotificationType) => void;
}

export type NotificationType = {
    key: string;
    type: "info" | "success" | "error";
    description: string;
};
