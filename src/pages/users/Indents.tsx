
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateIndentModal from '@/components/modals/CreateIndentModal';

const Indents: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<any>(null);

  const indents = [
    { 
      id: 'IND001', 
      title: 'Laboratory Equipment', 
      status: 'pending_hod', 
      date: '2024-01-15', 
      amount: '₹25,000',
      description: 'Microscopes and lab apparatus for Biology department'
    },
    { 
      id: 'IND002', 
      title: 'Office Supplies', 
      status: 'approved', 
      date: '2024-01-10', 
      amount: '₹5,000',
      description: 'Stationery and office equipment'
    },
    { 
      id: 'IND003', 
      title: 'Computer Hardware', 
      status: 'pending_store', 
      date: '2024-01-08', 
      amount: '₹45,000',
      description: 'Laptops and accessories for computer lab'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_hod': return 'bg-yellow-100 text-yellow-800';
      case 'pending_store': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_hod': return 'Pending HOD';
      case 'pending_store': return 'Pending Store';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const handleCreateIndent = (data: any) => {
    console.log('Creating indent:', data);
    // Handle indent creation logic here
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="My Indents"
        subtitle="Track and manage your procurement requests"
        action={
          <Button 
            className="bg-dpu-red hover:bg-dpu-red-dark text-white"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Indent
          </Button>
        }
      />
      
      <div className="p-6 space-y-6">
        <div className="grid gap-4">
          {indents.map((indent) => (
            <Card key={indent.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{indent.title}</CardTitle>
                    <CardDescription className="mt-1">{indent.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(indent.status)}>
                    {getStatusText(indent.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>ID: {indent.id}</span>
                    <span>Date: {indent.date}</span>
                    <span>Amount: {indent.amount}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedIndent(indent)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreateIndentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateIndent}
      />

      {/* Indent Details Modal */}
      <Dialog open={!!selectedIndent} onOpenChange={() => setSelectedIndent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedIndent?.title}</DialogTitle>
            <DialogDescription>Indent Details - {selectedIndent?.id}</DialogDescription>
          </DialogHeader>
          {selectedIndent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedIndent.status)}>
                      {getStatusText(selectedIndent.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="mt-1 text-lg font-semibold">{selectedIndent.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date Requested</label>
                  <p className="mt-1">{selectedIndent.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Indent ID</label>
                  <p className="mt-1 font-mono">{selectedIndent.id}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1">{selectedIndent.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Indents;
