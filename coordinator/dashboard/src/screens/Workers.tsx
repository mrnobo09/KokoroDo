import React, { useState, useEffect } from "react";
import WorkerStatus from "../components/Workers/WorkerStatus";
import type { Worker } from "../types/Workers";

const Workers: React.FC = () => {
  // State to hold worker data as array
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/get_workers");
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle both array and object formats
      const workerArray = Array.isArray(data) ? data : Object.values(data);
      setWorkers(workerArray as Worker[]);
      console.log("Received workers data:", data);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setConnectionStatus('disconnected');
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus('disconnected');
    };

    // Cleanup WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0DE1D1] to-[#146799] bg-clip-text text-transparent">
          Workers Status
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-[#ABBFCF]">
            {workers.length} worker{workers.length !== 1 ? 's' : ''} online
          </p>
          <div className="flex items-center gap-2">
            <div 
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-[#ABBFCF] capitalize">{connectionStatus}</span>
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {workers.map((worker, index) => (
          <WorkerStatus 
            key={worker.ip_address || index} 
            worker={worker} 
          />
        ))}
      </div>

      {/* Empty State */}
      {workers.length === 0 && connectionStatus === 'connected' && (
        <div className="text-center py-12">
          <div className="text-[#ABBFCF] text-lg">No workers connected</div>
          <div className="text-[#ABBFCF]/60 text-sm mt-2">
            Waiting for workers to register...
          </div>
        </div>
      )}

      {/* Connection Error State */}
      {connectionStatus === 'disconnected' && (
        <div className="text-center py-12">
          <div className="text-red-400 text-lg">Connection Lost</div>
          <div className="text-[#ABBFCF]/60 text-sm mt-2">
            Unable to connect to WebSocket server
          </div>
        </div>
      )}
    </div>
  );
};

export default Workers;