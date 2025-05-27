import React, { useEffect, useRef } from 'react';
import { AlgorithmType, SchedulingResult } from '../types';
import Chart from 'chart.js/auto';

interface ComparisonChartProps {
  results: Record<AlgorithmType, SchedulingResult | null>;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ results }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Prepare data for chart
    const labels = Object.keys(results).map(getAlgorithmName);
    
    const waitingTimeData = Object.values(results).map(result => {
      if (!result) return 0;
      return result.processInfo.reduce((sum, p) => sum + p.waitingTime, 0) / result.processInfo.length;
    });
    
    const turnaroundTimeData = Object.values(results).map(result => {
      if (!result) return 0;
      return result.processInfo.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.processInfo.length;
    });
    
    // Create chart
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Avg Waiting Time',
            data: waitingTimeData,
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1
          },
          {
            label: 'Avg Turnaround Time',
            data: turnaroundTimeData,
            backgroundColor: 'rgba(139, 92, 246, 0.7)',
            borderColor: 'rgba(139, 92, 246, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Time Units'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Algorithms'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Algorithm Performance Comparison'
          }
        }
      }
    });
    
    return () => {
      chart.destroy();
    };
  }, [results]);
  
  const getAlgorithmName = (algorithm: string): string => {
    const names: Record<string, string> = {
      fcfs: 'FCFS',
      sjf: 'SJF',
      srtf: 'SRTF',
      rr: 'Round Robin',
      priority: 'Priority',
      hrrn: 'HRRN'
    };
    return names[algorithm] || algorithm;
  };

  return (
    <div className="h-[300px] bg-gray-50 rounded-lg p-4">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ComparisonChart;