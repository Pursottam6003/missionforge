import React from 'react';
import type { AgentEvent, AgentRole } from '../../../src/types/mission';
import { Clock, Play, Wrench, CheckCircle, AlertTriangle, FileText, Search, BarChart3 } from 'lucide-react';

interface TimelineViewProps {
  events: AgentEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10 text-xs text-slate-400 italic">
        Execution timeline will stream live events as agents operate.
      </div>
    );
  }

  const roleMeta: Record<AgentRole, { label: string; icon: React.ReactNode; color: string; badge: string }> = {
    manager: {
      label: 'Manager',
      icon: <span className="text-xs">🧠</span>,
      color: 'text-stone-700',
      badge: 'bg-stone-100 text-stone-700 border-stone-200',
    },
    researcher: {
      label: 'Researcher',
      icon: <Search className="w-3 h-3 text-rose-500" />,
      color: 'text-rose-600',
      badge: 'bg-rose-50 text-rose-600 border-rose-200',
    },
    analyst: {
      label: 'Analyst',
      icon: <BarChart3 className="w-3 h-3 text-amber-600" />,
      color: 'text-amber-700',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    reporter: {
      label: 'Reporter',
      icon: <FileText className="w-3 h-3 text-purple-600" />,
      color: 'text-purple-700',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  };

  const getEventIcon = (type: AgentEvent['type']) => {
    switch (type) {
      case 'started':
        return <Play className="w-3 h-3 text-sky-500" />;
      case 'tool_call':
        return <Wrench className="w-3 h-3 text-amber-500" />;
      case 'finding':
      case 'analysis':
        return <CheckCircle className="w-3 h-3 text-emerald-500" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-emerald-600" />;
      case 'failed':
        return <AlertTriangle className="w-3 h-3 text-rose-500" />;
      default:
        return <Clock className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-rose-100/80">
      {events.map((evt) => {
        const meta = roleMeta[evt.agent] || roleMeta.manager;
        const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        return (
          <div key={evt.id} className="relative group">
            {/* Timeline bullet dot */}
            <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-rose-300 flex items-center justify-center shadow-xs" />

            <div className="p-2.5 rounded-xl bg-white border border-rose-100/90 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${meta.badge}`}>
                    {meta.icon}
                    <span>{meta.label}</span>
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                    {getEventIcon(evt.type)}
                    <span>{evt.type}</span>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{timeStr}</span>
              </div>
              <p className="text-xs text-slate-700 leading-snug">{evt.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};