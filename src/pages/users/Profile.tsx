
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contactNumber: '',
    intercomNumber: '',
    designation: '',
    collegeName: '',
    department: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }
    
    if (!formData.intercomNumber.trim()) {
      newErrors.intercomNumber = 'Intercom number is required';
    } else if (!/^\d+$/.test(formData.intercomNumber)) {
      newErrors.intercomNumber = 'Intercom number must contain only digits';
    }
    
    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }
    
    if (!formData.collegeName) {
      newErrors.collegeName = 'College name is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically make an API call to update the profile
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Profile"
        subtitle="Manage your personal information"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    placeholder="Enter your contact number"
                    className={errors.contactNumber ? 'border-red-500' : ''}
                  />
                  {errors.contactNumber && <p className="text-sm text-red-500">{errors.contactNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intercomNumber">Intercom Number *</Label>
                  <Input
                    id="intercomNumber"
                    value={formData.intercomNumber}
                    onChange={(e) => handleInputChange('intercomNumber', e.target.value)}
                    placeholder="Enter your intercom number"
                    className={errors.intercomNumber ? 'border-red-500' : ''}
                  />
                  {errors.intercomNumber && <p className="text-sm text-red-500">{errors.intercomNumber}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Select value={formData.designation} onValueChange={(value) => handleInputChange('designation', value)}>
                    <SelectTrigger className={errors.designation ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professor">Professor</SelectItem>
                      <SelectItem value="associate-professor">Associate Professor</SelectItem>
                      <SelectItem value="assistant-professor">Assistant Professor</SelectItem>
                      <SelectItem value="lecturer">Lecturer</SelectItem>
                      <SelectItem value="lab-assistant">Lab Assistant</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="office-staff">Office Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.designation && <p className="text-sm text-red-500">{errors.designation}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="collegeName">College Name *</Label>
                  <Select value={formData.collegeName} onValueChange={(value) => handleInputChange('collegeName', value)}>
                    <SelectTrigger className={errors.collegeName ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">DY Patil College of Engineering</SelectItem>
                      <SelectItem value="management">DY Patil Institute of Management</SelectItem>
                      <SelectItem value="pharmacy">DY Patil College of Pharmacy</SelectItem>
                      <SelectItem value="architecture">DY Patil School of Architecture</SelectItem>
                      <SelectItem value="biotechnology">DY Patil School of Biotechnology</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.collegeName && <p className="text-sm text-red-500">{errors.collegeName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer">Computer Engineering</SelectItem>
                      <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                      <SelectItem value="electrical">Electrical Engineering</SelectItem>
                      <SelectItem value="electronics">Electronics Engineering</SelectItem>
                      <SelectItem value="civil">Civil Engineering</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="chemical">Chemical Engineering</SelectItem>
                      <SelectItem value="biotech">Biotechnology</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-dpu-red hover:bg-dpu-red-dark text-white"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
