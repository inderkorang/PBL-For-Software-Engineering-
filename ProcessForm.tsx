import React, { useState } from 'react';
import { Clock, Activity, ArrowUp } from 'lucide-react';

interface ProcessFormProps {
  onAddProcess: (process: {
    id: string;
    arrivalTime: number;
    burstTime: number;
    priority: number;
  }) => void;
  timeQuantum: number;
  onTimeQuantumChange: (value: number) => void;
}

const ProcessForm: React.FC<ProcessFormProps> = ({ 
  onAddProcess, 
  timeQuantum, 
  onTimeQuantumChange 
}) => {
  const [processId, setProcessId] = useState<string>('P1');
  const [arrivalTime, setArrivalTime] = useState<number>(0);
  const [burstTime, setBurstTime] = useState<number>(5);
  const [priority, setPriority] = useState<number>(1);
  const [processCounter, setProcessCounter] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!processId.trim()) {
      alert('Process ID cannot be empty');
      return;
    }
    
    onAddProcess({
      id: processId,
      arrivalTime,
      burstTime,
      priority
    });
    
    // Increment counter for next process ID
    setProcessCounter(prev => prev + 1);
    setProcessId(`P${processCounter + 1}`);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Process ID
            </label>
            <input
              type="text"
              value={processId}
              onChange={(e) => setProcessId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Process ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Time
            </label>
            <input
              type="number"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Arrival Time"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Burst Time
            </label>
            <input
              type="number"
              value={burstTime}
              onChange={(e) => setBurstTime(parseInt(e.target.value) || 1)}
              min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Burst Time"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
              min={1}
              max={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Priority"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Activity className="h-4 w-4" /> Add Process
        </button>
      </form>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time Quantum (for Round Robin)
        </label>
        <input
          type="number"
          value={timeQuantum}
          onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 1)}
          min={1}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
};

export default ProcessForm;