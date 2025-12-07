'use client';

import { useEffect } from 'react';
import { getReminders } from '@/services/reminder';

export default function ReminderManager() {
    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const currentHours = now.getHours().toString().padStart(2, '0');
            const currentMinutes = now.getMinutes().toString().padStart(2, '0');
            const currentTime = `${currentHours}:${currentMinutes}`;

            const reminders = getReminders();

            reminders.forEach(reminder => {
                if (reminder.enabled && reminder.time === currentTime) {
                    // Check if we already triggered this reminder this minute (simple debounce)
                    // For MVP, we'll just use a simple alert or console log.
                    // In real app, we would track "lastTriggered" to avoid multiple alerts in same minute.

                    // To prevent spamming every second of the minute, we can store a session flag
                    const key = `triggered_${reminder.id}_${currentTime}`;
                    if (!sessionStorage.getItem(key)) {
                        // Trigger Reminder
                        playReminder(reminder.message);
                        sessionStorage.setItem(key, 'true');
                    }
                }
            });
        };

        const interval = setInterval(checkReminders, 1000); // Check every second
        return () => clearInterval(interval);
    }, []);

    const playReminder = async (message: string) => {
        try {
            // Use parent's voice for reminders (parent speaks to themselves)
            // If parent voice not available, try child's voice
            const { textToSpeech } = await import('@/services/ai');
            const { getActiveVoiceModelId } = await import('@/services/voice');
            
            const parentVoiceId = getActiveVoiceModelId('parent');
            const role: 'parent' | 'child' = parentVoiceId ? 'parent' : 'child';
            
            const audioUrl = await textToSpeech(message, role);
            
            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.play().catch(e => {
                    console.error("Audio play failed:", e);
                    // Fallback to alert
                    alert(`[알림] ${message}`);
                });
            } else {
                // Fallback if TTS fails
                alert(`[알림] ${message}`);
            }
        } catch (error) {
            console.error("Reminder TTS error:", error);
            // Fallback to alert
            alert(`[알림] ${message}`);
        }
    };

    return null; // Invisible component
}
