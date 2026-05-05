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

export function formatEnum(val: string) {
  if (!val) return '';
  return val
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    case 'in_progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'low': return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    case 'medium': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
    case 'high': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
  }
}
