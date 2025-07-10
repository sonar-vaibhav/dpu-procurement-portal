import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PurchaseOrderPage from '@/components/PurchaseOrder';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';
import { Badge } from '@/components/ui/badge';

const finalizedPOs = [
  {
    poId: 'PO001',
    vendorName: 'Tech Solutions Corp',
    indentTitle: 'Computer Lab Hardware',
    indentDepartment: 'Electronics',
    acceptedDate: '2024-02-10',
    poData: {},
    indent: {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      status: 'approved',
      date: '2024-01-14',
      amount: '₹1,80,000',
      department: 'Electronics',
      budgetHead: 'Lab Infrastructure',
      priority: 'medium',
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
    }
  },
  {
    poId: 'PO002',
    vendorName: 'Scientific Equipment Ltd',
    indentTitle: 'Laboratory Equipment - Microscopes',
    indentDepartment: 'Computer Science',
    acceptedDate: '2024-02-08',
    poData: {},
    indent: {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      status: 'approved',
      date: '2024-01-15',
      amount: '₹2,50,000',
      department: 'Computer Science',
      budgetHead: 'Equipment Purchase',
      priority: 'high',
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
    }
  },
  {
    poId: 'PO003',
    vendorName: 'Office Supplies Pro',
    indentTitle: 'Office Stationery Bulk Order',
    indentDepartment: 'Administration',
    acceptedDate: '2024-02-05',
    poData: {},
    indent: {
      id: 'IND003',
      title: 'Office Stationery Bulk Order',
      status: 'approved',
      date: '2024-01-13',
      amount: '₹25,000',
      department: 'Administration',
      budgetHead: 'Office Supplies',
      priority: 'low',
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
  }
];

const CPDFinalizedVendors: React.FC = () => {
  const [openPO, setOpenPO] = useState<string | null>(null);
  const [openIndent, setOpenIndent] = useState<string | null>(null);
  const [selectedIndent, setSelectedIndent] = useState<any>(null);

  return (
    <DashboardLayout>
      <PageHeader
        title="Finalized Vendors"
        subtitle="View all vendors who have accepted Purchase Orders and their related indents"
      />
      <div className="p-6">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-dpu-red to-dpu-red-dark rounded-t-lg p-6">
            <CardTitle className="text-white text-lg">Accepted Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indent Details</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accepted Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalizedPOs.map((po, idx) => (
                    <TableRow key={po.poId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{po.indentTitle}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {po.indent.id} • {po.indent.date}
                            <Badge variant="outline" className={
                              po.indent.priority === 'high' ? 'border-red-200 text-red-600' :
                              po.indent.priority === 'medium' ? 'border-yellow-200 text-yellow-600' :
                              'border-green-200 text-green-600'
                            }>
                              {po.indent.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{po.vendorName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{po.indentDepartment}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Accepted by Vendor</Badge>
                      </TableCell>
                      <TableCell>{po.acceptedDate}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setOpenPO(po.poId)}>
                          View PO
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedIndent(po.indent); setOpenIndent(po.poId); }}>
                          View Indent
                        </Button>
                        <Dialog open={openPO === po.poId} onOpenChange={v => !v && setOpenPO(null)}>
                          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Purchase Order</DialogTitle>
                              <DialogDescription>Preview of the finalized Purchase Order</DialogDescription>
                            </DialogHeader>
                            <div className="max-h-[70vh] overflow-y-auto">
                              <PurchaseOrderPage />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <IndentDetailsModal
                          isOpen={openIndent === po.poId}
                          onClose={() => setOpenIndent(null)}
                          indent={selectedIndent}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {finalizedPOs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No finalized vendors found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CPDFinalizedVendors; 