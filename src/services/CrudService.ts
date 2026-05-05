import { supabase } from '../lib/supabase';

/**
 * A generic CRUD service providing standardized database operations.
 * Designed for scalability and consistent error handling across the application.
 * @template T The database entity type.
 */
export class CrudService<T> {
  protected tableName: string;

  /**
   * @param tableName The name of the Supabase table this service manages.
   */
  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Validates the current user session.
   * @returns The active user ID.
   * @throws Error if user is not authenticated.
   */
  protected async ensureAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('SECURE ACCESS DENIED: User must be authenticated to perform this operation.');
    }
    return session.user.id;
  }

  /**
   * Fetches all records from the table restricted to the current user.
   * @returns A promise resolving to an array of entities.
   */
  async readAll(): Promise<T[]> {
    const userId = await this.ensureAuth();
    
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`[CrudService] Failed to read from ${this.tableName}:`, error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Inserts a new record into the table.
   * Automatically attaches the current user's ID to the payload.
   * @param payload The data to insert.
   * @returns A promise resolving to the created entity.
   */
  async create(payload: Partial<T>): Promise<T> {
    const userId = await this.ensureAuth();
    
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ ...payload, user_id: userId } as any])
      .select()
      .single();

    if (error) {
      console.error(`[CrudService] Failed to create in ${this.tableName}:`, error);
      throw error;
    }

    return data;
  }

  /**
   * Updates an existing record by its ID and user ID.
   * @param id The unique identifier of the record.
   * @param payload The partial updates to apply.
   * @returns A promise resolving to the updated entity.
   */
  async update(id: string, payload: Partial<T>): Promise<T> {
    const userId = await this.ensureAuth();
    
    const { data, error } = await supabase
      .from(this.tableName)
      .update(payload as any)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error(`[CrudService] Failed to update in ${this.tableName}:`, error);
      throw error;
    }

    return data;
  }

  /**
   * Permanently removes a record from the database.
   * @param id The unique identifier of the record.
   */
  async delete(id: string): Promise<void> {
    const userId = await this.ensureAuth();
    
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error(`[CrudService] Failed to delete from ${this.tableName}:`, error);
      throw error;
    }
  }
}
