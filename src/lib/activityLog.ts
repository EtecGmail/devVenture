import { v4 as uuidv4 } from 'uuid';
import { ActivityLogEntry, LOCAL_STORAGE_KEYS } from '@/types/admin';

export const logActivity = (
  userId: string,
  userType: 'aluno' | 'professor', // Explicitly use the types
  actionType: ActivityLogEntry['actionType'],
  details?: Record<string, any>
): void => {
  const newEntry: ActivityLogEntry = {
    id: uuidv4(),
    userId,
    userType,
    actionType,
    timestamp: new Date().toISOString(),
    details,
  };

  try {
    const existingLogString = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVITY_LOG);
    const existingLog: ActivityLogEntry[] = existingLogString ? JSON.parse(existingLogString) : [];

    existingLog.push(newEntry);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(existingLog));
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Optional: Implement a more robust error handling or fallback if localStorage fails
  }
};
