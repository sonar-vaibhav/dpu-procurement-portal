import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateEnquiryPDF } from '@/utils/pdfGenerator';

interface SendEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  indent: any;
  onEnquirySent: () => void;
}

const SendEnquiryModal: React.FC<SendEnquiryModalProps> = ({
  isOpen,
  onClose,
  indent,
  onEnquirySent
}) => {
  const { toast } = useToast();
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const availableVendors = [
    { id: 'V001', name: 'TechCorp Solutions', category: 'Electronics' },
    { id: 'V002', name: 'Lab Equipment Pro', category: 'Lab Equipment' },
    { id: 'V003', name: 'Office Furniture Hub', category: 'Furniture' }
  ];

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSendEnquiry = () => {
    if (selectedVendors.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one vendor",
        variant: "destructive"
      });
      return;
    }

    // Format indent data for PDF generation
    const indentDetails = {
      id: indent.id,
      title: indent.title,
      department: indent.department,
      quantity: indent.quantity,
      specifications: `Technical specifications for ${indent.title}:\n\n` +
        `• Category: ${indent.category}\n` +
        `• Quantity Required: ${indent.quantity}\n` +
        `• Department: ${indent.department}\n` +
        `• Required by: ${indent.deadline}`,
      requestedBy: 'Department Head',
      requestDate: new Date().toLocaleDateString('en-IN'),
      requiredBy: indent.deadline
    };

    // Generate and download PDF
    try {
      generateEnquiryPDF(indentDetails, selectedVendors);
      toast({
        title: "Enquiry PDF Generated",
        description: `Enquiry PDF has been downloaded for ${selectedVendors.length} vendor(s)`,
      });
      onEnquirySent();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    }
  };

  if (!indent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Enquiry</DialogTitle>
          <DialogDescription>
            Select vendors to send enquiry for {indent.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium">Indent Details</h4>
            <p className="text-sm text-gray-600">ID: {indent.id}</p>
            <p className="text-sm text-gray-600">Quantity: {indent.quantity}</p>
            <p className="text-sm text-gray-600">Category: {indent.category}</p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Select Vendors</h4>
            <div className="space-y-2">
              {availableVendors.map((vendor) => (
                <label key={vendor.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={() => handleVendorToggle(vendor.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{vendor.name}</span>
                  <span className="text-xs text-gray-500">({vendor.category})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
            💡 A formal enquiry PDF will be generated and downloaded for the selected vendors.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendEnquiry}>
            Generate & Download PDF ({selectedVendors.length} vendors)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendEnquiryModal;
