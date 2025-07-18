import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';
import { FileText, Hourglass, CheckCircle } from 'lucide-react';

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
}

const AccountDashboard: React.FC = () => {
  const { toast } = useToast();
  const [selectedIndent, setSelectedIndent] = useState<IndentDetails | null>(null);

  const [pendingApprovals, setPendingApprovals] = useState<IndentDetails[]>([
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      requestedBy: 'Dr. John Smith',
      department: 'Biology',
      amount: '₹25,000',
      date: '2024-01-15',
      priority: 'high',
      status: 'pending_account',
      budgetHead: 'Research Equipment',
      justification: 'Required for advanced research in cell biology',
      items: [
        {
          itemName: 'Microscope',
          description: 'High-resolution microscope for cell research',
          quantity: '2',
          make: 'Olympus',
          uom: 'Nos',
          stockInHand: '0',
          approxValue: '25000',
          purpose: 'Research',
        },
      ],
    },
    {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      requestedBy: 'Prof. Sarah Wilson',
      department: 'Computer Science',
      amount: '₹45,000',
      date: '2024-01-14',
      priority: 'medium',
      status: 'pending_account',
      budgetHead: 'IT Infrastructure',
      justification: 'Upgrading computer lab equipment for new courses',
      items: [
        {
          itemName: 'Desktop Computers',
          description: 'High-performance workstations',
          quantity: '5',
          make: 'Dell',
          uom: 'Nos',
          stockInHand: '2',
          approxValue: '45000',
          purpose: 'Teaching',
        },
      ],
    },
  ]);

  const [approvedCount, setApprovedCount] = useState(10);

  const handleApprove = (indentId: string) => {
    setPendingApprovals((prev) =>
      prev.filter((indent) => indent.id !== indentId)
    );
    setApprovedCount((prev) => prev + 1);
    toast({
      title: 'Indent Approved',
      description: `Indent ${indentId} has been approved and forwarded to next stage`,
    });
    setSelectedIndent(null);
  };

  const handleReject = (indentId: string) => {
    setPendingApprovals((prev) =>
      prev.filter((indent) => indent.id !== indentId)
    );
    toast({
      title: 'Indent Rejected',
      description: `Indent ${indentId} has been rejected`,
      variant: 'destructive',
    });
    setSelectedIndent(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="ACCOUNT Dashboard"
        subtitle="Review and verify budget and indent details before final approval"
      />

      <div className="p-6 space-y-6">
        <div className="flex justify-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="py-2 max-w-xs w-full">
              <CardHeader className="pb-1 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Requests
                  </CardTitle>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    {approvedCount + pendingApprovals.length}
                  </div>
                </div>
                <FileText size={32} className="text-blue-500 ml-2" />
              </CardHeader>
            </Card>

            <Card className="py-2 max-w-xs w-full">
              <CardHeader className="pb-1 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Pending Approvals
                  </CardTitle>
                  <div className="text-2xl font-bold text-yellow-600 mt-1">
                    {pendingApprovals.length}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Require your verification</p>
                </div>
                <Hourglass size={32} className="text-yellow-500 ml-2" />
              </CardHeader>
            </Card>

            <Card className="py-2 max-w-xs w-full">
              <CardHeader className="pb-1 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Approved
                  </CardTitle>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {approvedCount}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Approx ₹1,85,000 value</p>
                </div>
                <CheckCircle size={32} className="text-green-500 ml-2" />
              </CardHeader>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Procurement requests awaiting your verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((indent) => (
                <div
                  key={indent.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {indent.title}
                        </h4>
                        <Badge className={getPriorityColor(indent.priority)}>
                          {indent.priority.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">ID:</span> {indent.id}
                        </div>
                        <div>
                          <span className="font-medium">Requested by:</span>{' '}
                          {indent.requestedBy}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span>{' '}
                          {indent.department}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span>{' '}
                          {indent.amount}
                        </div>
                      </div>

                      <p className="text-sm text-gray-500">Date: {indent.date}</p>
                    </div>

                    <div className="flex space-x-2 ml-4">
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
              {pendingApprovals.length === 0 && (
                <p className="text-sm text-gray-500">No pending requests.</p>
              )}
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
        userRole="account"
      />
    </DashboardLayout>
  );
};

export default AccountDashboard;
