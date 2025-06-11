
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Enquiries', value: '24', color: 'bg-blue-100 text-blue-800' },
    { title: 'Quotations Submitted', value: '18', color: 'bg-green-100 text-green-800' },
    { title: 'Accepted Quotes', value: '12', color: 'bg-emerald-100 text-emerald-800' },
    { title: 'Rejected Quotes', value: '3', color: 'bg-red-100 text-red-800' }
  ];

  const recentEnquiries = [
    {
      id: 'ENQ001',
      title: 'Laboratory Equipment - Microscopes',
      category: 'Lab Equipment',
      quantity: '5 units',
      deadline: '2024-01-20',
      status: 'pending'
    },
    {
      id: 'ENQ002',
      title: 'Computer Lab Hardware',
      category: 'Electronics',
      quantity: '20 units',
      deadline: '2024-01-25',
      status: 'responded'
    }
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Vendor Dashboard"
        subtitle="Manage your enquiries and quotations"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate('/vendor/enquiries')}
                className="dpu-button-primary"
              >
                View New Enquiries
              </Button>
              <Button 
                onClick={() => navigate('/vendor/quotes')}
                variant="outline"
              >
                Quote History
              </Button>
              <Button 
                onClick={() => navigate('/vendor/profile')}
                variant="outline"
              >
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Enquiries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{enquiry.title}</h4>
                        <Badge variant={enquiry.status === 'pending' ? 'default' : 'secondary'}>
                          {enquiry.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
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
                          <span className="font-medium">Deadline:</span> {enquiry.deadline}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {enquiry.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/vendor/respond/${enquiry.id}`)}
                          className="dpu-button-primary"
                        >
                          Respond
                        </Button>
                      )}
                      {enquiry.status === 'responded' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/vendor/revise/${enquiry.id}`)}
                        >
                          Revise
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
