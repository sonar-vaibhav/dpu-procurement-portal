
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
  const [editableItems, setEditableItems] = useState<IndentItem[]>([]);

  useEffect(() => {
    if (indent) {
      setEditableItems(indent.items.map((item) => ({ ...item })));
    }
  }, [indent]);

  const canApprove = () => {
    if (!indent || !userRole) return false;
    const roleStatusMap: Record<string, string> = {
      hod: 'pending_hod',
      principal: 'pending_principal',
      store: 'pending_store',
      registrar: 'pending_registrar',
      account: 'pending_account',
      management: 'pending_management',
      cpd: 'pending_cpd',
    };
    return indent.status === roleStatusMap[userRole];
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_hod: 'bg-yellow-100 text-yellow-800',
      pending_principal: 'bg-yellow-100 text-yellow-800',
      pending_store: 'bg-blue-100 text-blue-800',
      pending_registrar: 'bg-purple-100 text-purple-800',
      pending_management: 'bg-orange-100 text-orange-800',
      pending_account: 'bg-pink-100 text-pink-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleReject = () => {
    if (!showRejectionInput) return setShowRejectionInput(true);
    if (!rejectionRemarks.trim()) return toast.error('Please provide remarks');
    if (onReject && indent) {
      onReject(indent.id, rejectionRemarks);
      setShowRejectionInput(false);
      setRejectionRemarks('');
      onClose();
    }
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
      <DialogContent
        className="
          w-screen h-screen 
          max-w-none max-h-none 
          rounded-none shadow-none 
          p-4 sm:p-6 md:p-8 
          overflow-y-auto 
          flex flex-col
        "
      >
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            {indent.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 mt-4 pb-20">
          {/* Status & Amount */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <Badge className={getStatusColor(indent.status)}>
              {indent.status.replace(/_/g, ' ').toUpperCase()}
            </Badge>
            <div className="text-base sm:text-lg font-semibold text-gray-900 mt-2 sm:mt-0">
              Amount: {indent.amount}
            </div>
          </div>

          {/* Approval Trail */}
          {indent.approvalTrail && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-800">Approval Trail</h3>
              <div className="flex flex-wrap gap-2">
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

          {/* Request Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-medium mb-2">Request Details</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Date:</span> {indent.date}
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
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-medium mb-2">Justification</h3>
              <p className="text-sm text-gray-600">{indent.justification}</p>
            </div>
          </div>

          {/* Requested Items */}
          <div>
            <h3 className="font-medium mb-3 text-gray-800">Requested Items</h3>
            <div className="space-y-4">
              {editableItems.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(item).map(([field, value]) => (
                      <div key={field}>
                        <Label className="capitalize text-sm">{field}</Label>
                        <Input
                          type={
                            ['quantity', 'approxValue', 'stockInHand'].includes(
                              field
                            )
                              ? 'number'
                              : 'text'
                          }
                          value={value}
                          onChange={(e) => {
                            if (field === 'quantity' && userRole === 'hod') {
                              const updated = [...editableItems];
                              updated[index][
                                field as keyof IndentItem
                              ] = e.target.value;
                              setEditableItems(updated);
                            }
                          }}
                          disabled={field !== 'quantity' || userRole !== 'hod'}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end space-x-2">
          {!showRejectionInput && canApprove() && (
            <>
              {/* MODIFIED: Reject button is now red */}
              <Button
  className="bg-red-600 text-white hover:bg-red-700 focus:ring-2  px-5 py-2 font-medium"
  onClick={handleReject}
>
  Reject
</Button>

<Button
  className="bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-300 rounded-md px-5 py-2 font-medium"
  onClick={handleApprove}
>
  Approve
</Button>

            </>
          )}
        </div>

        {showRejectionInput && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3">
            <div>
              <Label htmlFor="remarks">Rejection Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Enter remarks..."
                value={rejectionRemarks}
                onChange={(e) => setRejectionRemarks(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectionInput(false)}
              >
                Cancel
              </Button>
              {/* MODIFIED: Confirm Rejection button is now red */}
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleReject}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IndentDetailsModal;
