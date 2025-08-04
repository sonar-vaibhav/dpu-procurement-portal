
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const VendorEnquiries: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const enquiries = [
    {
      id: 'ENQ001',
      title: 'Laboratory Equipment - Microscopes',
      category: 'Lab Equipment',
      quantity: '5 units',
      deliveryTimeline: '15 days',
      department: 'Computer Science',
      deadline: '2024-01-20',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'ENQ002',
      title: 'Computer Lab Hardware',
      category: 'Electronics',
      quantity: '20 units',
      deliveryTimeline: '10 days',
      department: 'Electronics',
      deadline: '2024-01-25',
      status: 'responded',
      priority: 'medium'
    },
    {
      id: 'ENQ003',
      title: 'Office Furniture Set',
      category: 'Furniture',
      quantity: '10 sets',
      deliveryTimeline: '7 days',
      department: 'Administration',
      deadline: '2024-01-30',
      status: 'pending',
      priority: 'low'
    }
  ];

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = enquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="New Enquiries"
        subtitle="Respond to purchase enquiries from institutions"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Enquiry Management</CardTitle>
            <CardDescription>View and respond to new enquiries</CardDescription>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Input
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sm:max-w-xs"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="sm:max-w-xs">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {filteredEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="font-medium text-gray-900">{enquiry.title}</h4>
                        <Badge className={getStatusColor(enquiry.status)}>
                          {enquiry.status.toUpperCase()}
                        </Badge>
                        <Badge className={getPriorityColor(enquiry.priority)}>
                          {enquiry.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">ID:</span> {enquiry.id}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {enquiry.category}
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span> {enquiry.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {enquiry.department}
                        </div>
                        <div>
                          <span className="font-medium">Timeline:</span> {enquiry.deliveryTimeline}
                        </div>
                        <div>
                          <span className="font-medium">Deadline:</span> {enquiry.deadline}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {enquiry.status === 'pending' ? (
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/vendor/respond/${enquiry.id}`)}
                          className="dpu-button-primary"
                        >
                          Respond
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/vendor/revise/${enquiry.id}`)}
                        >
                          Revise Quote
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredEnquiries.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No enquiries found matching your criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VendorEnquiries;
