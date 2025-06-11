import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RejectionRemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  indentId: string;
}

const RejectionRemarksModal: React.FC<RejectionRemarksModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  indentId
}) => {
  const [remarks, setRemarks] = useState('');

  const handleSubmit = () => {
    onConfirm(remarks);
    setRemarks('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rejection Remarks</DialogTitle>
          <DialogDescription>
            Please provide remarks for rejecting indent {indentId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter your remarks for rejection..."
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-dpu-red hover:bg-dpu-red-dark text-white"
            onClick={handleSubmit}
            disabled={!remarks.trim()}
          >
            Confirm Rejection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionRemarksModal; 