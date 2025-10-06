

import React from 'react';
import SFMCodeBadge from '@/components/SystemFields/SFMCodeBadge';

interface MetricCardProps {
  title: string;
  value: string;
  headerBgColor: string;
  valueTextColor: string;
  opacity?: string;
  style?: React.CSSProperties;
  sfmCode?: string;
}

export function MetricCard({ title, value, headerBgColor, valueTextColor, opacity = "opacity-100", style, sfmCode }: MetricCardProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className={`${headerBgColor} p-2 text-center min-h-[48px] flex items-center justify-center relative`} style={style}>
        <p className="text-white text-xs font-medium">{title}</p>
      </div>
      <div className="p-3 text-center bg-white">
        <p className={`${valueTextColor} text-lg font-semibold ${opacity}`}>{value}</p>
        {sfmCode && (
          <div className="mt-1 flex justify-center">
            <SFMCodeBadge sfmId={sfmCode} />
          </div>
        )}
      </div>
    </div>
  );
}

