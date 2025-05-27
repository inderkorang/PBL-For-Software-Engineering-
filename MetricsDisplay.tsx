import React from 'react';
import { SchedulingResult } from '../types';
import { Clock, Activity, Zap, BarChart2 } from 'lucide-react';

interface MetricsDisplayProps {
  result: SchedulingResult;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ result }) => {
  // Calculate metrics
  const avgWaitingTime = result.processInfo.reduce((sum, p) => sum + p.waitingTime, 0) / result.processInfo.length;
  const avgTurnaroundTime = result.processInfo.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.processInfo.length;
  const avgResponseTime = result.processInfo.reduce((sum, p) => sum + p.responseTime, 0) / result.processInfo.length;
  
  // Calculate throughput (processes per unit time)
  const lastCompletionTime = Math.max(...result.processInfo.map(p => p.completionTime));
  const throughput = result.processInfo.length / lastCompletionTime;
  
  // Calculate CPU utilization (assuming no idle time in this implementation)
  const totalBurstTime = result.processInfo.reduce((sum, p) => sum + p.burstTime, 0);
  const cpuUtilization = (totalBurstTime / lastCompletionTime) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Avg Waiting Time</h3>
            <Clock className="h-5 w-5 opacity-80" />
          </div>
          <div className="text-2xl font-bold">{avgWaitingTime.toFixed(2)}</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Avg Turnaround</h3>
            <Activity className="h-5 w-5 opacity-80" />
          </div>
          <div className="text-2xl font-bold">{avgTurnaroundTime.toFixed(2)}</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">CPU Utilization</h3>
            <Zap className="h-5 w-5 opacity-80" />
          </div>
          <div className="text-2xl font-bold">{cpuUtilization.toFixed(1)}%</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Throughput</h3>
            <BarChart2 className="h-5 w-5 opacity-80" />
          </div>
          <div className="text-2xl font-bold">{throughput.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Detailed Process Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Process
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arrival Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Burst Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turnaround Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waiting Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.processInfo.map((process) => (
                <tr key={process.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="h-3 w-3 rounded-full mr-2" 
                        style={{ backgroundColor: `var(--color-${process.colorIndex})` }}
                      ></div>
                      {process.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{process.arrivalTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{process.burstTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{process.completionTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{process.turnaroundTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{process.waitingTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{process.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;