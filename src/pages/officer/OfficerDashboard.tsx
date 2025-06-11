
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OfficerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const summaryCards = [
    {
      title: 'Indents Assigned',
      value: '8',
      description: 'Active assignments',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Quotations Pending',
      value: '5',
      description: 'Awaiting vendor quotes',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Finalized Vendors',
      value: '12',
      description: 'This month',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  ];

  const quickActions = [
    {
      title: 'View My Indents',
      description: 'Check assigned indents',
      action: () => navigate('/officer/indents'),
      icon: '📋'
    },
    {
      title: 'Manage Vendors',
      description: 'View vendor directory',
      action: () => navigate('/officer/vendors'),
      icon: '🏢'
    }
  ];

  const recentIndents = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      department: 'Biology',
      status: 'Quotation Pending',
      deadline: '2024-01-20'
    },
    {
      id: 'IND002',
      title: 'Computer Systems',
      department: 'IT',
      status: 'Inquiry Sent',
      deadline: '2024-01-22'
    }
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Purchase Officer Dashboard"
        subtitle="Manage assigned indents and vendor communications"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card, index) => (
            <Card key={index} className={`${card.bgColor} border-none`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {card.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={action.action}>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{action.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Indents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assigned Indents</CardTitle>
            <CardDescription>Your latest assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIndents.map((indent) => (
                <div key={indent.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{indent.title}</h4>
                    <p className="text-sm text-gray-600">ID: {indent.id} | Department: {indent.department}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {indent.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">Due: {indent.deadline}</p>
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
