import React, { useState } from 'react';
import { PostgrestTask, Priority, Status } from '@/src/types';
import { 
  Plus, 
  Search, 
  ListTodo
} from 'lucide-react';
import { toast } from 'sonner';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

interface TaskListProps {
  tasks: PostgrestTask[];
  onRefresh: () => void;
  onDelete: (id: string) => Promise<void>;
  onCreate: (payload: any) => Promise<void>;
  onUpdate: (id: string, payload: any) => Promise<void>;
  onUpdateStatus: (id: string, newStatus: Status) => Promise<void>;
}

/**
 * TaskList serves as the primary strategic view for active operations.
 * It manages the search discovery parameters and the lifecycle of task entities.
 */
export default function TaskList({ tasks, onRefresh, onDelete, onCreate, onUpdate, onUpdateStatus }: TaskListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<PostgrestTask | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Operational filtering
  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Commits task data to the Supabase backend.
   * Leverages taskService for abstracted database interactions.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    try {
      const payload = {
        title,
        description,
        priority,
        start_date: startDate || null,
        due_date: dueDate || null,
      };

      if (editingTask) {
        await onUpdate(editingTask.id, payload);
      } else {
        await onCreate(payload);
      }
      closeModal();
    } catch (err: any) {
      console.error('[TaskList] Submit error:', err);
      setSubmitError(err.message || 'An operational failure occurred during synchronization.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Status) => {
    try {
      await onUpdateStatus(id, newStatus);
    } catch (err) {
      console.error('[TaskList] Status update error:', err);
    }
  };

  const deleteTaskItem = async (id: string) => {
    const promise = onDelete(id);
    
    toast.promise(promise, {
      loading: 'ERASING OPERATION...',
      success: () => {
        onRefresh();
        return 'OPERATION ERASED FROM GRID';
      },
      error: (err) => `ERASURE FAILURE: ${err.message || 'Unknown protocol error'}`
    });

    return promise;
  };

  const openModal = (task?: PostgrestTask) => {
    setSubmitError(null);
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStartDate(task.start_date || '');
      setDueDate(task.due_date || '');
    } else {
      setEditingTask(null);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStartDate('');
      setDueDate('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setSubmitError(null);
  };

  return (
    <div className="space-y-6">
      {/* Filtering and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 px-0.5" />
          <input
            type="text"
            placeholder="Search productivity stream..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#FF4D00] outline-none transition-all shadow-inner font-medium"
          />
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF4D00] to-[#FF9900] text-white px-8 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(255,77,0,0.3)] w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          GENERATE TASK
        </button>
      </div>

      {/* Main Task Stream */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ListTodo className="w-10 h-10 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Stream Empty</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm">No active processes meeting your current discovery parameters.</p>
          </div>
        ) : (
          filteredTasks.map((task, idx) => (
            <TaskCard 
              key={task.id}
              task={task}
              idx={idx}
              onUpdateStatus={updateStatus}
              onEdit={openModal}
              onDelete={deleteTaskItem}
            />
          ))
        )}
      </div>

      {/* Task Creation/Editing Overlay */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingTask={editingTask}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        priority={priority}
        setPriority={setPriority}
        startDate={startDate}
        setStartDate={setStartDate}
        dueDate={dueDate}
        setDueDate={setDueDate}
        loading={loading}
        error={submitError}
      />
    </div>
  );
}
