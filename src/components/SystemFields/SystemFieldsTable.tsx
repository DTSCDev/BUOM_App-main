
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SystemField } from '@/data/systemFields';
import ValueTypeBadge from './ValueTypeBadge';
import { categorizeSFMField, SFM_CATEGORY_CONFIG } from './SFMCategorization';

interface SystemFieldsTableProps {
  fields: SystemField[];
}

const SystemFieldsTable = ({ fields }: SystemFieldsTableProps) => {
  // Sort fields chronologically by SFM number
  const sortedFields = [...fields].sort((a, b) => {
    const extractNumber = (sfmId: string) => {
      const match = sfmId.match(/SFM-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };
    return extractNumber(a.sfmId) - extractNumber(b.sfmId);
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">SFM ID</TableHead>
            <TableHead className="w-[200px]">Description</TableHead>
            <TableHead>Page Name</TableHead>
            <TableHead>Card Name</TableHead>
            <TableHead>Output Value</TableHead>
            <TableHead>Correlated To</TableHead>
            <TableHead className="w-[120px]">Value Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFields.map((field, index) => {
            const category = categorizeSFMField(field.description, field.sfmId);
            const categoryConfig = SFM_CATEGORY_CONFIG[category];
            
            return (
              <TableRow key={index}>
                <TableCell className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                  {field.sfmId}
                </TableCell>
                <TableCell className={`font-medium ${categoryConfig.textColor}`}>
                  {field.description}
                </TableCell>
                <TableCell>{field.pageName}</TableCell>
                <TableCell>{field.cardName}</TableCell>
                <TableCell className="font-mono text-sm bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                  {field.outputValue}
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                  {field.correlatedTo}
                </TableCell>
                <TableCell>
                  <ValueTypeBadge valueType={field.valueType} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SystemFieldsTable;
