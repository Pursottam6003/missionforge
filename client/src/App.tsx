import React, { useState, useEffect } from 'react';
import { useAgent } from '@cloudflare/agents/react';
import { X } from 'lucide-react';
import { Sidebar, type SavedMissionMeta } from './components/Sidebar';
import { MissionWorkspace } from './components/MissionWorkspace';
import { TaskBoard } from './components/TaskBoard';
import { TimelineView } from './components/TimelineView';
import { ReportView } from './components/ReportView';
import type { MissionState } from '../../src/types/mission';

const PRESETS = [
  'Compare Kafka and RabbitMQ for an event-driven order processing system.',
  'Evaluate whether Cloudflare Agents could replace traditional backend orchestration.',
  'Investigate why an API degrades when batch processing 500,000 records.',
];

export default function App() {
  const [currentMissionId, setCurrentMissionId] = useState<string>(() => {
    return localStorage.getItem('mf_active_mission') || 'default-mission';
  });

  const [recentMissions, setRecentMissions] = useState<SavedMissionMeta[]>(() => {
    try {
      const saved = localStorage.getItem('mf_recent_missions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputVal, setInputVal] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'timeline' | 'report'>('tasks');

  // Mobile Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const [state, setState] = useState<MissionState>({
    status: 'idle',
    messages: [],
    tasks: [],
    findings: [],
    analysis: [],
    events: [],
    report: null,
  });

  const agent = useAgent<MissionState>({
    agent: 'mission-agent',
    name: currentMissionId,
    onStateUpdate: (newState) => {
      setState(newState);
      if (newState.report) {
        setActiveTab('report');
      }

      if (newState.objective) {
        setRecentMissions((prev) => {
          const title = newState.title || newState.objective?.slice(0, 45) || '';
          const existing = prev.filter((m) => m.id !== currentMissionId);
          const updated: SavedMissionMeta[] = [
            {
              id: currentMissionId,
              title,
              status: newState.status || 'idle',
              updatedAt: Date.now(),
            },
            ...existing,
          ].slice(0, 15);

          localStorage.setItem('mf_recent_missions', JSON.stringify(updated));
          return updated;
        });
      }
    },
  });

  useEffect(() => {
    localStorage.setItem('mf_active_mission', currentMissionId);
  }, [currentMissionId]);

  const handleSelectMission = (id: string) => {
    setCurrentMissionId(id);
    setActiveTab('tasks');
  };

  const handleNewMission = () => {
    const nextId = `mission-${Date.now().toString(36)}`;
    setCurrentMissionId(nextId);
    setState({
      status: 'idle',
      messages: [],
      tasks: [],
      findings: [],
      analysis: [],
      events: [],
      report: null,
    });
    setActiveTab('tasks');
  };

  const handleLaunchPreset = (presetText: string) => {
    setActiveTab('tasks');
    agent.send(JSON.stringify({ type: 'START_MISSION', objective: presetText }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (!state.objective) {
      agent.send(JSON.stringify({ type: 'START_MISSION', objective: inputVal }));
    } else {
      agent.send(JSON.stringify({ type: 'CHAT_MESSAGE', content: inputVal }));
    }
    setInputVal('');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF7F2] text-slate-800 font-sans relative">
      {/* ── 1. LEFT SIDEBAR (Desktop Fixed, Mobile Slide-In) ───────── */}
      <Sidebar
        currentMissionId={currentMissionId}
        recentMissions={recentMissions}
        presets={PRESETS}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectMission={handleSelectMission}
        onNewMission={handleNewMission}
        onLaunchPreset={handleLaunchPreset}
      />

      {/* ── 2. CENTER PANEL (Main Responsive Workspace) ───────────── */}
      <MissionWorkspace
        title={state.title || state.objective || ''}
        status={state.status || 'connecting'}
        messages={state.messages || []}
        inputVal={inputVal}
        isMissionActive={Boolean(state.objective)}
        onInputChange={setInputVal}
        onSubmit={handleSubmit}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenRightPanel={() => setIsRightPanelOpen(true)}
      />

      {/* ── 3. RIGHT PANEL (Desktop Column, Mobile Slide-In Sheet) ── */}
      {/* Mobile Backdrop */}
      {isRightPanelOpen && (
        <div
          onClick={() => setIsRightPanelOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-84 max-w-[88vw] border-l border-rose-100/70 bg-[#FCFBF9] flex flex-col h-full shrink-0 shadow-2xl lg:shadow-[-2px_0_12px_rgba(244,63,94,0.02)] transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Tab Toggle & Mobile Close */}
        <div className="p-3 border-b border-rose-100/60 bg-white/70 backdrop-blur flex items-center justify-between gap-1 shrink-0">
          <div className="flex gap-1 flex-1">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'tasks'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200/80 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tasks ({state.tasks?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'timeline'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Timeline ({state.events?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'report'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Report {state.report ? '✓' : ''}
            </button>
          </div>

          <button
            onClick={() => setIsRightPanelOpen(false)}
            aria-label="Close Inspector"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 lg:hidden ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-3.5">
          {activeTab === 'tasks' ? (
            <TaskBoard tasks={state.tasks || []} />
          ) : activeTab === 'timeline' ? (
            <TimelineView events={state.events || []} />
          ) : (
            <ReportView report={state.report || null} />
          )}
        </div>

        {/* State Inspector Footer */}
        <div className="p-3 border-t border-rose-100/60 bg-white/80 text-[10px] text-slate-500 font-mono shrink-0">
          <div className="flex justify-between items-center mb-1">
            <span className="uppercase font-bold tracking-wider text-slate-400">DO SQLite State</span>
            <span className="text-rose-600 font-semibold">{state.status}</span>
          </div>
          <div className="truncate text-slate-400">
            Events: {state.events?.length || 0} | Tasks: {state.tasks?.length || 0}
          </div>
        </div>
      </aside>
    </div>
  );
}