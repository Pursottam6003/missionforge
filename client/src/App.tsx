import React, { useState, useEffect, useRef } from 'react';
import { useAgent } from '@cloudflare/agents/react';
import { X } from 'lucide-react';
import { Sidebar, type SavedMissionMeta, type UserProfile } from './components/Sidebar';
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
  const [user, setUser] = useState<UserProfile | null>(null);

  // 1. Fresh unique ID per visitor to prevent inheriting previously completed 'default-mission'
  const [currentMissionId, setCurrentMissionId] = useState<string>(() => {
    const saved = localStorage.getItem('mf_active_mission');
    if (saved) return saved;
    const freshId = `guest-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('mf_active_mission', freshId);
    return freshId;
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // 2. Status tracker to ensure we only switch to Report when a run finishes live
  const prevStatusRef = useRef<string>('idle');

  const [state, setState] = useState<MissionState>({
    status: 'idle',
    messages: [],
    tasks: [],
    findings: [],
    analysis: [],
    events: [],
    report: null,
  });

  // Check Session State on Mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data: { authenticated: boolean; user?: UserProfile }) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const agent = useAgent<MissionState>({
    agent: 'mission-agent',
    name: currentMissionId,
    onStateUpdate: (newState) => {
      setState(newState);

      // Only switch to Report if a pipeline actively transitioned to completed during this session
      if (
        newState.status === 'completed' &&
        prevStatusRef.current !== 'completed' &&
        prevStatusRef.current !== 'idle'
      ) {
        setActiveTab('report');
      }

      if (newState.status) {
        prevStatusRef.current = newState.status;
      }

      if (newState.objective) {
        setRecentMissions((prev) => {
          const title = newState.title || newState.objective?.slice(0, 45) || 'Untitled mission';
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
    const prefix = user ? `gh-${user.login}` : 'guest';
    const nextId = `${prefix}-${Date.now().toString(36)}`;
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
    prevStatusRef.current = 'idle';
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const handleLaunchPreset = (presetText: string) => {
    setActiveTab('tasks');
    prevStatusRef.current = 'planning';
    agent.send(JSON.stringify({ type: 'START_MISSION', objective: presetText }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (!state.objective) {
      setActiveTab('tasks');
      prevStatusRef.current = 'planning';
      agent.send(JSON.stringify({ type: 'START_MISSION', objective: inputVal }));
    } else {
      agent.send(JSON.stringify({ type: 'CHAT_MESSAGE', content: inputVal }));
    }
    setInputVal('');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF7F2] text-slate-800 font-sans relative">
      {/* ── 1. LEFT SIDEBAR ────────────────────────────────────────── */}
      <Sidebar
        currentMissionId={currentMissionId}
        recentMissions={recentMissions}
        presets={PRESETS}
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectMission={handleSelectMission}
        onNewMission={handleNewMission}
        onLaunchPreset={handleLaunchPreset}
        onLogout={handleLogout}
      />

      {/* ── 2. CENTER PANEL (Main Responsive Workspace) ───────────── */}
      <MissionWorkspace
        title={state.title || state.objective || ''}
        status={state.status || 'idle'}
        messages={state.messages || []}
        inputVal={inputVal}
        isMissionActive={Boolean(state.objective)}
        presets={PRESETS}
        onInputChange={setInputVal}
        onSubmit={handleSubmit}
        onLaunchPreset={handleLaunchPreset}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenRightPanel={() => setIsRightPanelOpen(true)}
      />

      {/* ── 3. RIGHT PANEL (Locked Width Inspector) ───────────────── */}
      {isRightPanelOpen && (
        <div
          onClick={() => setIsRightPanelOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-[360px] xl:w-[400px] max-w-[88vw] border-l border-rose-100/70 bg-[#FCFBF9] flex flex-col h-full shrink-0 shadow-2xl lg:shadow-[-2px_0_12px_rgba(244,63,94,0.02)] transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
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

        <div className="flex-1 overflow-y-auto p-3.5">
          {activeTab === 'tasks' ? (
            <TaskBoard tasks={state.tasks || []} />
          ) : activeTab === 'timeline' ? (
            <TimelineView events={state.events || []} />
          ) : (
            <ReportView report={state.report || null} />
          )}
        </div>

        <div className="p-3 border-t border-rose-100/60 bg-white/80 text-[10px] text-slate-500 font-mono shrink-0">
          <div className="flex justify-between items-center mb-1">
            <span className="uppercase font-bold tracking-wider text-slate-400">DO SQLite State</span>
            <span className="text-rose-600 font-semibold">{state.status}</span>
          </div>
          <div className="truncate text-slate-400">
            {user ? `@${user.login}` : 'Guest'} | Events: {state.events?.length || 0}
          </div>
        </div>
      </aside>
    </div>
  );
}