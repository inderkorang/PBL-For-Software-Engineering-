import React from 'react';
import { Process } from '../types';
import { Clock, Activity, ArrowUp, X } from 'lucide-react';

interface ProcessListProps {
  processes: Process[];
  colors: string[];
  onRemoveProcess: (index: number) => void;
}

const ProcessList: React.FC<ProcessListProps> = ({ 
  processes, 
  colors, 
  onRemoveProcess 
}) => {
  if (processes.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 mt-4">
        <div className="text-center text-gray-400 py-4">
          No processes added yet
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-2 mt-4 max-h-[200px] overflow-y-auto">
      {processes.map((process, index) => (
        <div 
          key={process.id}
          className="flex justify-between items-center p-2 mb-2 bg-white rounded-lg border-l-4 hover:translate-x-1 transition-transform"
          style={{ borderLeftColor: colors[process.colorIndex] }}
        >
          <div className="flex gap-3 text-sm">
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-gray-400" /> {process.id}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" /> A:{process.arrivalTime}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" /> B:{process.burstTime}
            </span>
            <span className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3 text-gray-400" /> P:{process.priority}
            </span>
          </div>
          <button 
            onClick={() => onRemoveProcess(index)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProcessList;