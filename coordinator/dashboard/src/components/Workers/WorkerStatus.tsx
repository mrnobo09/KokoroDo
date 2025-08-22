import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { Worker } from "../../types/Workers";

interface WorkerStatusProps {
  worker: Worker;
}

// Mini Pie Chart Component for utilization
const UtilizationPieChart: React.FC<{
  percentage: number;
  label: string;
  color?: string;
}> = ({ percentage, label, color = "#0DE1D1" }) => {
  const data = [
    { name: 'Used', value: percentage },
    { name: 'Free', value: 100 - percentage }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={18}
              outerRadius={30}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#2A3441" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-[#ABBFCF]">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <span className="text-xs text-[#ABBFCF] mt-1 text-center">{label}</span>
    </div>
  );
};

const WorkerStatus: React.FC<WorkerStatusProps> = ({ worker }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Get primary GPU (first one) for main display
  const primaryGpu = worker.gpus?.[0];

  // Format VRAM usage percentage if GPU exists
  const getVramUsagePercent = () => {
    if (!primaryGpu || !primaryGpu.vram_total_gb || primaryGpu.vram_total_gb === 0) return 0;
    return (primaryGpu.vram_used_gb! / primaryGpu.vram_total_gb) * 100;
  };

  return (
    <div 
      className="bg-[#1A2535] rounded-lg p-4 relative transition-all duration-300 hover:shadow-lg hover:shadow-[#0DE1D1]/10 cursor-pointer"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Header with gradient title */}
      <div className="mb-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-[#0DE1D1] to-[#146799] bg-clip-text text-transparent truncate">
          {worker.host_name}
        </h3>
        <p className="text-sm text-[#ABBFCF]">{worker.ip_address}</p>
      </div>

      {/* Main utilization charts */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <UtilizationPieChart 
          percentage={worker.cpu.usage_percent} 
          label="CPU" 
          color="#0DE1D1"
        />
        <UtilizationPieChart 
          percentage={worker.ram.usage_percent} 
          label="RAM" 
          color="#146799"
        />
        <UtilizationPieChart 
          percentage={worker.disk.usage_percent} 
          label="Disk" 
          color="#22D3EE"
        />
        {primaryGpu ? (
          <UtilizationPieChart 
            percentage={primaryGpu.utilization_percent || 0} 
            label="GPU" 
            color="#06B6D4"
          />
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-[#2A3441] rounded-full">
              <span className="text-xs text-[#ABBFCF]">No GPU</span>
            </div>
            <span className="text-xs text-[#ABBFCF] mt-1">GPU</span>
          </div>
        )}
      </div>

      {/* Quick info badges */}
      <div className="flex flex-wrap gap-2 text-xs text-[#ABBFCF]">
        <span className="bg-[#2A3441] px-2 py-1 rounded truncate">
          {worker.os}
        </span>
        {primaryGpu && (
          <span className="bg-[#2A3441] px-2 py-1 rounded truncate">
            {primaryGpu.vendor} {primaryGpu.name.replace('NVIDIA GeForce', 'GTX')}
          </span>
        )}
      </div>

      {/* Detailed hover overlay */}
      {showDetails && (
        <div className="absolute inset-0 bg-[#1A2535]/98 backdrop-blur-sm rounded-lg p-4 z-10 overflow-y-auto">
          <div className="space-y-4">
            {/* System Info */}
            <div className="border-b border-[#2A3441] pb-3">
              <h4 className="text-sm font-semibold text-[#0DE1D1] mb-2">System Details</h4>
              <div className="space-y-1 text-xs text-[#ABBFCF]">
                <div><span className="text-[#0DE1D1]">OS:</span> {worker.os}</div>
                <div><span className="text-[#0DE1D1]">Version:</span> {worker.os_version.split(' ').slice(0, 3).join(' ')}</div>
                <div><span className="text-[#0DE1D1]">Python:</span> {worker.python_version}</div>
              </div>
            </div>

            {/* CPU Details */}
            <div className="border-b border-[#2A3441] pb-3">
              <h4 className="text-sm font-semibold text-[#0DE1D1] mb-2">CPU ({worker.cpu.usage_percent.toFixed(1)}%)</h4>
              <div className="space-y-1 text-xs text-[#ABBFCF]">
                <div className="break-words">{worker.cpu.model}</div>
                <div><span className="text-[#0DE1D1]">Cores:</span> {worker.cpu.cores} cores, {worker.cpu.threads} threads</div>
                {worker.cpu.frequency_mhz && (
                  <div><span className="text-[#0DE1D1]">Frequency:</span> {worker.cpu.frequency_mhz.toFixed(0)} MHz</div>
                )}
              </div>
            </div>

            {/* Memory & Storage */}
            <div className="border-b border-[#2A3441] pb-3">
              <h4 className="text-sm font-semibold text-[#0DE1D1] mb-2">Memory & Storage</h4>
              <div className="space-y-1 text-xs text-[#ABBFCF]">
                <div><span className="text-[#0DE1D1]">RAM:</span> {worker.ram.used_gb.toFixed(1)}GB / {worker.ram.total_gb.toFixed(1)}GB ({worker.ram.usage_percent.toFixed(1)}%)</div>
                <div><span className="text-[#0DE1D1]">Disk:</span> {worker.disk.used_gb.toFixed(1)}GB / {worker.disk.total_gb.toFixed(1)}GB ({worker.disk.usage_percent.toFixed(1)}%)</div>
              </div>
            </div>

            {/* GPU Details */}
            {worker.gpus.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[#0DE1D1] mb-2">
                  GPU{worker.gpus.length > 1 ? 's' : ''} ({worker.gpus.length})
                </h4>
                <div className="space-y-3">
                  {worker.gpus.map((gpu, index) => (
                    <div key={index} className="bg-[#2A3441] p-3 rounded text-xs text-[#ABBFCF]">
                      <div className="font-medium text-[#0DE1D1] mb-1">{gpu.vendor} {gpu.name}</div>
                      <div className="space-y-1">
                        <div><span className="text-[#0DE1D1]">Driver:</span> {gpu.driver}</div>
                        <div><span className="text-[#0DE1D1]">Utilization:</span> {gpu.utilization_percent || 0}%</div>
                        {gpu.vram_total_gb && (
                          <div><span className="text-[#0DE1D1]">VRAM:</span> {gpu.vram_used_gb?.toFixed(2) || 0}GB / {gpu.vram_total_gb.toFixed(1)}GB ({getVramUsagePercent().toFixed(1)}%)</div>
                        )}
                        {gpu.temperature_c && (
                          <div><span className="text-[#0DE1D1]">Temperature:</span> {gpu.temperature_c}°C</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerStatus;