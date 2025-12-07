export interface Reminder {
    id: string;
    time: string; // "HH:MM" format (24h)
    message: string;
    enabled: boolean;
}

const STORAGE_KEY = 'silver_care_reminders';

export const getReminders = (): Reminder[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveReminders = (reminders: Reminder[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
};

export const addReminder = (time: string, message: string) => {
    const reminders = getReminders();
    const newReminder: Reminder = {
        id: Date.now().toString(),
        time,
        message,
        enabled: true,
    };
    saveReminders([...reminders, newReminder]);
    return newReminder;
};

export const deleteReminder = (id: string) => {
    const reminders = getReminders();
    saveReminders(reminders.filter(r => r.id !== id));
};

export const toggleReminder = (id: string) => {
    const reminders = getReminders();
    const updated = reminders.map(r =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    saveReminders(updated);
};
