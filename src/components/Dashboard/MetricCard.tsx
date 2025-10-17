

import React from 'react';
import SFMCodeBadge from '@/components/SystemFields/SFMCodeBadge';

interface MetricCardProps {
  title: string;
  value: string;
  headerBgColor?: string;
  valueTextColor?: string;
  titleTextColor?: string;
  opacity?: string;
  style?: React.CSSProperties;
  sfmCode?: string;
  fontWeight?: string;
  valueStyle?: string;
}

export function MetricCard({ title, value, headerBgColor, valueTextColor, titleTextColor = "text-white", opacity = "opacity-100", style, sfmCode, fontWeight = "font-semibold", valueStyle }: MetricCardProps) {
  return (
    <div className={`bg-white border rounded-lg overflow-hidden ${opacity}`}>
      <div className={`${headerBgColor} p-2 text-center min-h-[48px] flex items-center justify-center relative`} style={style}>
        <p className={`${titleTextColor} text-xs font-medium`}>{title}</p>
      </div>
      <div className="p-3 text-center bg-white">
        <p 
          className={`text-lg ${fontWeight} ${valueTextColor} ${valueStyle}`}
          style={valueStyle === "text-stroke-gray" ? {
            textShadow: '0.25px 0.25px 0 #9ca3af, -0.25px -0.25px 0 #9ca3af, 0.25px -0.25px 0 #9ca3af, -0.25px 0.25px 0 #9ca3af'
          } : undefined}
        >
          {value}
        </p>
        {sfmCode && (
          <div className="mt-1 flex justify-center">
            <SFMCodeBadge sfmId={sfmCode} />
          </div>
        )}
      </div>
    </div>
  );
}

