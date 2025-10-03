
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ValueTypeBadgeProps {
  valueType: string;
}

const ValueTypeBadge = ({ valueType }: ValueTypeBadgeProps) => {
  switch (valueType) {
    case 'Today':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Today</Badge>;
    case 'Retirement':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Retirement</Badge>;
    case 'Input':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Input</Badge>;
    case 'Rate':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Rate</Badge>;
    case 'Year 1 Amount':
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Year 1</Badge>;
    case 'Input/Auto-Calculate':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Auto-Calc</Badge>;
    case 'Current Value':
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Current</Badge>;
    default:
      return <Badge variant="outline">{valueType}</Badge>;
  }
};

export default ValueTypeBadge;
