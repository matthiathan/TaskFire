import { PostgrestTask } from '@/src/types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FileDown, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ReportGeneratorProps {
  tasks: PostgrestTask[];
  stats: any;
}

export default function ReportGenerator({ tasks, stats }: ReportGeneratorProps) {
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF() as any;
      const date = new Date().toLocaleDateString();

      // Header
      doc.setFillColor(15, 15, 15); // Dark background
      doc.rect(0, 0, 210, 45, 'F');
      
      // Accent line
      doc.setFillColor(255, 77, 0); // TaskFire Orange
      doc.rect(0, 43, 210, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.text('TASKFIRE', 20, 25);
      
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('EXECUTIVE PERFORMANCE BRIEFING', 20, 35);
      
      doc.setTextColor(255, 255, 255);
      doc.text(`DATE: ${date}`, 150, 20);
      doc.text(`CLEARANCE: EXECUTIVE`, 150, 28);

      // Executive Summary
      doc.setTextColor(15, 15, 15);
      doc.setFontSize(14);
      doc.text('CORE METRICS', 20, 65);

      const summaryData = [
        ['Total Process Stream', stats.total.toString()],
        ['Efficiency Rating', `${stats.completionRate}%`],
        ['Avg. Resolution Time', `${stats.averageCompletionTime} hours`],
        ['Resolved Operations', stats.completed.toString()],
        ['Active Engagements', stats.inProgress.toString()],
      ];

      (doc as any).autoTable({
        startY: 75,
        head: [['Strategic Metric', 'Data Point']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [15, 15, 15], textColor: [255, 77, 0] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      // Task Details table
      doc.setFontSize(14);
      doc.text('COMPLETED OPERATIONS STREAM', 20, (doc as any).lastAutoTable.finalY + 15);

      const completedTasks = tasks
        .filter(t => t.status === 'completed')
        .map(t => {
          let duration = '-';
          if (t.started_at && t.completed_at) {
            const start = new Date(t.started_at).getTime();
            const end = new Date(t.completed_at).getTime();
            duration = ((end - start) / (1000 * 60 * 60)).toFixed(1) + 'h';
          }
          return [
            t.title,
            t.priority.toUpperCase(),
            duration,
            new Date(t.created_at).toLocaleDateString(),
            t.completed_at ? new Date(t.completed_at).toLocaleDateString() : '-'
          ];
        });

      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 25,
        head: [['Operation Identifier', 'Priority', 'Duration', 'Logged', 'Resolved']],
        body: completedTasks,
        theme: 'grid',
        headStyles: { fillColor: [255, 77, 0], textColor: [255, 255, 255] },
        styles: { fontSize: 9 }
      });

      doc.save(`TASKFIRE_EXEC_BRIEFING_${date.replace(/\//g, '-')}.pdf`);
    } catch (err) {
      console.error('Report Generation Error:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generateReport}
      disabled={generating}
      className="flex items-center gap-2 bg-gradient-to-r from-[#FF4D00] to-[#FF9900] text-white px-6 py-2.5 rounded-xl font-bold transition-all hover:scale-105 shadow-[0_4px_20px_rgba(255,77,0,0.3)] disabled:opacity-50 text-xs uppercase tracking-widest"
    >
      {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
      Generate Executive Report
    </button>
  );
}
