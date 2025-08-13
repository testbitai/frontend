import React from 'react';

interface DebugApiResponseProps {
  data: any;
  title?: string;
}

const DebugApiResponse: React.FC<DebugApiResponseProps> = ({ data, title = "API Response" }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
      <h4 className="font-bold text-sm text-gray-700 mb-2">{title}</h4>
      <pre className="text-xs text-gray-600 overflow-auto max-h-40">
        {JSON.stringify(data, null, 2)}
      </pre>
      <div className="mt-2 text-xs text-gray-500">
        <p>Type: {Array.isArray(data) ? 'Array' : typeof data}</p>
        {Array.isArray(data) && <p>Length: {data.length}</p>}
      </div>
    </div>
  );
};

export default DebugApiResponse;
