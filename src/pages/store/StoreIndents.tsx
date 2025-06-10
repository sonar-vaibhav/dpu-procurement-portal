
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const StoreIndents: React.FC = () => {
  const indents = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      department: 'Biology',
      amount: '₹25,000',
      date: '2024-01-16',
      status: 'verified',
      stockStatus: 'available'
    },
    {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      department: 'Computer Science',
      amount: '₹45,000',
      date: '2024-01-15',
      status: 'pending_verification',
      stockStatus: 'checking'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Store Indents"
        subtitle="Track all indents and stock verification status"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Verification Records</CardTitle>
            <CardDescription>All indents processed by store department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {indents.map((indent) => (
                <div key={indent.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{indent.title}</h4>
                        <Badge className={getStatusColor(indent.status)}>
                          {indent.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">ID:</span> {indent.id}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {indent.department}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> {indent.amount}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {indent.date}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StoreIndents;
