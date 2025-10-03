
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const AccessRestrictionCard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <CardTitle className="text-red-600">Access Restricted</CardTitle>
          <CardDescription>
            This page is only accessible to System Administrators.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Contact your administrator if you need access to system field mappings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessRestrictionCard;
