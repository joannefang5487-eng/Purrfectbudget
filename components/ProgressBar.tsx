import React from 'react';
import { COLORS } from '../constants';

interface ProgressBarProps {
  current: number;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, max }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  let color = COLORS.success;
  if (percentage > 75) color = COLORS.warning;
  if (percentage > 95) color = COLORS.danger;

  return (
    <div className="w-full h-4 bg-[#E8D5C8] rounded-full overflow-hidden shadow-inner mt-4 relative">
        <div 
            className="h-full transition-all duration-700 ease-out rounded-full"
            style={{ width: `${percentage}%`, backgroundColor: color }}
        />
        {/* Pattern overlay for texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
    </div>
  );
};

export default ProgressBar;
