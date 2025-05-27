import React from 'react';
import { AlgorithmType } from '../types';

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onSelectAlgorithm: (algorithm: AlgorithmType) => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ 
  selectedAlgorithm, 
  onSelectAlgorithm 
}) => {
  const algorithms = [
    { id: 'fcfs', name: 'FCFS', description: 'First Come First Serve' },
    { id: 'sjf', name: 'SJF', description: 'Shortest Job First' },
    { id: 'srtf', name: 'SRTF', description: 'Shortest Remaining Time' },
    { id: 'rr', name: 'Round Robin', description: 'Time Slice Scheduling' },
    { id: 'priority', name: 'Priority', description: 'Priority Scheduling' },
    { id: 'hrrn', name: 'HRRN', description: 'Highest Response Ratio' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {algorithms.map((algorithm) => (
        <div
          key={algorithm.id}
          className={`
            p-4 border-2 rounded-xl cursor-pointer transition-all
            ${selectedAlgorithm === algorithm.id 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }
          `}
          onClick={() => onSelectAlgorithm(algorithm.id as AlgorithmType)}
        >
          <h4 className="font-semibold text-gray-800">{algorithm.name}</h4>
          <p className="text-sm text-gray-500">{algorithm.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AlgorithmSelector;