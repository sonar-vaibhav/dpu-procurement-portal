import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import IndentReport from '@/components/IndentReport';

interface IndentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  indent: any | null;
}

const IndentReportModal: React.FC<IndentReportModalProps> = ({ isOpen, onClose, indent }) => {
  if (!indent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen max-w-screen max-h-screen overflow-y-auto bg-gray-50">
     
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Indent Report</DialogTitle>
        </DialogHeader>

     
        <div className="py-4">
          <IndentReport indentData={indent} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IndentReportModal;
