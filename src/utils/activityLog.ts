export interface ActivityLogEntry {
  id: string;
  userId: string;
  userType: 'aluno' | 'professor';
  actionType: 'login' | 'aula_view' | 'exercicio_submit' | 'outro';
  timestamp: string;
  details?: Record<string, unknown>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function logActivity(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) {
  const logs: ActivityLogEntry[] = JSON.parse(localStorage.getItem('@DevVenture:activityLog') || '[]');
  const newEntry: ActivityLogEntry = {
    ...entry,
    id: generateId(),
    timestamp: new Date().toISOString()
  };
  logs.push(newEntry);
  localStorage.setItem('@DevVenture:activityLog', JSON.stringify(logs));
}

export function getActivityLog(): ActivityLogEntry[] {
  return JSON.parse(localStorage.getItem('@DevVenture:activityLog') || '[]');
}
