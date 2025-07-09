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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Indent Report</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <IndentReport indentData={indent} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IndentReportModal; 