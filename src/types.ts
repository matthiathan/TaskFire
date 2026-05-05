export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Pending' | 'In Progress' | 'Completed';
export type UserRole = 'employee' | 'director';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface PostgrestTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  start_date: string | null;
  due_date: string | null;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  averageCompletionTime: number; // in hours
}
