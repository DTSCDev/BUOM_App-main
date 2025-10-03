
import React from 'react';
import { Database, Settings, Shield } from 'lucide-react';

const SystemFieldsHeader = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
        <Database className="h-8 w-8" />
        System Fields Reference
        <Shield className="h-6 w-6 text-red-500" />
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
        Complete reference guide for all calculation outputs with SFM IDs for quick reference
      </p>
      <p className="text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
        <Settings className="h-4 w-4" />
        Cross-reference table for troubleshooting and validation
      </p>
      <div className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">
        🔒 System Administrator Access Only
      </div>
    </div>
  );
};

export default SystemFieldsHeader;
