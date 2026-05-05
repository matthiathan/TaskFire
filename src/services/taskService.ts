import { supabase } from '../lib/supabase';
import { PostgrestTask, Priority, Status } from '../types';

export const taskService = {
  /**
   * Fetch all tasks for the logged-in user
   * Ordered by due_date ascending, with nulls last
   */
  async getTasks(): Promise<PostgrestTask[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('due_date', { ascending: true, nullsFirst: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create a new task
   */
  async createTask(task: Partial<PostgrestTask>): Promise<PostgrestTask> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    const payload = {
      ...task,
      user_id: session.user.id,
      status: task.status || 'Pending',
      priority: task.priority || 'Medium',
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing task with timestamp logic
   */
  async updateTask(id: string, updates: Partial<PostgrestTask>): Promise<PostgrestTask> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    const finalUpdates: any = { ...updates };

    // Automatic timestamp logic
    if (updates.status === 'In Progress') {
      finalUpdates.started_at = new Date().toISOString();
    } else if (updates.status === 'Completed') {
      finalUpdates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(finalUpdates)
      .eq('id', id)
      .eq('user_id', session.user.id) // Ensure security
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) throw error;
  },

  /**
   * Helper to update status directly (used in lists)
   */
  async updateStatus(id: string, status: Status): Promise<PostgrestTask> {
    return this.updateTask(id, { status });
  }
};
