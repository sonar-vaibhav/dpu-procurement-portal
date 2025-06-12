
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IndentTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  indent: any;
}

const IndentTrackerModal: React.FC<IndentTrackerModalProps> = ({
  isOpen,
  onClose,
  indent
}) => {
  if (!indent) return null;

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'delivered': 'bg-green-100 text-green-800',
      'in_transit': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'delayed': 'bg-red-100 text-red-800',
      'partially_delivered': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getApprovalBadge = (approved: boolean) => {
    return (
      <Badge className={approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {approved ? 'APPROVED' : 'PENDING'}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Indent Tracking Details - {indent.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Title:</p>
                  <p className="text-lg">{indent.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount:</p>
                  <p className="text-lg font-semibold text-blue-600">{indent.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tracking ID:</p>
                  <p className="font-mono">{indent.trackingId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date Finalized:</p>
                  <p>{indent.dateFinalized}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment & Approval Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2">Purchase Officer Assignment:</p>
                  {indent.purchaseOfficer ? (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">ASSIGNED</Badge>
                      <span>{indent.purchaseOfficer}</span>
                    </div>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">NOT ASSIGNED</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Management Approval:</p>
                  {getApprovalBadge(indent.managementApproved !== false)}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Finalized By:</p>
                <p>{indent.finalizedBy}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vendor & Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor & Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Assigned Vendor:</p>
                  <p className="text-lg">{indent.assignedVendor}</p>
                  <p className="text-sm text-gray-600">{indent.vendorContact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Delivery Status:</p>
                  <div className="mt-1">
                    {getStatusBadge(indent.deliveryStatus)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Expected Delivery:</p>
                  <p>{indent.expectedDelivery}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Actual Delivery:</p>
                  <p>{indent.actualDelivery || 'Pending'}</p>
                  {indent.actualDelivery && (
                    <p className="text-xs text-gray-500">
                      {new Date(indent.actualDelivery) <= new Date(indent.expectedDelivery) ? 
                        '✅ On Time' : '⚠️ Delayed'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Department Status */}
          <Card>
            <CardHeader>
              <CardTitle>Store Department Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Received at Store:</span>
                  {indent.deliveryStatus === 'delivered' || indent.deliveryStatus === 'partially_delivered' ? (
                    <Badge className="bg-green-100 text-green-800">RECEIVED</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Quality Check:</span>
                  {indent.deliveryStatus === 'delivered' ? (
                    <Badge className="bg-green-100 text-green-800">PASSED</Badge>
                  ) : indent.deliveryStatus === 'partially_delivered' ? (
                    <Badge className="bg-orange-100 text-orange-800">PARTIAL</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">PENDING</Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span>Stock Updated:</span>
                  {indent.deliveryStatus === 'delivered' ? (
                    <Badge className="bg-green-100 text-green-800">UPDATED</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
                  )}
                </div>
                
                {indent.deliveryStatus === 'partially_delivered' && (
                  <div className="mt-2 p-2 bg-orange-50 rounded border">
                    <p className="text-sm text-orange-800">
                      <strong>Note:</strong> This indent was partially delivered. Some items may be pending delivery or rejected during quality check.
                    </p>
                  </div>
                )}

                {indent.deliveryStatus === 'delayed' && (
                  <div className="mt-2 p-2 bg-red-50 rounded border">
                    <p className="text-sm text-red-800">
                      <strong>Delay Reason:</strong> Vendor reported manufacturing delay. New expected delivery: {indent.revisedDeliveryDate || 'TBD'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Indent Finalized</p>
                    <p className="text-sm text-gray-600">{indent.dateFinalized} - {indent.finalizedBy}</p>
                  </div>
                </div>
                
                {indent.purchaseOfficer && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Assigned to Purchase Officer</p>
                      <p className="text-sm text-gray-600">Assigned to {indent.purchaseOfficer}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    ['delivered', 'in_transit', 'processing'].includes(indent.deliveryStatus) 
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="font-medium">Vendor Processing</p>
                    <p className="text-sm text-gray-600">
                      {indent.deliveryStatus === 'processing' ? 'Currently processing order' : 
                       ['delivered', 'in_transit'].includes(indent.deliveryStatus) ? 'Order processed' : 'Pending'}
                    </p>
                  </div>
                </div>
                
                {indent.actualDelivery && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-gray-600">{indent.actualDelivery}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IndentTrackerModal;
