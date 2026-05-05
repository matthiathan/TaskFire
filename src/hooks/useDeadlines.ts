import { useMemo } from 'react';
import { isToday, isTomorrow, parseISO } from 'date-fns';
import { PostgrestTask } from '../types';

export interface UrgentTask extends PostgrestTask {
  urgency: 'today' | 'tomorrow';
}

/**
 * Tactical hook to evaluate mission-critical deadlines.
 * Identifies tasks due within the immediate 48-hour window.
 */
export function useDeadlines(tasks: PostgrestTask[]) {
  const urgentTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (task.status === 'completed' || !task.due_date) return false;
        
        // Use parseISO to handle YYYY-MM-DD strings accurately
        const dueDate = parseISO(task.due_date);
        return isToday(dueDate) || isTomorrow(dueDate);
      })
      .map(task => {
        const dueDate = parseISO(task.due_date!);
        return {
          ...task,
          urgency: isToday(dueDate) ? 'today' as const : 'tomorrow' as const
        };
      })
      // Sort: Today first, then Priority (high -> low)
      .sort((a, b) => {
        if (a.urgency !== b.urgency) {
          return a.urgency === 'today' ? -1 : 1;
        }
        const priorityScore = { high: 3, medium: 2, low: 1 };
        return priorityScore[b.priority] - priorityScore[a.priority];
      });
  }, [tasks]);

  const hasTodayDeadline = useMemo(() => 
    urgentTasks.some(t => t.urgency === 'today'), 
  [urgentTasks]);

  return {
    urgentTasks,
    hasTodayDeadline,
    count: urgentTasks.length
  };
}
