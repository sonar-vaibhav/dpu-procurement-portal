
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Vendor {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  totalOrders: number;
  onTimeDelivery: number;
}

const OfficerVendors: React.FC = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const vendors: Vendor[] = [
    {
      id: 'V001',
      name: 'TechCorp Solutions',
      category: 'Electronics',
      email: 'contact@techcorp.com',
      phone: '+91 98765 43210',
      location: 'Mumbai',
      rating: 4.5,
      totalOrders: 25,
      onTimeDelivery: 92
    },
    {
      id: 'V002',
      name: 'Lab Equipment Pro',
      category: 'Lab Equipment',
      email: 'sales@labequip.com',
      phone: '+91 87654 32109',
      location: 'Delhi',
      rating: 4.8,
      totalOrders: 18,
      onTimeDelivery: 95
    },
    {
      id: 'V003',
      name: 'Office Furniture Hub',
      category: 'Furniture',
      email: 'info@furniturehub.com',
      phone: '+91 76543 21098',
      location: 'Bangalore',
      rating: 4.2,
      totalOrders: 30,
      onTimeDelivery: 88
    }
  ];

  const categories = ['all', ...Array.from(new Set(vendors.map(v => v.category)))];

  const filteredVendors = selectedCategory === 'all' 
    ? vendors 
    : vendors.filter(vendor => vendor.category === selectedCategory);

  const handleSendEmail = (vendor: Vendor) => {
    toast({
      title: "Email Initiated",
      description: `Opening email client to contact ${vendor.name}`,
    });
    // In a real app, this would open the email client
    window.location.href = `mailto:${vendor.email}?subject=Procurement Inquiry`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Vendor Directory"
        subtitle="Manage vendor relationships for your category"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Category-Based Vendors</CardTitle>
            <CardDescription>Vendors assigned to your procurement category</CardDescription>
            
            <div className="flex space-x-2 mt-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Categories' : category}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>On-Time %</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vendor.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{vendor.email}</div>
                        <div className="text-gray-500">{vendor.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{vendor.location}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getRatingColor(vendor.rating)}`}>
                        ⭐ {vendor.rating}
                      </span>
                    </TableCell>
                    <TableCell>{vendor.totalOrders}</TableCell>
                    <TableCell>
                      <span className={vendor.onTimeDelivery >= 90 ? 'text-green-600' : 'text-yellow-600'}>
                        {vendor.onTimeDelivery}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendEmail(vendor)}
                      >
                        Send Email
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OfficerVendors;
