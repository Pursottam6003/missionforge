export type MissionStatus =
  | 'idle'
  | 'planning'
  | 'researching'
  | 'analyzing'
  | 'reporting'
  | 'completed'
  | 'failed';

export type AgentRole = 'manager' | 'researcher' | 'analyst' | 'reporter';

export interface Source {
  id: string;
  title: string;
  url?: string;
  snippet: string;
}
export type AgentEventType =
  | 'started'
  | 'progress'
  | 'tool_call'
  | 'finding'
  | 'analysis'
  | 'completed'
  | 'failed';

export interface AgentEvent {
  id: string;
  agent: AgentRole;
  taskId?: string;
  type: AgentEventType;
  content: string;
  timestamp: number;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface Task {
  id: string;
  title: string;
  assignedAgent: AgentRole;
  status: TaskStatus;
  result?: string;
}

export interface MissionPlan {
  summary: string;
  tasks: Task[];
}

export interface Finding {
  id: string;
  claim: string;
  evidence: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface AnalysisDimension {
  dimension: string;
  comparison: string;
  conclusion: string;
}

export interface FinalReport {
  executiveSummary: string;
  keyFindings: string[];
  evidenceSummary: string[];
  tradeOffs: string[];
  recommendation: string;
  nextSteps: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  agent?: AgentRole;
  content: string;
  timestamp: number;
}

export interface MissionState {
  id?: string;
  title?: string;
  objective?: string;
  status?: MissionStatus;
  plan?: MissionPlan;
  tasks?: Task[];
  findings?: Finding[];
  analysis?: AnalysisDimension[];
  events?: AgentEvent[];
  report?: FinalReport | null;
  messages?: Message[];
  createdAt?: number;
  updatedAt?: number;
}