
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const CPDIndents: React.FC = () => {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const indents = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      category: 'Laboratory',
      requester: 'Dr. John Smith - Computer Science',
      department: 'Computer Science',
      status: 'pending_assignment',
      priority: 'high',
      amount: '₹2,50,000',
      dateReceived: '2024-01-15',
      assignedTo: null
    },
    {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      category: 'IT Equipment',
      requester: 'Prof. Sarah Johnson - Electronics',
      department: 'Electronics',
      status: 'assigned',
      priority: 'medium',
      amount: '₹1,80,000',
      dateReceived: '2024-01-14',
      assignedTo: 'Rajesh Kumar'
    },
    {
      id: 'IND003',
      title: 'Office Stationery Bulk Order',
      category: 'Stationery',
      requester: 'Admin Office',
      department: 'Administration',
      status: 'in_progress',
      priority: 'low',
      amount: '₹25,000',
      dateReceived: '2024-01-13',
      assignedTo: 'Amit Patel'
    },
    {
      id: 'IND004',
      title: 'Chemical Reagents for Research',
      category: 'Laboratory',
      requester: 'Dr. Priya Patel - Chemistry',
      department: 'Chemistry',
      status: 'completed',
      priority: 'medium',
      amount: '₹75,000',
      dateReceived: '2024-01-10',
      assignedTo: 'Priya Sharma'
    }
  ];

  const purchaseOfficers = [
    'Rajesh Kumar',
    'Priya Sharma', 
    'Amit Patel',
    'Sunita Verma',
    'Karan Singh'
  ];

  const handleAssignOfficer = (indentId: string, officerName: string) => {
    toast({
      title: "Indent Assigned",
      description: `Indent ${indentId} has been assigned to ${officerName}`,
    });
  };

  const filteredIndents = indents.filter(indent => {
    const matchesCategory = filterCategory === 'all' || indent.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || indent.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      indent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.requester.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

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
        title="All Indents"
        subtitle="Manage and assign indents to purchase officers"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Indent Management</CardTitle>
            <CardDescription>View, filter, and assign indents to purchase officers</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search indents by title, ID, or requester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:max-w-sm"
              />
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  <SelectItem value="Stationery">Stationery</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_assignment">Pending Assignment</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Indents Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indent Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndents.map((indent) => (
                    <TableRow key={indent.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{indent.title}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {indent.id} • {indent.dateReceived}
                            {getPriorityBadge(indent.priority)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{indent.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{indent.requester.split(' - ')[0]}</div>
                          <div className="text-xs text-gray-500">{indent.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(indent.status)}</TableCell>
                      <TableCell className="font-medium">{indent.amount}</TableCell>
                      <TableCell>
                        {indent.assignedTo ? (
                          <div className="text-sm font-medium">{indent.assignedTo}</div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {indent.status === 'pending_assignment' && (
                            <Select onValueChange={(value) => handleAssignOfficer(indent.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                {purchaseOfficers.map((officer) => (
                                  <SelectItem key={officer} value={officer}>
                                    {officer}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredIndents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No indents found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CPDIndents;
