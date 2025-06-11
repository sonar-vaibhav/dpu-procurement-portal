
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import SendEnquiryModal from '@/components/modals/SendEnquiryModal';

interface AssignedIndent {
  id: string;
  title: string;
  quantity: string;
  department: string;
  category: string;
  status: string;
  assignedDate: string;
  deadline: string;
}

const OfficerIndents: React.FC = () => {
  const { toast } = useToast();
  const [selectedIndent, setSelectedIndent] = useState<AssignedIndent | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const indents: AssignedIndent[] = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      quantity: '2 Units',
      department: 'Biology',
      category: 'Lab Equipment',
      status: 'pending_inquiry',
      assignedDate: '2024-01-15',
      deadline: '2024-01-20'
    },
    {
      id: 'IND002',
      title: 'Computer Systems',
      quantity: '5 Units',
      department: 'IT',
      category: 'Electronics',
      status: 'inquiry_sent',
      assignedDate: '2024-01-14',
      deadline: '2024-01-22'
    },
    {
      id: 'IND003',
      title: 'Office Furniture',
      quantity: '10 Sets',
      department: 'Administration',
      category: 'Furniture',
      status: 'quotation_received',
      assignedDate: '2024-01-12',
      deadline: '2024-01-25'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_inquiry': return 'bg-yellow-100 text-yellow-800';
      case 'inquiry_sent': return 'bg-blue-100 text-blue-800';
      case 'quotation_received': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendEnquiry = (indent: AssignedIndent) => {
    setSelectedIndent(indent);
    setShowEnquiryModal(true);
  };

  const handleEnquirySent = () => {
    toast({
      title: "Enquiry Sent",
      description: "Vendor enquiry has been sent successfully",
    });
    setShowEnquiryModal(false);
    setSelectedIndent(null);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Assigned Indents"
        subtitle="Manage your assigned procurement tasks"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Assigned Indents</CardTitle>
            <CardDescription>Handle vendor communications and quotations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Indent ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indents.map((indent) => (
                  <TableRow key={indent.id}>
                    <TableCell className="font-medium">{indent.id}</TableCell>
                    <TableCell>{indent.title}</TableCell>
                    <TableCell>{indent.quantity}</TableCell>
                    <TableCell>{indent.department}</TableCell>
                    <TableCell>{indent.category}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(indent.status)}>
                        {indent.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{indent.deadline}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {indent.status === 'pending_inquiry' && (
                          <Button
                            size="sm"
                            onClick={() => handleSendEnquiry(indent)}
                          >
                            Send Enquiry
                          </Button>
                        )}
                        {indent.status === 'quotation_received' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.location.href = `/officer/quotes/${indent.id}`}
                          >
                            Compare Quotes
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <SendEnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        indent={selectedIndent}
        onEnquirySent={handleEnquirySent}
      />
    </DashboardLayout>
  );
};

export default OfficerIndents;
