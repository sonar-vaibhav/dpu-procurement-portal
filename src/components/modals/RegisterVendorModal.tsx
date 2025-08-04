import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface RegisterVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVendorRegistered: (vendor: any) => void;
}

const RegisterVendorModal: React.FC<RegisterVendorModalProps> = ({
  isOpen,
  onClose,
  onVendorRegistered
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: '',
    panNumber: '',
    bankDetails: '',
    certifications: ''
  });

  const categories = [
    'Laboratory',
    'IT Equipment',
    'Stationery',
    'Furniture',
    'Electronics',
    'Chemical & Reagents',
    'Medical Equipment',
    'Construction Materials'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.contactPerson || !formData.phone || !formData.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const newVendor = {
      id: `V${String(Date.now()).slice(-3)}`,
      ...formData,
      totalOrders: 0,
      completedOrders: 0,
      onTimeDelivery: 0,
      rating: 0,
      status: 'active'
    };

    onVendorRegistered(newVendor);
    toast({
      title: 'Vendor Registered',
      description: `${formData.name} has been successfully registered`
    });

    setFormData({
      name: '',
      category: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      gstNumber: '',
      panNumber: '',
      bankDetails: '',
      certifications: ''
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-screen h-screen max-w-none max-h-none rounded-none 
        shadow-none px-3 py-3 md:px-10 md:py-8 overflow-y-auto bg-gray-50"
      >
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 bg-gray-50 z-10 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            Register New Vendor
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the vendor details to register them in the system
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form className="space-y-6 pt-4 pb-24 md:pb-10">
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Vendor Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter company name"
                  className="h-12 rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className="h-12 rounded-lg">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Person *</Label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder="Enter contact person"
                  className="h-12 rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="h-12 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className="h-12 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter complete address"
                rows={3}
                className="rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GST Number</Label>
                <Input
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                  placeholder="Enter GST number"
                  className="h-12 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                  placeholder="Enter PAN number"
                  className="h-12 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bank Details</Label>
              <Input
                value={formData.bankDetails}
                onChange={(e) => handleInputChange('bankDetails', e.target.value)}
                placeholder="Enter bank details"
                className="h-12 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Certifications & Licenses</Label>
              <Textarea
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                placeholder="Enter certifications & licenses"
                rows={3}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-gray-50 pt-4 pb-2 flex justify-end gap-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-dpu-red text-white hover:bg-dpu-red-dark"
              onClick={handleSubmit}
            >
              Register Vendor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterVendorModal;
