import React from 'react';
import { CheckCircle2, ChevronRight, Award, ShieldAlert, ListChecks, Database } from 'lucide-react';
import type { FinalReport, Source } from '../../../src/types/mission';

interface ReportViewProps {
  report: FinalReport | null;
  sources?: Source[];
}

export const ReportView: React.FC<ReportViewProps> = ({ report, sources = [] }) => {
  if (!report) {
    return (
      <div className="text-center py-10 text-xs text-slate-400 italic">
        Final recommendation report generates automatically once all specialist tasks finish.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Recommendation Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 via-pink-50/70 to-amber-50/50 border border-rose-200/80 shadow-sm">
        <div className="flex items-center gap-1.5 text-rose-600 text-[11px] uppercase font-bold tracking-wider mb-2">
          <Award className="w-4 h-4 text-rose-500" />
          <span>Architectural Recommendation</span>
        </div>
        <p className="text-xs text-slate-800 font-semibold leading-relaxed">{report.recommendation}</p>
      </div>

      {/* Retrieved Technical Sources */}
      {sources.length > 0 && (
        <div className="p-3.5 rounded-xl bg-white border border-rose-100/90 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-700 text-[11px] uppercase font-bold tracking-wider mb-2">
            <Database className="w-3.5 h-3.5 text-sky-500" />
            <span>Retrieved Evidence Corpus ({sources.length})</span>
          </div>
          <div className="space-y-2">
            {sources.map((src, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-stone-50 border border-stone-200/70 text-[11px]">
                <div className="font-semibold text-slate-800 mb-0.5">{src.title}</div>
                <div className="text-slate-600 line-clamp-2 leading-relaxed">{src.snippet}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Findings */}
      <div className="p-3.5 rounded-xl bg-white border border-rose-100/90 shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-700 text-[11px] uppercase font-bold tracking-wider mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Key Findings</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {report.keyFindings.map((finding, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span className="leading-snug">{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trade-Offs Matrix */}
      <div className="p-3.5 rounded-xl bg-white border border-rose-100/90 shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-700 text-[11px] uppercase font-bold tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Core Trade-Offs</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {report.tradeOffs.map((tradeOff, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span className="leading-snug">{tradeOff}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Steps */}
      <div className="p-3.5 rounded-xl bg-white border border-rose-100/90 shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-700 text-[11px] uppercase font-bold tracking-wider mb-2">
          <ListChecks className="w-3.5 h-3.5 text-rose-500" />
          <span>Next Implementation Steps</span>
        </div>
        <div className="space-y-1.5">
          {report.nextSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
              <ChevronRight className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
              <span className="leading-snug">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};