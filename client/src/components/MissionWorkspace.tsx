import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  User,
  Sparkles,
  CheckCircle2,
  Clock,
  Menu,
  Layers,
  ArrowRight,
  Cpu,
  Database,
  Radio,
  Workflow
} from 'lucide-react';
import type { Message, AgentRole } from '../../../src/types/mission';

interface MissionWorkspaceProps {
  title: string;
  status: string;
  messages: Message[];
  inputVal: string;
  isMissionActive: boolean;
  presets: string[];
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLaunchPreset: (preset: string) => void;
  onOpenSidebar: () => void;
  onOpenRightPanel: () => void;
}

export const MissionWorkspace: React.FC<MissionWorkspaceProps> = ({
  title,
  status,
  messages,
  inputVal,
  isMissionActive,
  presets,
  onInputChange,
  onSubmit,
  onLaunchPreset,
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
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 md:w-96 h-72 md:h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-3 md:px-6 py-3 border-b border-rose-100/70 bg-white/70 backdrop-blur-md flex items-center justify-between shrink-0 z-10 gap-2">
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
              <span>{status || 'ready'}</span>
            </span>
          </div>
        </div>

        <button
          onClick={onOpenRightPanel}
          aria-label="Open Tasks and Reports"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 lg:hidden shrink-0 border border-rose-200 text-xs font-semibold"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tasks / Report</span>
        </button>
      </header>

      {/* Main Workspace Stream or Interactive Landing Architecture */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-7 space-y-4 md:space-y-6 z-10">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto py-2">
            {/* ── 1. Hero Tagline ──────────────────────────────────── */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cloudflare-Native Autonomous Workbench</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                MissionForge System Architecture
              </h1>
              <p className="text-xs md:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Autonomous multi-agent orchestration running at Cloudflare’s global edge. Transforms ambiguous technical questions into evidence-backed architectural decisions.
              </p>
            </div>

            {/* ── 2. Visual Architecture Diagram ──────────────────── */}
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-rose-100/90 p-4 md:p-5 shadow-sm mb-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100/60">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Edge Runtime Blueprint
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-stone-100 text-slate-600 px-2 py-0.5 rounded border border-stone-200">
                  Workers AI + DO SQLite
                </span>
              </div>

              {/* Layer 1: Client & Ingestion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 mt-0.5">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Real-Time WebSockets</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Hibernating bidirectional channels via <code>@cloudflare/agents</code>.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 mt-0.5">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Durable Object SQLite</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Sub-millisecond embedded SQLite state persisted per mission instance.
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 2: 4-Stage Multi-Agent Pipeline */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-rose-50/40 via-amber-50/30 to-purple-50/40 border border-rose-100/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Autonomous Execution Pipeline
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 rounded-lg bg-white border border-stone-200 shadow-2xs text-center">
                    <div className="text-base mb-0.5">🧠</div>
                    <div className="font-bold text-[11px] text-slate-800">Manager</div>
                    <div className="text-[9px] text-slate-500">Task Decomposition</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-rose-200 shadow-2xs text-center">
                    <div className="text-base mb-0.5">🔎</div>
                    <div className="font-bold text-[11px] text-rose-700">Researcher</div>
                    <div className="text-[9px] text-slate-500">Corpus Tool Search</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-amber-200 shadow-2xs text-center">
                    <div className="text-base mb-0.5">📊</div>
                    <div className="font-bold text-[11px] text-amber-700">Analyst</div>
                    <div className="text-[9px] text-slate-500">Trade-Off Evaluation</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-purple-200 shadow-2xs text-center">
                    <div className="text-base mb-0.5">📝</div>
                    <div className="font-bold text-[11px] text-purple-700">Reporter</div>
                    <div className="text-[9px] text-slate-500">Decision Matrix</div>
                  </div>
                </div>
              </div>

              {/* Layer 3: Inference Specification */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-rose-500" />
                  <span className="font-semibold text-slate-800">Workers AI Model:</span>
                  <code className="text-[11px] bg-white px-2 py-0.5 rounded border border-stone-200 text-rose-600 font-mono">
                    @cf/meta/llama-3.3-70b-instruct-fp8-fast
                  </code>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Global Edge GPUs
                </span>
              </div>
            </div>

            {/* ── 3. 1-Click Launch Presets ────────────────────────── */}
            <div className="bg-white/90 backdrop-blur border border-rose-100/90 rounded-2xl p-4 md:p-5 shadow-sm text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                  Select a Mission to Execute
                </span>
                <span className="text-[10px] text-slate-400">Click any preset to trigger the pipeline</span>
              </div>
              <div className="space-y-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => onLaunchPreset(preset)}
                    className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-50/80 hover:bg-rose-50/70 border border-stone-200/60 hover:border-rose-200 text-xs text-slate-700 hover:text-slate-900 font-medium transition-all group shadow-2xs"
                  >
                    <span className="truncate">{preset}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
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

      {/* Bottom Command Console */}
      <form onSubmit={onSubmit} className="p-2.5 md:p-4 border-t border-rose-100/70 bg-white/80 backdrop-blur-md shrink-0 z-10">
        <div className="relative flex items-center max-w-4xl mx-auto w-full">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={
              isMissionActive
                ? 'Ask a follow-up question regarding findings or trade-offs...'
                : 'Enter engineering mission objective (or pick a preset above)...'
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