
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Users, 
  Building2, 
  TrendingUp,
  Calendar,
  AlertCircle 
} from 'lucide-react';

const OfficerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const summaryCards = [
    {
      title: 'Indents Assigned',
      value: '8',
      description: 'Active assignments',
      icon: FileText,
      bgGradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    {
      title: 'Quotations Pending',
      value: '5',
      description: 'Awaiting vendor quotes',
      icon: Clock,
      bgGradient: 'from-amber-50 to-amber-100',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-900'
    },
    {
      title: 'Finalized Vendors',
      value: '3',
      description: 'This month',
      icon: CheckCircle,
      bgGradient: 'from-green-50 to-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    }
  ];

  const quickActions = [
    {
      title: 'View My Indents',
      description: 'Check assigned indents and quotations',
      action: () => navigate('/officer/indents'),
      icon: FileText,
      color: 'bg-dpu-red hover:bg-dpu-red-dark'
    },
    {
      title: 'Manage Vendors',
      description: 'Access vendor directory and ratings',
      action: () => navigate('/officer/vendors'),
      icon: Building2,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const recentIndents = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      department: 'Biology',
      status: 'Quotation Pending',
      priority: 'High',
      deadline: '2024-01-20',
      quotesReceived: 3
    },
    {
      id: 'IND002',
      title: 'Computer Systems & Accessories',
      department: 'IT',
      status: 'Inquiry Sent',
      priority: 'Medium',
      deadline: '2024-01-22',
      quotesReceived: 0
    },
    {
      id: 'IND003',
      title: 'Office Furniture - Chairs & Desks',
      department: 'Administration',
      status: 'Under Review',
      priority: 'Low',
      deadline: '2024-01-25',
      quotesReceived: 5
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Quotation Pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">{status}</Badge>;
      case 'Inquiry Sent':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{status}</Badge>;
      case 'Under Review':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">{status}</Badge>;
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
        title="Purchase Officer Dashboard"
        subtitle="Manage assigned indents and vendor communications efficiently"
      />
      
      <div className="p-6 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Card key={index} className={`border-0 bg-gradient-to-br ${card.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className={`text-3xl font-bold ${card.textColor}`}>
                        {card.value}
                      </CardTitle>
                      <CardDescription className={`font-medium ${card.textColor} opacity-80`}>
                        {card.title}
                      </CardDescription>
                    </div>
                    <div className={`p-3 rounded-full bg-white/50 ${card.iconColor}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${card.textColor} opacity-70`}>{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Indents */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="w-5 h-5 text-dpu-red" />
              Recent Assigned Indents
            </CardTitle>
            <CardDescription>Your latest assignments and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIndents.map((indent) => (
                <div key={indent.id} className="group">
                  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:border-dpu-red hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-semibold text-gray-900 text-lg">{indent.title}</h4>
                        {getPriorityIcon(indent.priority)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span><strong>ID:</strong> {indent.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span><strong>Dept:</strong> {indent.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span><strong>Quotes:</strong> {indent.quotesReceived}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span><strong>Due:</strong> {indent.deadline}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(indent.status)}
                      
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

export default OfficerDashboard;
