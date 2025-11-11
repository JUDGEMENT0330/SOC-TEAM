// src/types/index.ts

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  name: string;
  createdAt: Date;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  category: string;
  content: ScenarioContent;
  commands: ScenarioCommand[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ScenarioContent {
  situation: string;
  objectives: string[];
  deliverables: string[];
  resources?: string[];
  hints?: string[];
}

export interface ScenarioCommand {
  command: string;
  description: string;
  expectedOutput: string;
  category: 'network' | 'security' | 'system' | 'forensics';
  difficulty: number; // 1-10
}

export interface StudentProgress {
  userId: string;
  scenarioId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0-100
  completedSteps: string[];
  commandsExecuted: string[];
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number; // minutes
  score?: number;
}

export interface TerminalSession {
  id: string;
  name: string;
  workingDirectory: string;
  history: TerminalCommand[];
  environment: {
    user: string;
    host: string;
    shell: string;
  };
  active: boolean;
}

export interface TerminalCommand {
  command: string;
  output: string;
  timestamp: Date;
  exitCode: number;
}

export interface PDFScenario {
  title: string;
  content: string;
  metadata: {
    author?: string;
    createdDate?: Date;
    pageCount: number;
  };
}

export interface CommandTemplate {
  id: string;
  name: string;
  command: string;
  description: string;
  category: string;
  parameters: CommandParameter[];
  examples: string[];
}

export interface CommandParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'ip' | 'port';
  required: boolean;
  description: string;
  default?: string | number | boolean;
}

export interface AdminStats {
  totalStudents: number;
  totalScenarios: number;
  activeStudents: number;
  completionRate: number;
  averageScore: number;
  scenarioStats: {
    scenarioId: string;
    title: string;
    completions: number;
    averageTime: number;
    averageScore: number;
  }[];
}
