
import jsPDF from 'jspdf';

interface IndentDetails {
  id: string;
  title: string;
  department: string;
  quantity: string;
  specifications: string;
  requestedBy: string;
  requestDate: string;
  requiredBy: string;
}

interface VendorQuote {
  vendorId: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  specifications: string;
  originalPrice: number;
  discountedPrice: number;
  deliveryTime: string;
  warranty: string;
  termsAndConditions: string;
  paymentTerms: string;
  rating: number;
  submittedDate: string;
  validUntil: string;
}

export const generateEnquiryPDF = (indentDetails: IndentDetails, selectedVendors: string[]) => {
  const doc = new jsPDF();
  
  // DPU Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('DR. D. Y. PATIL UNIVERSITY', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Sector 7, Nerul, Navi Mumbai - 400706', 105, 30, { align: 'center' });
  doc.text('Phone: +91-22-27821234 | Email: info@dpu.edu.in', 105, 40, { align: 'center' });
  
  // Line separator
  doc.line(20, 50, 190, 50);
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('VENDOR ENQUIRY FOR QUOTATION', 105, 65, { align: 'center' });
  
  // Date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-IN');
  doc.text(`Date: ${currentDate}`, 150, 80);
  
  // Indent Details
  doc.setFont('helvetica', 'bold');
  doc.text('INDENT DETAILS:', 20, 95);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Indent ID: ${indentDetails.id}`, 20, 105);
  doc.text(`Title: ${indentDetails.title}`, 20, 115);
  doc.text(`Department: ${indentDetails.department}`, 20, 125);
  doc.text(`Quantity Required: ${indentDetails.quantity}`, 20, 135);
  doc.text(`Required By: ${indentDetails.requiredBy}`, 20, 145);
  
  // Specifications
  doc.setFont('helvetica', 'bold');
  doc.text('SPECIFICATIONS:', 20, 160);
  doc.setFont('helvetica', 'normal');
  
  const specLines = doc.splitTextToSize(indentDetails.specifications, 170);
  let yPosition = 170;
  specLines.forEach((line: string) => {
    doc.text(line, 20, yPosition);
    yPosition += 10;
  });
  
  // Terms for vendors
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION REQUIREMENTS:', 20, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  const requirements = [
    '• Please provide detailed technical specifications',
    '• Include warranty terms and conditions',
    '• Mention delivery timeline',
    '• Provide your best price including taxes',
    '• Include payment terms',
    '• Quote validity period',
    '• Installation and training charges (if any)'
  ];
  
  requirements.forEach(req => {
    doc.text(req, 20, yPosition);
    yPosition += 8;
  });
  
  // Footer
  yPosition += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('Purchase Officer', 20, yPosition);
  doc.text('Dr. D. Y. Patil University', 20, yPosition + 10);
  
  // Save the PDF
  doc.save(`DPU_Enquiry_${indentDetails.id}_${currentDate.replace(/\//g, '-')}.pdf`);
};

export const generatePurchaseOrderPDF = (indentDetails: IndentDetails, selectedVendor: VendorQuote) => {
  const doc = new jsPDF();
  
  // DPU Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('DR. D. Y. PATIL UNIVERSITY', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Sector 7, Nerul, Navi Mumbai - 400706', 105, 30, { align: 'center' });
  doc.text('Phone: +91-22-27821234 | Email: info@dpu.edu.in', 105, 40, { align: 'center' });
  
  // Line separator
  doc.line(20, 50, 190, 50);
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PURCHASE ORDER', 105, 65, { align: 'center' });
  
  // PO Number and Date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-IN');
  const poNumber = `PO-${indentDetails.id}-${Date.now()}`;
  doc.text(`PO Number: ${poNumber}`, 20, 80);
  doc.text(`Date: ${currentDate}`, 150, 80);
  
  // Vendor Details
  doc.setFont('helvetica', 'bold');
  doc.text('TO:', 20, 95);
  doc.setFont('helvetica', 'normal');
  doc.text(selectedVendor.vendorName, 20, 105);
  doc.text(`Contact Person: ${selectedVendor.contactPerson}`, 20, 115);
  doc.text(`Email: ${selectedVendor.email}`, 20, 125);
  doc.text(`Phone: ${selectedVendor.phone}`, 20, 135);
  
  // Item Details Table Header
  let yPos = 155;
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM DETAILS:', 20, yPos);
  
  // Table
  yPos += 15;
  doc.rect(20, yPos, 170, 8); // Header background
  doc.text('Description', 25, yPos + 5);
  doc.text('Quantity', 100, yPos + 5);
  doc.text('Unit Price', 130, yPos + 5);
  doc.text('Total', 160, yPos + 5);
  
  // Item row
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.rect(20, yPos, 170, 15);
  doc.line(95, yPos, 95, yPos + 15); // Vertical line
  doc.line(125, yPos, 125, yPos + 15);
  doc.line(155, yPos, 155, yPos + 15);
  
  const titleLines = doc.splitTextToSize(indentDetails.title, 70);
  doc.text(titleLines, 25, yPos + 5);
  doc.text(indentDetails.quantity, 100, yPos + 8);
  doc.text(`₹${selectedVendor.discountedPrice.toLocaleString()}`, 130, yPos + 8);
  doc.text(`₹${selectedVendor.discountedPrice.toLocaleString()}`, 160, yPos + 8);
  
  // Terms and Conditions
  yPos += 25;
  doc.setFont('helvetica', 'bold');
  doc.text('TERMS AND CONDITIONS:', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  const terms = [
    `Payment Terms: ${selectedVendor.paymentTerms}`,
    `Delivery Time: ${selectedVendor.deliveryTime}`,
    `Warranty: ${selectedVendor.warranty}`,
    `Delivery Address: Dr. D. Y. Patil University, Sector 7, Nerul, Navi Mumbai - 400706`,
    'Goods should be delivered during working hours (9 AM - 5 PM)',
    'All items should be in perfect condition and as per specifications',
    'Invoice should be submitted with delivery challan'
  ];
  
  terms.forEach(term => {
    const termLines = doc.splitTextToSize(term, 170);
    termLines.forEach((line: string) => {
      doc.text(`• ${line}`, 20, yPos);
      yPos += 8;
    });
  });
  
  // Specifications
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('DETAILED SPECIFICATIONS:', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  const specLines = doc.splitTextToSize(selectedVendor.specifications, 170);
  specLines.forEach((line: string) => {
    doc.text(line, 20, yPos);
    yPos += 8;
  });
  
  // Footer with signatures
  yPos += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('Authorized Signatory', 20, yPos);
  doc.text('Purchase Officer', 130, yPos);
  doc.text('Dr. D. Y. Patil University', 20, yPos + 10);
  doc.text('Dr. D. Y. Patil University', 130, yPos + 10);
  
  // Save the PDF
  doc.save(`DPU_PurchaseOrder_${poNumber}_${currentDate.replace(/\//g, '-')}.pdf`);
};
