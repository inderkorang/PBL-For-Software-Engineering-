import { Process, TimelineBlock, SchedulingResult, AlgorithmType } from '../types';

// First Come First Serve (FCFS) Algorithm
export function fcfs(processes: Process[]): SchedulingResult {
  // Sort processes by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const timeline: TimelineBlock[] = [];
  let currentTime = 0;
  
  sortedProcesses.forEach(process => {
    // If the process arrives after the current time, update current time
    if (process.arrivalTime > currentTime) {
      currentTime = process.arrivalTime;
    }
    
    // Set response time (first time CPU is allocated)
    process.responseTime = currentTime - process.arrivalTime;
    
    // Add process to timeline
    timeline.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime,
      colorIndex: process.colorIndex
    });
    
    // Update current time
    currentTime += process.burstTime;
    
    // Calculate completion time
    process.completionTime = currentTime;
    
    // Calculate turnaround time (completion time - arrival time)
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    
    // Calculate waiting time (turnaround time - burst time)
    process.waitingTime = process.turnaroundTime - process.burstTime;
  });
  
  return {
    timeline,
    processInfo: sortedProcesses
  };
}

// Shortest Job First (SJF) Algorithm
export function sjf(processes: Process[]): SchedulingResult {
  const processQueue = [...processes];
  const completedProcesses: Process[] = [];
  const timeline: TimelineBlock[] = [];
  
  // Sort processes by arrival time initially
  processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  const readyQueue: Process[] = [];
  
  while (processQueue.length > 0 || readyQueue.length > 0) {
    // Move arrived processes to ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift()!);
    }
    
    if (readyQueue.length === 0) {
      // No processes in ready queue, jump to next arrival
      currentTime = processQueue[0].arrivalTime;
      continue;
    }
    
    // Sort ready queue by burst time (shortest first)
    readyQueue.sort((a, b) => a.burstTime - b.burstTime);
    
    // Get next process to execute
    const currentProcess = readyQueue.shift()!;
    
    // Set response time
    currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
    
    // Add to timeline
    timeline.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime: currentTime + currentProcess.burstTime,
      colorIndex: currentProcess.colorIndex
    });
    
    // Update current time
    currentTime += currentProcess.burstTime;
    
    // Calculate completion time
    currentProcess.completionTime = currentTime;
    
    // Calculate turnaround time
    currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
    
    // Calculate waiting time
    currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
    
    // Add to completed processes
    completedProcesses.push(currentProcess);
  }
  
  return {
    timeline,
    processInfo: completedProcesses
  };
}

// Shortest Remaining Time First (SRTF) Algorithm
export function srtf(processes: Process[]): SchedulingResult {
  const processQueue = processes.map(p => ({
    ...p,
    remainingTime: p.burstTime
  }));
  
  const completedProcesses: Process[] = [];
  const timeline: TimelineBlock[] = [];
  
  // Sort processes by arrival time
  processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let currentProcess: Process | null = null;
  let timeSlice = 1; // Time granularity for preemption
  
  while (processQueue.length > 0 || currentProcess) {
    // Check for newly arrived processes
    const arrivedProcesses = processQueue.filter(p => p.arrivalTime <= currentTime);
    
    // Remove arrived processes from queue
    for (const process of arrivedProcesses) {
      const index = processQueue.findIndex(p => p.id === process.id);
      if (index !== -1) {
        processQueue.splice(index, 1);
      }
    }
    
    // Find process with shortest remaining time
    const shortestProcess = [...arrivedProcesses, currentProcess]
      .filter(Boolean)
      .sort((a, b) => (a!.remainingTime || 0) - (b!.remainingTime || 0))[0] as Process | undefined;
    
    // If current process changes, add to timeline
    if (shortestProcess && (!currentProcess || shortestProcess.id !== currentProcess.id)) {
      // If there was a previous process, add it to timeline
      if (currentProcess && timeline.length > 0) {
        const lastBlock = timeline[timeline.length - 1];
        if (lastBlock.processId === currentProcess.id) {
          lastBlock.endTime = currentTime;
        }
      }
      
      // Set response time if first time allocated
      if (shortestProcess.responseTime === -1) {
        shortestProcess.responseTime = currentTime - shortestProcess.arrivalTime;
      }
      
      // Start new process
      timeline.push({
        processId: shortestProcess.id,
        startTime: currentTime,
        endTime: currentTime + timeSlice, // Will be updated later
        colorIndex: shortestProcess.colorIndex
      });
      
      currentProcess = shortestProcess;
    } else if (!shortestProcess) {
      // No process available, jump to next arrival
      const nextArrival = processQueue.length > 0 ? 
        processQueue.reduce((min, p) => p.arrivalTime < min ? p.arrivalTime : min, processQueue[0].arrivalTime) : 
        currentTime + 1;
      
      currentTime = nextArrival;
      continue;
    }
    
    // Execute for time slice
    currentTime += timeSlice;
    if (currentProcess) {
      currentProcess.remainingTime = (currentProcess.remainingTime || 0) - timeSlice;
      
      // Update timeline end time
      const lastBlock = timeline[timeline.length - 1];
      if (lastBlock.processId === currentProcess.id) {
        lastBlock.endTime = currentTime;
      }
      
      // Check if process completed
      if (currentProcess.remainingTime <= 0) {
        currentProcess.completionTime = currentTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
        
        completedProcesses.push({...currentProcess});
        currentProcess = null;
      }
    }
  }
  
  // Merge adjacent blocks for the same process
  const mergedTimeline: TimelineBlock[] = [];
  for (const block of timeline) {
    const lastBlock = mergedTimeline[mergedTimeline.length - 1];
    if (lastBlock && lastBlock.processId === block.processId && lastBlock.endTime === block.startTime) {
      lastBlock.endTime = block.endTime;
    } else {
      mergedTimeline.push({...block});
    }
  }
  
  return {
    timeline: mergedTimeline,
    processInfo: completedProcesses
  };
}

// Round Robin (RR) Algorithm
export function roundRobin(processes: Process[], timeQuantum: number): SchedulingResult {
  const processQueue = processes.map(p => ({
    ...p,
    remainingTime: p.burstTime
  }));
  
  const completedProcesses: Process[] = [];
  const timeline: TimelineBlock[] = [];
  
  // Sort processes by arrival time
  processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  const readyQueue: Process[] = [];
  
  while (processQueue.length > 0 || readyQueue.length > 0) {
    // Move arrived processes to ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift()!);
    }
    
    if (readyQueue.length === 0) {
      // No processes in ready queue, jump to next arrival
      currentTime = processQueue[0].arrivalTime;
      continue;
    }
    
    // Get next process from ready queue
    const currentProcess = readyQueue.shift()!;
    
    // Set response time if first time allocated
    if (currentProcess.responseTime === -1) {
      currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
    }
    
    // Calculate execution time for this quantum
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime || 0);
    
    // Add to timeline
    timeline.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime: currentTime + executionTime,
      colorIndex: currentProcess.colorIndex
    });
    
    // Update current time
    currentTime += executionTime;
    
    // Update remaining time
    currentProcess.remainingTime = (currentProcess.remainingTime || 0) - executionTime;
    
    // Check for newly arrived processes during this time quantum
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift()!);
    }
    
    // Check if process completed
    if (currentProcess.remainingTime <= 0) {
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
      
      completedProcesses.push({...currentProcess});
    } else {
      // Put back in ready queue
      readyQueue.push(currentProcess);
    }
  }
  
  return {
    timeline,
    processInfo: completedProcesses
  };
}

// Priority Scheduling Algorithm
export function priorityScheduling(processes: Process[]): SchedulingResult {
  const processQueue = [...processes];
  const completedProcesses: Process[] = [];
  const timeline: TimelineBlock[] = [];
  
  // Sort processes by arrival time initially
  processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  const readyQueue: Process[] = [];
  
  while (processQueue.length > 0 || readyQueue.length > 0) {
    // Move arrived processes to ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift()!);
    }
    
    if (readyQueue.length === 0) {
      // No processes in ready queue, jump to next arrival
      currentTime = processQueue[0].arrivalTime;
      continue;
    }
    
    // Sort ready queue by priority (higher number = higher priority)
    readyQueue.sort((a, b) => b.priority - a.priority);
    
    // Get next process to execute
    const currentProcess = readyQueue.shift()!;
    
    // Set response time
    currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
    
    // Add to timeline
    timeline.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime: currentTime + currentProcess.burstTime,
      colorIndex: currentProcess.colorIndex
    });
    
    // Update current time
    currentTime += currentProcess.burstTime;
    
    // Calculate completion time
    currentProcess.completionTime = currentTime;
    
    // Calculate turnaround time
    currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
    
    // Calculate waiting time
    currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
    
    // Add to completed processes
    completedProcesses.push(currentProcess);
  }
  
  return {
    timeline,
    processInfo: completedProcesses
  };
}

// Highest Response Ratio Next (HRRN) Algorithm
export function hrrn(processes: Process[]): SchedulingResult {
  const processQueue = [...processes];
  const completedProcesses: Process[] = [];
  const timeline: TimelineBlock[] = [];
  
  // Sort processes by arrival time initially
  processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  const readyQueue: Process[] = [];
  
  while (processQueue.length > 0 || readyQueue.length > 0) {
    // Move arrived processes to ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift()!);
    }
    
    if (readyQueue.length === 0) {
      // No processes in ready queue, jump to next arrival
      currentTime = processQueue[0].arrivalTime;
      continue;
    }
    
    // Calculate response ratio for each process in ready queue
    // Response Ratio = (Waiting Time + Burst Time) / Burst Time
    readyQueue.forEach(process => {
      const waitingTime = currentTime - process.arrivalTime;
      process.responseRatio = (waitingTime + process.burstTime) / process.burstTime;
    });
    
    // Sort ready queue by response ratio (highest first)
    readyQueue.sort((a, b) => (b.responseRatio || 0) - (a.responseRatio || 0));
    
    // Get next process to execute
    const currentProcess = readyQueue.shift()!;
    
    // Set response time
    currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
    
    // Add to timeline
    timeline.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime: currentTime + currentProcess.burstTime,
      colorIndex: currentProcess.colorIndex
    });
    
    // Update current time
    currentTime += currentProcess.burstTime;
    
    // Calculate completion time
    currentProcess.completionTime = currentTime;
    
    // Calculate turnaround time
    currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
    
    // Calculate waiting time
    currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
    
    // Add to completed processes
    completedProcesses.push(currentProcess);
  }
  
  return {
    timeline,
    processInfo: completedProcesses
  };
}

// Main function to run the selected algorithm
export function runAlgorithm(
  algorithm: AlgorithmType, 
  processes: Process[], 
  timeQuantum: number
): SchedulingResult {
  // Create deep copy of processes to avoid modifying the original
  const processesCopy = JSON.parse(JSON.stringify(processes));
  
  switch (algorithm) {
    case 'fcfs':
      return fcfs(processesCopy);
    case 'sjf':
      return sjf(processesCopy);
    case 'srtf':
      return srtf(processesCopy);
    case 'rr':
      return roundRobin(processesCopy, timeQuantum);
    case 'priority':
      return priorityScheduling(processesCopy);
    case 'hrrn':
      return hrrn(processesCopy);
    default:
      return fcfs(processesCopy);
  }
}