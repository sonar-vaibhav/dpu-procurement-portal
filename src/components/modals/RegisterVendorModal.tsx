
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.category || !formData.contactPerson || 
        !formData.phone || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create new vendor
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
      title: "Vendor Registered",
      description: `${formData.name} has been successfully registered`,
    });

    // Reset form
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Vendor</DialogTitle>
          <DialogDescription>
            Enter vendor details to register them in the system
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Enter contact person name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter complete address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                value={formData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                placeholder="Enter GST number"
              />
            </div>
            <div>
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input
                id="panNumber"
                value={formData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value)}
                placeholder="Enter PAN number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bankDetails">Bank Details</Label>
            <Input
              id="bankDetails"
              value={formData.bankDetails}
              onChange={(e) => handleInputChange('bankDetails', e.target.value)}
              placeholder="Enter bank account details"
            />
          </div>

          <div>
            <Label htmlFor="certifications">Certifications & Licenses</Label>
            <Textarea
              id="certifications"
              value={formData.certifications}
              onChange={(e) => handleInputChange('certifications', e.target.value)}
              placeholder="Enter relevant certifications and licenses"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="dpu-button-primary">
            Register Vendor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterVendorModal;
