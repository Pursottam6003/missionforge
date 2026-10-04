import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Sparkles, CheckCircle2, Clock, Menu, Layers } from 'lucide-react';
import type { Message, AgentRole } from '../../../src/types/mission';

interface MissionWorkspaceProps {
  title: string;
  status: string;
  messages: Message[];
  inputVal: string;
  isMissionActive: boolean;
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenSidebar: () => void;
  onOpenRightPanel: () => void;
}

export const MissionWorkspace: React.FC<MissionWorkspaceProps> = ({
  title,
  status,
  messages,
  inputVal,
  isMissionActive,
  onInputChange,
  onSubmit,
  onOpenSidebar,
  onOpenRightPanel,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAgentBanner = (agent?: AgentRole) => {
    switch (agent) {
      case 'researcher':
        return {
          label: '🔎 RESEARCHER — Evidence Collection',
          color: 'text-rose-600',
        };
      case 'analyst':
        return {
          label: '📊 ANALYST — Engineering Analysis',
          color: 'text-amber-700',
        };
      case 'reporter':
        return {
          label: '📝 REPORTER — Architectural Report',
          color: 'text-purple-700',
        };
      case 'manager':
      default:
        return {
          label: '🧠 MANAGER — Mission Planner',
          color: 'text-slate-700',
        };
    }
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#FAF7F2] overflow-hidden select-text relative w-full min-w-0">
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 md:w-96 h-72 md:h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-3 md:px-6 py-3 border-b border-rose-100/70 bg-white/70 backdrop-blur-md flex items-center justify-between shrink-0 z-10 gap-2">
        {/* Mobile Left Drawer Trigger */}
        <button
          onClick={onOpenSidebar}
          aria-label="Open Missions Menu"
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-rose-50 lg:hidden shrink-0 border border-rose-100/80"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-xs md:text-sm font-bold text-slate-900 truncate">
            {title || 'Ready for engineering objective'}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs">
            <span className="text-slate-400 font-medium text-[11px] hidden sm:inline">Status:</span>
            <span
              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                status === 'completed'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : status === 'idle'
                  ? 'bg-stone-100 text-stone-600 border border-stone-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {status === 'completed' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ) : status === 'idle' ? null : (
                <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
              )}
              <span>{status || 'connecting'}</span>
            </span>
          </div>
        </div>

        {/* Mobile Right Drawer Trigger (Tasks & Report) */}
        <button
          onClick={onOpenRightPanel}
          aria-label="Open Tasks and Reports"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 lg:hidden shrink-0 border border-rose-200 text-xs font-semibold"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tasks / Report</span>
        </button>
      </header>

      {/* Execution Stream */}
      <div className="flex-1 overflow-y-auto px-3 md:px-8 py-4 md:py-6 space-y-4 md:space-y-6 z-10">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto text-slate-400 px-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-gradient-to-tr from-rose-100 to-amber-100 border border-rose-200 flex items-center justify-center text-rose-500 mb-3 shadow-xs">
              <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No active mission</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Launch an example from the sidebar or type an engineering query below to start autonomous execution.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const agentBanner = getAgentBanner(msg.agent);

            return (
              <div
                key={i}
                className={`flex gap-2.5 md:gap-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
              >
                <div
                  className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-xs leading-relaxed max-w-[92vw] sm:max-w-none ${
                    isUser
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/15'
                      : 'bg-white border border-rose-100/90 text-slate-800 shadow-xs'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                      isUser ? 'text-rose-100' : agentBanner.color
                    }`}
                  >
                    {isUser ? '👤 Mission Objective' : agentBanner.label}
                  </div>
                  <div className={`prose prose-sm max-w-none ${isUser ? 'text-white' : 'text-slate-800'}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                {isUser && (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-700 shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Responsive Input Console */}
      <form onSubmit={onSubmit} className="p-2.5 md:p-4 border-t border-rose-100/70 bg-white/80 backdrop-blur-md shrink-0 z-10">
        <div className="relative flex items-center max-w-4xl mx-auto w-full">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={
              isMissionActive
                ? 'Ask a follow-up question...'
                : 'Enter engineering mission objective...'
            }
            className="w-full bg-white border border-rose-200/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-xl md:rounded-2xl px-3.5 md:px-5 py-2.5 md:py-3.5 pr-20 md:pr-28 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-1.5 md:right-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs rounded-lg md:rounded-xl transition-all flex items-center gap-1 shadow-sm shadow-rose-500/20 active:scale-95"
          >
            <span>{isMissionActive ? 'Inquire' : 'Execute'}</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>
    </main>
  );
};