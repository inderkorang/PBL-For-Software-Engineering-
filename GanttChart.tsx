import React, { useEffect, useRef } from 'react';
import { TimelineBlock } from '../types';

interface GanttChartProps {
  timeline: TimelineBlock[];
  colors: string[];
}

const GanttChart: React.FC<GanttChartProps> = ({ timeline, colors }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current || timeline.length === 0) return;
    
    // Find the total time span
    const endTime = Math.max(...timeline.map(block => block.endTime));
    
    // Create a map of process IDs to track unique processes
    const processMap = new Map<string, boolean>();
    timeline.forEach(block => {
      processMap.set(block.processId, true);
    });
    
    // Create legend items
    const legendItems = Array.from(processMap.keys()).map(processId => {
      const block = timeline.find(b => b.processId === processId);
      return {
        id: processId,
        colorIndex: block ? block.colorIndex : 0
      };
    });
    
    // Render the chart
    renderGanttChart(timeline, endTime, legendItems);
  }, [timeline, colors]);
  
  const renderGanttChart = (
    timeline: TimelineBlock[], 
    totalTime: number,
    legendItems: { id: string, colorIndex: number }[]
  ) => {
    if (!chartRef.current) return;
    
    // Clear previous chart
    chartRef.current.innerHTML = '';
    
    // Create timeline container
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'gantt-timeline';
    
    // Create blocks
    timeline.forEach(block => {
      const width = ((block.endTime - block.startTime) / totalTime) * 100;
      
      const blockElement = document.createElement('div');
      blockElement.className = 'gantt-block';
      blockElement.style.width = `${width}%`;
      blockElement.style.backgroundColor = colors[block.colorIndex];
      blockElement.textContent = block.processId;
      blockElement.title = `${block.processId}: ${block.startTime} - ${block.endTime}`;
      
      timelineContainer.appendChild(blockElement);
    });
    
    // Create time labels
    const timeLabelsContainer = document.createElement('div');
    timeLabelsContainer.className = 'timeline-labels';
    
    // Add time markers (every 2 time units or appropriate interval)
    const interval = Math.max(1, Math.ceil(totalTime / 10));
    for (let i = 0; i <= totalTime; i += interval) {
      const labelElement = document.createElement('div');
      labelElement.className = 'timeline-label';
      labelElement.textContent = i.toString();
      labelElement.style.width = `${(interval / totalTime) * 100}%`;
      
      timeLabelsContainer.appendChild(labelElement);
    }
    
    // Create legend
    const legendContainer = document.createElement('div');
    legendContainer.className = 'process-legend mt-4';
    
    const legendTitle = document.createElement('h3');
    legendTitle.className = 'text-sm font-medium text-gray-700 mb-2';
    legendTitle.textContent = 'Process Legend';
    legendContainer.appendChild(legendTitle);
    
    const legendItemsContainer = document.createElement('div');
    legendItemsContainer.className = 'legend-items flex flex-wrap gap-3';
    
    legendItems.forEach(item => {
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item flex items-center gap-1';
      
      const colorBox = document.createElement('div');
      colorBox.className = 'w-4 h-4 rounded';
      colorBox.style.backgroundColor = colors[item.colorIndex];
      
      const label = document.createElement('span');
      label.className = 'text-sm text-gray-700';
      label.textContent = item.id;
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      legendItemsContainer.appendChild(legendItem);
    });
    
    legendContainer.appendChild(legendItemsContainer);
    
    // Add everything to the chart container
    chartRef.current.appendChild(timelineContainer);
    chartRef.current.appendChild(timeLabelsContainer);
    chartRef.current.appendChild(legendContainer);
  };

  return (
    <div className="gantt-chart" ref={chartRef}>
      {timeline.length === 0 && (
        <div className="empty-state">
          <p>No data to display</p>
        </div>
      )}
    </div>
  );
};

export default GanttChart;