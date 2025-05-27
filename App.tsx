import React, { useState } from 'react';
import { Cpu, Clock, Activity, BarChart2, Play, Brain, FileText } from 'lucide-react';
import AlgorithmSelector from './components/AlgorithmSelector';
import ProcessForm from './components/ProcessForm';
import ProcessList from './components/ProcessList';
import GanttChart from './components/GanttChart';
import MetricsDisplay from './components/MetricsDisplay';
import ComparisonChart from './components/ComparisonChart';
import { Process, SchedulingResult, AlgorithmType } from './types';
import { runAlgorithm } from './algorithms';

const App: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('fcfs');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [comparisonResults, setComparisonResults] = useState<Record<AlgorithmType, SchedulingResult | null>>({
    fcfs: null,
    sjf: null,
    srtf: null,
    rr: null,
    priority: null,
    hrrn: null
  });
  const [status, setStatus] = useState<string>('Ready to schedule processes');

  const colors = [
    '#6366f1', '#0ea5e9', '#8b5cf6', '#10b981', 
    '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', 
    '#84cc16', '#14b8a6'
  ];

  const addProcess = (process: Omit<Process, 'colorIndex'>) => {
    const colorIndex = processes.length % colors.length;
    const newProcess: Process = {
      ...process,
      colorIndex,
      waitingTime: 0,
      turnaroundTime: 0,
      responseTime: -1,
      completionTime: 0
    };
    
    setProcesses([...processes, newProcess]);
    setStatus(`Process ${process.id} added successfully`);
  };

  const removeProcess = (index: number) => {
    const newProcesses = [...processes];
    const removedProcess = newProcesses[index];
    newProcesses.splice(index, 1);
    setProcesses(newProcesses);
    setStatus(`Process ${removedProcess.id} removed`);
  };

  const clearProcesses = () => {
    setProcesses([]);
    setResult(null);
    setShowComparison(false);
    setStatus('All processes cleared');
  };

  const generateRandomProcesses = () => {
    const numProcesses = Math.floor(Math.random() * 6) + 3; // 3-8 processes
    const newProcesses: Process[] = [];
    
    for (let i = 0; i < numProcesses; i++) {
      const processId = `P${i + 1}`;
      const arrivalTime = Math.floor(Math.random() * 10); // 0-9
      const burstTime = Math.floor(Math.random() * 10) + 1; // 1-10
      const priority = Math.floor(Math.random() * 10) + 1; // 1-10
      const colorIndex = i % colors.length;
      
      newProcesses.push({
        id: processId,
        arrivalTime,
        burstTime,
        priority,
        colorIndex,
        waitingTime: 0,
        turnaroundTime: 0,
        responseTime: -1,
        completionTime: 0
      });
    }
    
    setProcesses(newProcesses);
    setStatus(`Generated ${numProcesses} random processes`);
  };

  const runSelectedAlgorithm = () => {
    if (processes.length === 0) {
      setStatus('Please add processes first');
      return;
    }
    
    setStatus(`Running ${getAlgorithmName(selectedAlgorithm)}...`);
    
    // Create deep copy of processes to avoid modifying the original
    const processesCopy = JSON.parse(JSON.stringify(processes));
    const result = runAlgorithm(selectedAlgorithm, processesCopy, timeQuantum);
    
    if (result) {
      setResult(result);
      setStatus(`${getAlgorithmName(selectedAlgorithm)} completed`);
    } else {
      setStatus('Failed to run algorithm');
    }
  };

  const compareAllAlgorithms = () => {
    if (processes.length === 0) {
      setStatus('Please add processes first');
      return;
    }
    
    setStatus('Comparing all algorithms...');
    
    const algorithms: AlgorithmType[] = ['fcfs', 'sjf', 'srtf', 'rr', 'priority', 'hrrn'];
    const results: Record<AlgorithmType, SchedulingResult | null> = {
      fcfs: null,
      sjf: null,
      srtf: null,
      rr: null,
      priority: null,
      hrrn: null
    };
    
    algorithms.forEach(algorithm => {
      // Create deep copy of processes to avoid modifying the original
      const processesCopy = JSON.parse(JSON.stringify(processes));
      const result = runAlgorithm(algorithm, processesCopy, timeQuantum);
      results[algorithm] = result;
    });
    
    setComparisonResults(results);
    setShowComparison(true);
    setStatus('Algorithm comparison completed');
  };

  const getAlgorithmName = (algorithm: AlgorithmType): string => {
    const names: Record<AlgorithmType, string> = {
      fcfs: 'First Come First Serve',
      sjf: 'Shortest Job First',
      srtf: 'Shortest Remaining Time First',
      rr: 'Round Robin',
      priority: 'Priority Scheduling',
      hrrn: 'Highest Response Ratio Next'
    };
    return names[algorithm];
  };

  const selectAIAlgorithm = () => {
    if (processes.length === 0) {
      setStatus('Please add processes first');
      return;
    }
    
    setStatus('AI is analyzing process characteristics...');
    
    // Simple AI logic to select the best algorithm based on process characteristics
    const avgBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0) / processes.length;
    const burstTimeVariance = processes.reduce((sum, p) => sum + Math.pow(p.burstTime - avgBurstTime, 2), 0) / processes.length;
    const maxArrivalTime = Math.max(...processes.map(p => p.arrivalTime));
    
    let recommendedAlgorithm: AlgorithmType = 'fcfs';
    
    // If all processes arrive at the same time
    if (processes.every(p => p.arrivalTime === processes[0].arrivalTime)) {
      // If burst times vary significantly
      if (burstTimeVariance > 5) {
        recommendedAlgorithm = 'sjf';
      } else {
        recommendedAlgorithm = 'fcfs';
      }
    } 
    // If processes arrive at different times
    else {
      // If burst times vary significantly
      if (burstTimeVariance > 5) {
        recommendedAlgorithm = 'srtf';
      } 
      // If arrival times are spread out
      else if (maxArrivalTime > 10) {
        recommendedAlgorithm = 'hrrn';
      }
      // If many processes with similar characteristics
      else if (processes.length > 5) {
        recommendedAlgorithm = 'rr';
      }
      // If priority is important (just using this as a fallback)
      else {
        recommendedAlgorithm = 'priority';
      }
    }
    
    setSelectedAlgorithm(recommendedAlgorithm);
    setStatus(`AI recommends ${getAlgorithmName(recommendedAlgorithm)} for your processes`);
    
    // Run the recommended algorithm
    setTimeout(() => {
      runSelectedAlgorithm();
    }, 500);
  };

  const exportReport = () => {
    if (!result) {
      setStatus('No results to export');
      return;
    }

    // Calculate metrics
    const avgWaitingTime = result.processInfo.reduce((sum, p) => sum + p.waitingTime, 0) / result.processInfo.length;
    const avgTurnaroundTime = result.processInfo.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.processInfo.length;
    const avgResponseTime = result.processInfo.reduce((sum, p) => sum + p.responseTime, 0) / result.processInfo.length;
    const lastCompletionTime = Math.max(...result.processInfo.map(p => p.completionTime));
    const throughput = result.processInfo.length / lastCompletionTime;
    const totalBurstTime = result.processInfo.reduce((sum, p) => sum + p.burstTime, 0);
    const cpuUtilization = (totalBurstTime / lastCompletionTime) * 100;

    // Prepare CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add summary metrics
    csvContent += "Summary Metrics\n";
    csvContent += "Metric,Value\n";
    csvContent += `Average Waiting Time,${avgWaitingTime.toFixed(2)}\n`;
    csvContent += `Average Turnaround Time,${avgTurnaroundTime.toFixed(2)}\n`;
    csvContent += `Average Response Time,${avgResponseTime.toFixed(2)}\n`;
    csvContent += `CPU Utilization,${cpuUtilization.toFixed(1)}%\n`;
    csvContent += `Throughput,${throughput.toFixed(2)}\n\n`;

    // Add detailed process metrics
    csvContent += "Detailed Process Metrics\n";
    csvContent += "Process ID,Arrival Time,Burst Time,Completion Time,Turnaround Time,Waiting Time,Response Time\n";
    
    result.processInfo.forEach(process => {
      csvContent += `${process.id},${process.arrivalTime},${process.burstTime},${process.completionTime},${process.turnaroundTime},${process.waitingTime},${process.responseTime}\n`;
    });

    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `scheduling_report_${selectedAlgorithm}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setStatus('Report exported successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2 mb-2">
            <Cpu className="h-8 w-8" /> CPU Scheduling Algorithms
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Interactive visualization of CPU scheduling algorithms with performance metrics
          </p>
        </div>
        
        {/* Status Bar */}
        <div className="bg-white bg-opacity-95 p-4 rounded-2xl mb-6 flex justify-between items-center shadow-md animate-fade-in">
          <div>
            <span className="font-medium text-gray-700">Status:</span>{' '}
            <span id="systemStatus">{status}</span>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Process Configuration */}
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-indigo-500" /> Process Configuration
            </h2>
            
            <ProcessForm 
              onAddProcess={addProcess} 
              timeQuantum={timeQuantum}
              onTimeQuantumChange={setTimeQuantum}
            />
            
            <ProcessList 
              processes={processes} 
              colors={colors}
              onRemoveProcess={removeProcess}
            />
            
            <div className="flex flex-wrap gap-2 mt-4">
              <button 
                className="btn-secondary text-sm px-3 py-2 rounded-lg flex items-center gap-1"
                onClick={generateRandomProcesses}
              >
                <i className="fas fa-random"></i> Generate Random
              </button>
              <button 
                className="btn-secondary text-sm px-3 py-2 rounded-lg flex items-center gap-1"
                onClick={clearProcesses}
              >
                <i className="fas fa-trash-alt"></i> Clear All
              </button>
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              <button 
                className="btn-primary bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                onClick={selectAIAlgorithm}
              >
                <Brain className="h-5 w-5" /> Auto-Select Algorithm
              </button>
              <button 
                className="btn-primary bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                onClick={runSelectedAlgorithm}
              >
                <Play className="h-5 w-5" /> Run Selected Algorithm
              </button>
            </div>
          </div>
          
          {/* Algorithm Selection */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <BarChart2 className="h-5 w-5 text-indigo-500" /> Algorithm Selection
            </h2>
            
            <AlgorithmSelector 
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={setSelectedAlgorithm}
            />
            
            {showComparison && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2 mb-3">
                  <Activity className="h-5 w-5 text-indigo-500" /> Algorithm Comparison
                </h3>
                <ComparisonChart results={comparisonResults} />
              </div>
            )}
            
            <div className="mt-4 flex justify-center gap-4">
              <button 
                className="btn-secondary text-sm px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={compareAllAlgorithms}
              >
                <BarChart2 className="h-4 w-4" /> Compare All Algorithms
              </button>
              <button 
                className="btn-secondary text-sm px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={exportReport}
              >
                <FileText className="h-4 w-4" /> Export Report
              </button>
            </div>
          </div>
        </div>
        
        {/* Gantt Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 animate-slide-up">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-indigo-500" /> Gantt Chart Visualization
          </h2>
          
          {result ? (
            <GanttChart 
              timeline={result.timeline} 
              colors={colors}
            />
          ) : (
            <div className="empty-state h-32 flex flex-col items-center justify-center text-gray-400">
              <BarChart2 className="h-8 w-8 mb-2 opacity-50" />
              <p>Add processes and run scheduler to see visualization</p>
            </div>
          )}
        </div>
        
        {/* Metrics Display */}
        {result && (
          <div className="animate-fade-in">
            <MetricsDisplay result={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;