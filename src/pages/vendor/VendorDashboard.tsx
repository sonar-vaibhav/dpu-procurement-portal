
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Package, 
  TrendingUp,
  Clock,
  AlertCircle,
  Building2
} from 'lucide-react';

const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: 'Total Enquiries', 
      value: '24', 
      icon: Mail,
      bgGradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    { 
      title: 'Quotations Submitted', 
      value: '18', 
      icon: FileText,
      bgGradient: 'from-green-50 to-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    },
    { 
      title: 'Accepted Quotes', 
      value: '12', 
      icon: CheckCircle,
      bgGradient: 'from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-900'
    },
  ];

  const recentEnquiries = [
    {
      id: 'ENQ001',
      title: 'Laboratory Equipment - Microscopes',
      category: 'Lab Equipment',
      quantity: '5 units',
      deadline: '2024-01-20',
      status: 'pending',
      priority: 'High',
      estimatedValue: '₹2,50,000'
    },
    {
      id: 'ENQ002',
      title: 'Computer Lab Hardware & Peripherals',
      category: 'Electronics',
      quantity: '20 units',
      deadline: '2024-01-25',
      status: 'responded',
      priority: 'Medium',
      estimatedValue: '₹8,00,000'
    },
    {
      id: 'ENQ003',
      title: 'Office Furniture - Executive Collection',
      category: 'Furniture',
      quantity: '15 sets',
      deadline: '2024-01-28',
      status: 'responded',
      priority: 'Low',
      estimatedValue: '₹4,50,000'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending Response</Badge>;
      case 'responded':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Responded</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Medium':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Low':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Vendor Dashboard"
        subtitle="Manage your enquiries, quotations and business opportunities"
      />
      
      <div className="p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className={`border-0 bg-gradient-to-br ${stat.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300 min-h-[120px]`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className={`text-2xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </CardTitle>
                      <p className={`text-sm font-medium ${stat.textColor} opacity-80`}>
                        {stat.title}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-white/50 ${stat.iconColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>


        {/* Recent Enquiries */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Mail className="w-5 h-5 text-dpu-red" />
              Recent Enquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="group">
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-dpu-red hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">{enquiry.title}</h4>
                          {getPriorityIcon(enquiry.priority)}
                        </div>
                        {getStatusBadge(enquiry.status)}
                      </div>
                      
                      <div className="flex space-x-2">
                        {enquiry.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => navigate(`/vendor/respond/${enquiry.id}`)}
                            className="bg-dpu-red hover:bg-dpu-red-dark text-white"
                          >
                            Respond
                          </Button>
                        )}
                        {enquiry.status === 'responded' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/vendor/revise/${enquiry.id}`)}
                            className="hover:bg-gray-50"
                          >
                            Revise
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span><strong>ID:</strong> {enquiry.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span><strong>Category:</strong> {enquiry.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span><strong>Quantity:</strong> {enquiry.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span><strong>Deadline:</strong> {enquiry.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span><strong>Est. Value:</strong> {enquiry.estimatedValue}</span>
                      </div>
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
