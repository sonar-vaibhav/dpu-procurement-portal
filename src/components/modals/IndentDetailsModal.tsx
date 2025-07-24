import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface IndentItem {
  itemName: string;
  description: string;
  quantity: string;
  make: string;
  uom: string;
  stockInHand: string;
  approxValue: string;
  purpose: string;
}

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
  items: IndentItem[];
  approvalTrail?: string[];
}

interface IndentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  indent: IndentDetails | null;
  onApprove?: (indentId: string) => void;
  onReject?: (indentId: string, remarks: string) => void;
}

const IndentDetailsModal: React.FC<IndentDetailsModalProps> = ({
  isOpen,
  onClose,
  indent,
  onApprove,
  onReject,
}) => {
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const { user } = useAuth();
  const userRole = user?.role;

  // Local state for editable items
  const [editableItems, setEditableItems] = useState<IndentItem[]>([]);

  // When indent changes or modal opens, copy items to local state
  useEffect(() => {
    if (indent) {
      setEditableItems(indent.items.map(item => ({ ...item })));
    }
  }, [indent]);

  const canApprove = () => {
    if (!indent || !userRole) return false;
    switch (userRole) {
      case 'hod':
        return indent.status === 'pending_hod';
      case 'principal':
        return indent.status === 'pending_principal';
      case 'store':
        return indent.status === 'pending_store';
      case 'registrar':
        return indent.status === 'pending_registrar';
      case 'management':
        return indent.status === 'pending_management';
      case 'account':
      return indent.status === 'pending_account'; 
      default:
        return false;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_hod':
      case 'pending_principal':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_store':
        return 'bg-blue-100 text-blue-800';
      case 'pending_registrar':
        return 'bg-purple-100 text-purple-800';
      case 'pending_management':
        return 'bg-orange-100 text-orange-800';
      case 'pending_account':
      return 'bg-pink-100 text-pink-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_hod':
        return 'Pending HOD Approval';
      case 'pending_principal':
        return 'Pending Principal Approval';
      case 'pending_store':
        return 'Pending Store Approval';
      case 'pending_registrar':
        return 'Pending Registrar Approval';
      case 'pending_account':
      return 'Pending Account Approval';
      case 'pending_management':
        return 'Pending Management Approval';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const handleReject = () => {
    if (!showRejectionInput) {
      setShowRejectionInput(true);
      return;
    }
    if (!rejectionRemarks.trim()) {
      toast.error('Please provide rejection remarks');
      return;
    }
    if (onReject && indent) {
      onReject(indent.id, rejectionRemarks);
      setShowRejectionInput(false);
      setRejectionRemarks('');
      onClose();
    }
  };

  const handleCancelReject = () => {
    setShowRejectionInput(false);
    setRejectionRemarks('');
  };

  const handleApprove = () => {
    if (onApprove && indent) {
      onApprove(indent.id);
      onClose();
    }
  };

  if (!indent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[98vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto px-1 py-2">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {indent.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Badge className={getStatusColor(indent.status)}>
              {getStatusText(indent.status)}
            </Badge>
            <div className="text-lg font-semibold text-gray-900">
              Amount: {indent.amount}
            </div>
          </div>

          {indent.approvalTrail && (
            <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
              <h3 className="font-medium mb-2">Approval Trail</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {indent.approvalTrail.map((step, index) => (
                  <React.Fragment key={step}>
                    <Badge variant="outline">{step}</Badge>
                    {index < indent.approvalTrail.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <h3 className="font-medium mb-2">Request Details</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Date Requested:</span>{' '}
                  {indent.date}
                </p>
                <p>
                  <span className="font-medium">Department:</span>{' '}
                  {indent.department}
                </p>
                <p>
                  <span className="font-medium">Budget Head:</span>{' '}
                  {indent.budgetHead}
                </p>
                <p>
                  <span className="font-medium">Priority:</span>{' '}
                  {indent.priority}
                </p>
                <p>
                  <span className="font-medium">Requested By:</span>{' '}
                  {indent.requestedBy}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Justification</h3>
              <p className="text-sm text-gray-600">{indent.justification}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Requested Items</h3>
            <div className="space-y-2 sm:space-y-4">
              {editableItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-2 sm:p-4 bg-gray-50 w-full">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
                    {Object.entries(item).map(([field, value]) => (
                      <div key={field}>
                        <Label className="capitalize">{field}</Label>
                        <Input
                          type={field === 'quantity' || field === 'approxValue' || field === 'stockInHand' ? 'number' : 'text'}
                          value={value}
                          onChange={(e) => {
                            if (field === 'quantity' && userRole === 'hod') {
                              const updated = [...editableItems];
                              updated[index][field as keyof IndentItem] = e.target.value;
                              setEditableItems(updated);
                            }
                          }}
                          disabled={field !== 'quantity' || userRole !== 'hod'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!showRejectionInput && canApprove() && (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleReject}>
                Reject
              </Button>
              <Button onClick={handleApprove}>Approve</Button>
            </div>
          )}

          {showRejectionInput && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejectionRemarks">Rejection Remarks</Label>
                <Textarea
                  id="rejectionRemarks"
                  placeholder="Enter remarks for rejection or return for clarification..."
                  value={rejectionRemarks}
                  onChange={(e) => setRejectionRemarks(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelReject}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IndentDetailsModal;
