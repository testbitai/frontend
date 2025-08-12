import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  className = '', 
  color = 'blue' 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

interface SimpleBarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  maxValue?: number;
  height?: number;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  maxValue, 
  height = 200 
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, index) => {
        const barHeight = (item.value / max) * (height - 40); // Leave space for labels
        
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="text-xs font-medium mb-1">
              {item.value}
            </div>
            <div 
              className={`w-full rounded-t ${item.color || 'bg-blue-500'} transition-all duration-300`}
              style={{ height: `${barHeight}px` }}
            />
            <div className="text-xs text-gray-600 mt-2 text-center">
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface SimpleLineChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  height?: number;
  color?: string;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ 
  data, 
  height = 200, 
  color = '#3b82f6' 
}) => {
  if (data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxValue - item.value) / range) * 80 + 10; // 10% padding top/bottom
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          points={points}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = ((maxValue - item.value) / range) * 80 + 10;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1"
              fill={color}
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        {data.map((item, index) => (
          <span key={index} className="text-center">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showValue?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  showValue = true,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};
