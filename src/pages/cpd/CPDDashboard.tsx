import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';
import { FileText, Hourglass, Building2, Coins } from 'lucide-react';

const CPDDashboard: React.FC = () => {
  const [selectedIndent, setSelectedIndent] = useState(null);
  const [isIndentModalOpen, setIsIndentModalOpen] = useState(false);

  const recentIndents = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      department: 'Computer Science',
      status: 'pending_assignment',
      amount: '₹2,50,000',
      date: '2024-01-15',
      priority: 'high',
      budgetHead: 'Equipment Purchase',
      justification: 'Required for advanced research in computer vision and image processing.',
      requestedBy: 'Dr. John Smith',
      items: [
        {
          itemName: 'Digital Microscope',
          description: 'High-resolution digital microscope for research',
          quantity: '2',
          make: 'Olympus',
          uom: 'Pieces',
          stockInHand: '0',
          approxValue: '125000',
          purpose: 'Research'
        }
      ]
    },
    {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      department: 'Electronics',
      status: 'assigned',
      amount: '₹1,80,000',
      date: '2024-01-14',
      priority: 'medium',
      budgetHead: 'Lab Infrastructure',
      justification: 'Upgrading computer lab with latest hardware for student projects.',
      requestedBy: 'Prof. Sarah Johnson',
      items: [
        {
          itemName: 'Desktop Computers',
          description: 'High-performance desktop computers',
          quantity: '10',
          make: 'Dell',
          uom: 'Pieces',
          stockInHand: '2',
          approxValue: '180000',
          purpose: 'Teaching'
        }
      ]
    },
    {
      id: 'IND003',
      title: 'Office Stationery Bulk Order',
      department: 'Administration',
      status: 'in_progress',
      amount: '₹25,000',
      date: '2024-01-13',
      priority: 'low',
      budgetHead: 'Office Supplies',
      justification: 'Monthly office stationery requirements for all departments.',
      requestedBy: 'Admin Office',
      items: [
        {
          itemName: 'Office Supplies',
          description: 'Various office stationery items',
          quantity: '1',
          make: 'Multiple',
          uom: 'Lot',
          stockInHand: '0',
          approxValue: '25000',
          purpose: 'Administrative'
        }
      ]
    }
  ];

  const monthlyData = [
    { month: 'Jan', indents: 45, completed: 38 },
    { month: 'Feb', indents: 52, completed: 41 },
    { month: 'Mar', indents: 48, completed: 45 },
    { month: 'Apr', indents: 61, completed: 52 },
    { month: 'May', indents: 55, completed: 48 },
    { month: 'Jun', indents: 67, completed: 58 }
  ];

  const statusData = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'In Progress', value: 23, color: '#3B82F6' },
    { name: 'Pending', value: 12, color: '#F59E0B' },
    { name: 'On Hold', value: 8, color: '#EF4444' }
  ];

  const handleViewDetails = (indent: any) => {
    setSelectedIndent(indent);
    setIsIndentModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'pending_assignment': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      'high': 'border-red-200 text-red-600',
      'medium': 'border-yellow-200 text-yellow-600',
      'low': 'border-green-200 text-green-600'
    };
    
    return (
      <Badge variant="outline" className={priorityColors[priority as keyof typeof priorityColors]}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="CPD Dashboard"
        subtitle="Central Purchase Department overview and analytics"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Indents</CardTitle>
              <FileText className="w-7 h-7 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignment</CardTitle>
              <Hourglass className="w-7 h-7 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Building2 className="w-7 h-7 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
              <Coins className="w-7 h-7 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45.2L</div>
              <p className="text-xs text-muted-foreground">68% utilized</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Indent Statistics</CardTitle>
              <CardDescription>Indents received vs completed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="indents" fill="#3B82F6" name="Received" />
                  <Bar dataKey="completed" fill="#10B981" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Indent Status Distribution</CardTitle>
              <CardDescription>Current status of all indents</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Indent Details Modal */}
      <IndentDetailsModal
        isOpen={isIndentModalOpen}
        onClose={() => setIsIndentModalOpen(false)}
        indent={selectedIndent}
        userRole="management"
      />
    </DashboardLayout>
  );
};

export default CPDDashboard;
