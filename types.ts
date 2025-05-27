export type AlgorithmType = 'fcfs' | 'sjf' | 'srtf' | 'rr' | 'priority' | 'hrrn';

export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  colorIndex: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
  completionTime: number;
  remainingTime?: number;
}

export interface TimelineBlock {
  processId: string;
  startTime: number;
  endTime: number;
  colorIndex: number;
}

export interface SchedulingResult {
  timeline: TimelineBlock[];
  processInfo: Process[];
}