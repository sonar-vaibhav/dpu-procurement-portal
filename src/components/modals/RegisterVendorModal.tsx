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
import { Badge } from '@/components/ui/badge';
import { X, ChevronsUpDown, Check } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
    categories: [] as string[],
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

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleCategoryRemove = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter(c => c !== categoryToRemove)
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || formData.categories.length === 0 || !formData.contactPerson || !formData.phone || !formData.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields including at least one category',
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
      categories: [],
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
        <DialogHeader className="bg-gray-50 z-10 pb-4 border-b">
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
                <Label>Categories *</Label>
                <div className="space-y-2">
                  {/* Selected Categories Display */}
                  {formData.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-gray-50">
                      {formData.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => handleCategoryRemove(category)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Category Selection Dropdown */}
                  <Popover open={categoryDropdownOpen} onOpenChange={setCategoryDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryDropdownOpen}
                        className="h-12 w-full justify-between rounded-lg"
                      >
                        {formData.categories.length === 0 
                          ? "Select categories" 
                          : `${formData.categories.length} category${formData.categories.length > 1 ? 'ies' : 'y'} selected`
                        }
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search categories..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                key={category}
                                onSelect={() => handleCategoryToggle(category)}
                                className="flex items-center justify-between"
                              >
                                <span>{category}</span>
                                {formData.categories.includes(category) && (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
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

          {/* Sticky Footer */}
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
