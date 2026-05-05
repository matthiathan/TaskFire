import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | null) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'Pending': return 'text-amber-500 bg-amber-50 border-amber-200';
    case 'In Progress': return 'text-blue-500 bg-blue-50 border-blue-200';
    case 'Completed': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    default: return 'text-slate-500 bg-slate-50 border-slate-200';
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'Low': return 'text-slate-500 bg-slate-50 border-slate-200';
    case 'Medium': return 'text-indigo-500 bg-indigo-50 border-indigo-200';
    case 'High': return 'text-rose-500 bg-rose-50 border-rose-200';
    default: return 'text-slate-500 bg-slate-50 border-slate-200';
  }
}
