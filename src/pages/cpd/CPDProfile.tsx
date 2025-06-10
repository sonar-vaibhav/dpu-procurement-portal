
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const CPDProfile: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: 'CPD Officer',
    email: 'cpd@dpu.edu.in',
    contact: '+91 9876543213',
    designation: 'CPD Officer',
    college: 'DPU Central Purchase Department',
    department: 'Central Purchase Department'
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Profile"
        subtitle="Manage your account information"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Select value={formData.designation} onValueChange={(value) => setFormData({...formData, designation: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPD Officer">CPD Officer</SelectItem>
                    <SelectItem value="Senior CPD Officer">Senior CPD Officer</SelectItem>
                    <SelectItem value="CPD Manager">CPD Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="college">Department</Label>
                <Select value={formData.college} onValueChange={(value) => setFormData({...formData, college: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DPU Central Purchase Department">DPU Central Purchase Department</SelectItem>
                    <SelectItem value="DPU Procurement Office">DPU Procurement Office</SelectItem>
                    <SelectItem value="DPU Vendor Management">DPU Vendor Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="department">Specialization</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Central Purchase Department">General Procurement</SelectItem>
                    <SelectItem value="IT Procurement">IT Procurement</SelectItem>
                    <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6">
              <Button onClick={handleSave} className="dpu-button-primary">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CPDProfile;
