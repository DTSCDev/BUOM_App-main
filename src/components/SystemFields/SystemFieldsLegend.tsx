
import React from 'react';
import ValueTypeBadge from './ValueTypeBadge';
import { SFM_CATEGORY_CONFIG } from './SFMCategorization';

const SystemFieldsLegend = () => {
  return (
    <div className="mt-6 space-y-4">
      {/* Color Coding Legend */}
      <div className="p-4 bg-green-50 dark:bg-green-900/40 rounded-lg">
        <h3 className="font-semibold mb-3">SFM Color Coding Legend:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(SFM_CATEGORY_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${config.color}`}></div>
              <span className={`text-sm font-medium ${config.textColor}`}>
                {config.name}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-green-700 dark:text-green-300 mt-2">
          Description text is colored based on the financial metric category for easy identification.
        </p>
      </div>

      {/* Usage Examples */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          SFM ID Usage Examples:
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-blue-600 dark:text-blue-400">SFM-001</span>
            <span className="text-gray-600 dark:text-gray-400">=</span>
            <span>Date of Birth Input</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-blue-600 dark:text-blue-400">SFM-004</span>
            <span className="text-gray-600 dark:text-gray-400">=</span>
            <span>Pension Contributions</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-blue-600 dark:text-blue-400">SFM-020</span>
            <span className="text-gray-600 dark:text-gray-400">=</span>
            <span>Pay Days Remaining</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-green-600 dark:text-green-400">SFM-APF-1101-1</span>
            <span className="text-gray-600 dark:text-gray-400">=</span>
            <span>APF Year 1 Sponsorship Amount</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-green-600 dark:text-green-400">SFM-APF-1105-5</span>
            <span className="text-gray-600 dark:text-gray-400">=</span>
            <span>APF Year 5 Sponsorship Amount</span>
          </div>
        </div>
        
        <h3 className="font-semibold mb-2">Value Type Legend:</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ValueTypeBadge valueType="Today" /> <span className="text-sm">Current purchasing power</span>
          </div>
          <div className="flex items-center gap-2">
            <ValueTypeBadge valueType="Retirement" /> <span className="text-sm">Inflation-adjusted at retirement</span>
          </div>
          <div className="flex items-center gap-2">
            <ValueTypeBadge valueType="Input" /> <span className="text-sm">User input field</span>
          </div>
          <div className="flex items-center gap-2">
            <ValueTypeBadge valueType="Rate" /> <span className="text-sm">Percentage parameter</span>
          </div>
          <div className="flex items-center gap-2">
            <ValueTypeBadge valueType="Year 1" /> <span className="text-sm">First year amount (escalates)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemFieldsLegend;
