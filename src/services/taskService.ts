import { CrudService } from './CrudService';
import { PostgrestTask, Status } from '../types';
import { supabase } from '../lib/supabase';

/**
 * Specialized TaskService extending the generic CRUD foundation.
 * Implements business-specific logic for task lifecycle and timestamp tracking.
 */
class TaskService extends CrudService<PostgrestTask> {
  constructor() {
    super('tasks');
  }

  /**
   * Specialized fetch with custom ordering for task entities.
   */
  override async readAll(): Promise<PostgrestTask[]> {
    const userId = await this.ensureAuth();
    
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true, nullsFirst: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Specialized creation with default values for tasks.
   */
  override async create(payload: Partial<PostgrestTask>): Promise<PostgrestTask> {
    const sanitizedPayload = {
      ...payload,
      status: payload.status || 'pending',
      priority: payload.priority || 'medium',
      start_date: payload.start_date === '' ? null : payload.start_date,
      due_date: payload.due_date === '' ? null : payload.due_date,
    };
    
    return super.create(sanitizedPayload);
  }

  /**
   * Overridden update method to implement tactical timestamp tracking.
   * Automatically sets started_at and completed_at based on status transitions.
   */
  override async update(id: string, payload: Partial<PostgrestTask>): Promise<PostgrestTask> {
    const finalUpdates: any = { ...payload };

    // Sanitize dates for Supabase compatibility
    if (finalUpdates.start_date === '') finalUpdates.start_date = null;
    if (finalUpdates.due_date === '') finalUpdates.due_date = null;

    // Tactical Lifecycle Timestamp Logic
    if (payload.status === 'in_progress') {
      finalUpdates.started_at = new Date().toISOString();
    } else if (payload.status === 'completed') {
      finalUpdates.completed_at = new Date().toISOString();
    }

    return super.update(id, finalUpdates);
  }

  /**
   * Helper method for status transitions, aligning with the extended update logic.
   */
  async updateStatus(id: string, status: Status): Promise<PostgrestTask> {
    return this.update(id, { status });
  }
}

// Export a singleton instance for global system availability
export const taskService = new TaskService();
