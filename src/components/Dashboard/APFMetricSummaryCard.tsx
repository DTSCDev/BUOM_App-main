import React from 'react';
import { systemFields } from '@/data/systemFields';

interface APFMetricSummaryCardProps {
  title: string;
  value: string;
  headerBgColor: string;
  valueTextColor: string;
  opacity?: string;
  style?: React.CSSProperties;
  sfmCode?: string;
}

export function APFMetricSummaryCard({ title, value, headerBgColor, valueTextColor, opacity = "opacity-100", style, sfmCode }: APFMetricSummaryCardProps) {
  const sfmField = sfmCode ? systemFields.find(field => field.sfmId === sfmCode) : null;

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className={`${headerBgColor} p-2 text-center min-h-[48px] flex items-center justify-center relative`} style={style}>
        <p className="text-white text-xs font-medium">{title}</p>
        {sfmCode && (
          <div className="absolute bottom-1 right-1">
            <span className="text-white text-[8px] opacity-40 font-mono border border-gray-400 px-1 py-0.5 rounded">
              {sfmCode.replace('SFM-', '')}
            </span>
            {sfmField && (
              <div className="text-white text-[6px] opacity-30 mt-0.5 max-w-[80px] truncate">
                {sfmField.pageName}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-3 text-center bg-white">
        <p className={`${valueTextColor} text-lg font-semibold ${opacity}`}>{value}</p>
        {sfmField && (
          <div className="text-xs text-gray-500 mt-1 truncate">
            {sfmField.cardName}
          </div>
        )}
      </div>
    </div>
  );
}