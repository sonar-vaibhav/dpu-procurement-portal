
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';

interface IndentDetails {
  id: string;
  title: string;
  status: string;
  date: string;
  amount: string;
  department: string;
  budgetHead: string;
  priority: string;
  justification: string;
  requestedBy: string;
  items: any[];
  approvalTrail: string[];
}

const StoreIndents: React.FC = () => {
  const { toast } = useToast();
  const [selectedIndent, setSelectedIndent] = useState<IndentDetails | null>(null);

  const indents = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      requestedBy: 'Dr. John Smith',
      department: 'Biology',
      amount: '₹25,000',
      date: '2024-01-15',
      status: 'pending_store',
      priority: 'high',
      budgetHead: 'Lab Equipment Fund',
      justification: 'Required for advanced research in cell biology',
      approvalTrail: ['User', 'HOD'],
      items: [
        {
          itemName: 'Microscope',
          description: 'High-resolution microscope for cell research',
          quantity: '2',
          make: 'Olympus',
          uom: 'Nos',
          stockInHand: '0',
          approxValue: '25000',
          purpose: 'Research'
        }
      ]
    }
  ];

  const handleApprove = (indentId: string) => {
    toast({
      title: "Indent Verified",
      description: `Indent ${indentId} has been verified and forwarded to Registrar`,
    });
    setSelectedIndent(null);
  };

  const handleReject = (indentId: string, remarks: string) => {
    toast({
      title: "Indent Rejected",
      description: `Indent ${indentId} has been rejected: ${remarks}`,
      variant: "destructive",
    });
    setSelectedIndent(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_store': return 'bg-blue-100 text-blue-800';
      case 'verified': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Store Indents"
        subtitle="Review and verify indents for stock availability"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Verification</CardTitle>
            <CardDescription>Indents requiring stock verification</CardDescription>
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
                          <span className="font-medium">Requested by:</span> {indent.requestedBy}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {indent.department}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> {indent.amount}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedIndent(indent)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <IndentDetailsModal
        isOpen={!!selectedIndent}
        onClose={() => setSelectedIndent(null)}
        indent={selectedIndent}
        onApprove={handleApprove}
        onReject={handleReject}
        userRole="store"
      />
    </DashboardLayout>
  );
};

export default StoreIndents;
