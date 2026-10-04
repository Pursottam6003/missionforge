import React from 'react';
import { Plus, Terminal, Clock, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

export interface SavedMissionMeta {
  id: string;
  title: string;
  status: string;
  updatedAt: number;
}

interface SidebarProps {
  currentMissionId: string;
  recentMissions: SavedMissionMeta[];
  presets: string[];
  isOpen?: boolean;
  onClose?: () => void;
  onSelectMission: (id: string) => void;
  onNewMission: () => void;
  onLaunchPreset: (preset: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMissionId,
  recentMissions,
  presets,
  isOpen = false,
  onClose,
  onSelectMission,
  onNewMission,
  onLaunchPreset,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#FCFBF9] border-r border-rose-100/70 flex flex-col h-full select-none shadow-xl lg:shadow-[2px_0_12px_rgba(244,63,94,0.02)] transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-rose-100/60 flex items-center justify-between bg-white/70 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-sm shadow-rose-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">MissionForge</h1>
              <span className="text-[10px] text-rose-500/80 font-semibold uppercase tracking-wider">Workbench</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                onNewMission();
                onClose?.();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 rounded-lg transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
            {/* Close Button on Mobile */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Recent Missions */}
          <div>
            <div className="px-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Recent Missions</span>
              <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded-full font-medium">
                {recentMissions.length}
              </span>
            </div>
            <div className="space-y-1">
              {recentMissions.length === 0 ? (
                <div className="px-2 py-3 text-xs text-slate-400 italic">No missions saved yet.</div>
              ) : (
                recentMissions.map((m) => {
                  const isActive = m.id === currentMissionId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectMission(m.id);
                        onClose?.();
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-50 to-pink-50 text-slate-900 font-semibold border border-rose-200/80 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100/60 border border-transparent'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {m.status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : m.status === 'failed' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate leading-tight text-slate-800">{m.title || 'Untitled Mission'}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          {new Date(m.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Example Presets */}
          <div>
            <div className="px-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Example Presets</span>
            </div>
            <div className="space-y-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onLaunchPreset(preset);
                    onClose?.();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-white hover:bg-rose-50/40 border border-rose-100/80 hover:border-rose-200 text-xs text-slate-700 hover:text-rose-950 leading-snug transition-all shadow-xs"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Session */}
        <div className="p-3 border-t border-rose-100/60 bg-white/60 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="font-medium">Instance:</span>
          <span
            className="font-mono text-slate-700 truncate max-w-[140px] text-[10px] bg-rose-50 px-2 py-0.5 rounded border border-rose-100"
            title={currentMissionId}
          >
            {currentMissionId}
          </span>
        </div>
      </aside>
    </>
  );
};