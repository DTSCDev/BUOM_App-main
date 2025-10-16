import React from 'react';
import { allPageBasedSFMFields } from '@/data/systemFields/pageBasedSFMFields';

type BadgeProps = {
  sfmId: string;
  className?: string;
};

const SFMCodeBadge: React.FC<BadgeProps> = ({ sfmId, className = '' }) => {
  const sfmField = allPageBasedSFMFields.find(field => field.sfmId === sfmId);

  return (
    <div className={`text-[8px] text-gray-500 opacity-80 font-mono px-1 py-0.5 rounded mt-1 ${className}`}>
      <div>{sfmId.replace('SFM-', '')}</div>
    </div>
  );
};

export default SFMCodeBadge;