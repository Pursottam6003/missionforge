import React from 'react';
import { CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';
import type { Task } from '../../../src/types/mission';


interface TaskBoardProps {
  tasks: Task[];
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-slate-400 italic">
        Execution tasks will stage here once mission planning begins.
      </div>
    );
  }

  const roleStyles: Record<string, { bg: string; text: string; border: string }> = {
    Researcher: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
    Analyst: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Reporter: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  };

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => {
        const role = roleStyles[task.assignedAgent] || roleStyles.Researcher;
        const isExecuting = task.status === 'in_progress';
        const isCompleted = task.status === 'completed';

        return (
          <div
            key={task.id}
            className={`p-3.5 rounded-xl border transition-all ${
              isExecuting
                ? 'bg-white border-rose-300 shadow-md shadow-rose-500/10 ring-2 ring-rose-200'
                : isCompleted
                ? 'bg-white border-stone-200/80 hover:border-rose-200 shadow-sm'
                : 'bg-stone-50/60 border-stone-200/50 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${role.bg} ${role.text} ${role.border}`}
              >
                {task.assignedAgent}
              </span>

              <div className="flex items-center gap-1.5 text-xs">
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                ) : isExecuting ? (
                  <span className="flex items-center gap-1 text-rose-500 font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing</span>
                  </span>
                ) : task.status === 'failed' ? (
                  <span className="flex items-center gap-1 text-rose-600 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Failed</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-800 leading-snug font-medium">{task.title}</p>
          </div>
        );
      })}
    </div>
  );
};