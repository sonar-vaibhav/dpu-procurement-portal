import React, { useRef } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES } from '@/constants/roles';
import { useToast } from '@/hooks/use-toast';

// Sample data
const workOrderData = {
  society: 'DR. D. Y. PATIL UNITECH SOCIETY, PUNE',
  institute: 'Dr. D. Y. Patil Institute of Technology',
  address: 'Sant Tukaram Nagar, Pimpri, Pune – 411018',
  phone: '+91 20 27421095 / 96 / 97',
  fax: '+91 20 27422858, 020 27805288 (CPD)',
  email: 'info.engg@dypvp.edu.in, unitech.cpd@dpu.edu.in',
  pan: 'AABTD1482A',
  gst: '27AABTD1482A2Z6',
  subject: 'Subject to Pune (India) Jurisdiction Only',
  vendor: {
    name: 'Panshul Engineering & Chemicals Pvt. Ltd.',
    address: 'F.No. 106, I Wing, Ramya Nagari Society, Bibwewadi, Pune: 411037',
    contactPerson: 'Appaso Jangam',
    mobile: '9923918207 / 8999671236',
    email: 'jangam.appaso@gmail.com',
    pan: 'AAUCS2079J',
    gst: '27AAUCS2079J1ZM',
  },
  woNo: '009 & 010',
  indentNo: '009 & 010',
  quotationNo: '121/PECPL/RO/6/25',
  department: 'Maintenance',
  materialType: 'RO Plant Cleaning & Servicing',
  woDate: '03/04/2025',
  quotationDate: '06/02/2025',
  items: [
    { sr: 1, description: 'RO Plant Cleaning & Servicing', make: 'Panshul', unit: 'Hour', qty: 10, rate: 1000, value: 10000 },
    { sr: 2, description: 'RO Plant Cleaning & Servicing', make: 'Panshul', unit: 'Hour', qty: 10, rate: 1000, value: 10000 },
    { sr: 3, description: 'RO Plant Cleaning & Servicing', make: 'Panshul', unit: 'Hour', qty: 10, rate: 1000, value: 10000 },
  ],
  terms: [
    'This Work Order is issued for the work specified herein and shall be executed by the Vendor as per the terms and conditions mentioned herein.',
    'The Vendor shall ensure that all the work is carried out in accordance with the specifications and drawings provided by the Company.',
    'The Vendor shall be responsible for all materials, tools, and equipment required for the execution of the work.',
    'The Vendor shall ensure that all the work is carried out in accordance with the specifications and drawings provided by the Company.',
  ],
  paymentTerms: '30 days from the date of invoice.',
  warranty: '1 year from the date of completion of work.',
  delivery: 'Within 10 days from the date of acceptance of the Work Order.',
  preparedBy: 'John Doe',
  checkedBy: 'Jane Smith',
  forSociety: 'DR. D. Y. PATIL UNITECH SOCIETY, PUNE',
  comparativeChart: 'Comparative Chart Placeholder',
  poDocument: 'PO Document Placeholder',
  gstPercent: 18,
};

function numberToWords(num: number) {
  // Simple number to words for demo (for INR)
  // For real use, use a library or more robust function
  const a = [ '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen' ];
  const b = [ '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety' ];
  if (num === 0) return 'Zero';
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '');
  if (num < 1000) return a[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return num.toString();
}

// Rename component
const PurchaseOrderPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast ? useToast() : { toast: (args: any) => alert(args.description) };
  // Simulate PO acceptance state (in real app, fetch from API)
  const [accepted, setAccepted] = React.useState(false);

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    const opt = {
      margin:      [10, 0, 0, 0], // 20mm top margin on every page
      filename:    'WorkOrder.pdf',
      image:       { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:   { mode: ['css', 'legacy'] }
    };
    html2pdf().set(opt).from(printRef.current).save();
  };

  const handleAcceptPO = () => {
    setAccepted(true);
    toast({ title: 'PO Accepted', description: 'You have accepted the Purchase Order.' });
  };

  // Calculate totals
  const items = workOrderData.items || [];
  const subTotal = items.reduce((sum, item) => sum + item.value, 0);
  const gstAmount = Math.round(subTotal * workOrderData.gstPercent / 100);
  const grandTotal = subTotal + gstAmount;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Only show download for non-vendor, accept for vendor if not accepted */}
      {user && user.role && user.role.trim().toLowerCase() === USER_ROLES.VENDOR ? (
        !accepted ? (
          <button
            className="mb-6 px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 print:hidden"
            onClick={handleAcceptPO}
          >
            Accept Purchase Order
          </button>
        ) : (
          <div className="mb-6 px-6 py-2 bg-green-100 text-green-800 rounded shadow print:hidden">
            You have accepted this Purchase Order.
          </div>
        )
      ) : (
        <button
          className="mb-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 print:hidden"
          onClick={handleDownloadPDF}
        >
          Download Work Order as PDF
        </button>
      )}
      <div ref={printRef} className="w-[210mm] bg-white text-black text-[13px] font-sans print:w-full">
        {/* Page 1 */}
        <div className="wo-page w-full min-h-[297mm] px-10 py-8 flex flex-col justify-between">
          {/* Header */}
          <div className="w-full border border-gray-400 bg-white">
            {/* Top line */}
            <div className="border-b border-gray-400 flex items-center px-2 pt-2 pb-1">
              <div className="font-extrabold text-3xl text-red-800 tracking-widest pl-2 pr-8" style={{fontFamily:'serif'}}>DYP DPU</div>
              <div className="flex-1 flex flex-col items-center">
                <div className="text-xs font-medium text-gray-700">{workOrderData.subject}</div>
                <div className="font-bold text-lg leading-tight text-black text-center mt-1">{workOrderData.society}</div>
                <div className="font-bold text-base leading-tight text-black text-center">{workOrderData.institute}</div>
                <div className="text-xs text-gray-700 text-center mt-1">{workOrderData.address}</div>
                <div className="text-xs text-gray-700 text-center">Ph. No. {workOrderData.phone} Fax: {workOrderData.fax}</div>
                <div className="text-xs text-gray-700 text-center">Email-ID : {workOrderData.email}, PAN No:{workOrderData.pan}, GST No:{workOrderData.gst}</div>
              </div>
              <div className="flex flex-col items-end pr-2">
                {/* QR code placeholder */}
                <div className="w-20 h-20 border border-gray-400 bg-gray-100 flex items-center justify-center text-xs text-gray-400">QR</div>
              </div>
            </div>
            {/* Work Order Info Grid */}
            <div className="border-t border-gray-400 grid grid-cols-2 text-[15px]">
              {/* Vendor Details (left) */}
              <div className="p-2 border-r border-gray-400">
                <div><span className="font-bold">M/s.</span> {workOrderData.vendor.name}</div>
                <div>{workOrderData.vendor.address}</div>
                <div><span className="font-bold">Contact Person: </span> {workOrderData.vendor.contactPerson}</div>
                <div><span className="font-bold">Mob.No.: </span> {workOrderData.vendor.mobile}</div>
                <div><span className="font-bold">Email: </span> {workOrderData.vendor.email}</div>
                <div><span className="font-bold">PAN No.: </span> {workOrderData.vendor.pan}</div>
                <div><span className="font-bold">GST No.: </span> {workOrderData.vendor.gst}</div>
              </div>
              {/* Work Order Details (right) */}
              <div className="p-2 grid grid-cols-2 gap-x-2 gap-y-1">
                <div className="font-bold">Date :</div><div>{workOrderData.woDate}</div>
                <div className="font-bold">W.O. No. :</div><div>{workOrderData.woNo}</div>
                <div className="font-bold">Indent No. :</div><div>{workOrderData.indentNo}</div>
                <div className="font-bold">Quotation No. :</div><div>{workOrderData.quotationNo}</div>
                <div className="font-bold">Date :</div><div>{workOrderData.quotationDate}</div>
                <div className="font-bold">Department :</div><div>{workOrderData.department}</div>
                <div className="font-bold">Material Type :</div><div>{workOrderData.materialType}</div>
              </div>
            </div>
          </div>
          {/* Item Table */}
          {/* Two lines above the table */}
          <div className="mt-6 mb-2 text-[15px]">
            <div>Sir,</div>
            <div>With reference to your above mentioned quotation, we are pleased to give you this order for following supplies / services subject to the terms and conditions mentioned therein.</div>
          </div>
          {/* Items Table matching the image */}
          <table className="w-full border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-2 py-1 w-12">Sr. No.</th>
                <th className="border border-gray-400 px-2 py-1">Description of item with specification</th>
                <th className="border border-gray-400 px-2 py-1 w-14">Unit</th>
                <th className="border border-gray-400 px-2 py-1 w-12">Qty.</th>
                <th className="border border-gray-400 px-2 py-1 w-20">Rate in INR</th>
                <th className="border border-gray-400 px-2 py-1 w-24">Values in INR</th>
              </tr>
              <tr>
                <td className="border border-gray-400 px-2 py-1 font-bold text-center"> </td>
                <td className="border border-gray-400 px-2 py-1 font-bold" colSpan={5}>
                  Work order for RO Plant Cleaning, Servicing, Supply & Installation of Spares Parts
                </td>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">1</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Filter Media (Sand)</span><br/>
                  <span className="pl-4 block">Make : Aster</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Kg</td>
                <td className="border border-gray-400 px-2 py-1 text-center">200</td>
                <td className="border border-gray-400 px-2 py-1 text-right">10.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">2000.00</td>
              </tr>
              {/* Row 2 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">2</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Filter Media (Carbon)</span><br/>
                  <span className="pl-4 block">Make : Aster</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Kg</td>
                <td className="border border-gray-400 px-2 py-1 text-center">50</td>
                <td className="border border-gray-400 px-2 py-1 text-right">67.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">3350.00</td>
              </tr>
              {/* Row 3 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">3</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Solenoid Valve 3/4"</span><br/>
                  <span className="pl-4 block">Make : Airu</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">01</td>
                <td className="border border-gray-400 px-2 py-1 text-right">2500.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">2500.00</td>
              </tr>
              {/* Row 4 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">4</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Float Sensor</span><br/>
                  <span className="pl-4 block">Make : Aster</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">01</td>
                <td className="border border-gray-400 px-2 py-1 text-right">1500.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">1500.00</td>
              </tr>
              {/* Row 5 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">5</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Multipore Valve 1"</span><br/>
                  <span className="pl-4 block">Make : Initiative</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">02</td>
                <td className="border border-gray-400 px-2 py-1 text-right">3500.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">7000.00</td>
              </tr>
              {/* Row 6 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">6</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Top Mount Multiport Valve 3/4"</span><br/>
                  <span className="pl-4 block">Make : Initiative</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">02</td>
                <td className="border border-gray-400 px-2 py-1 text-right">3200.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">6400.00</td>
              </tr>
              {/* Row 7 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">7</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Plant Servicing with Piping Fitting</span><br/>
                  <span className="pl-4 block">Make : Astral</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">01</td>
                <td className="border border-gray-400 px-2 py-1 text-right">10000.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">10000.00</td>
              </tr>
              {/* Row 8 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">8</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">6 LPH Dosing Pump</span><br/>
                  <span className="pl-4 block">Make : E-Dose</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">01</td>
                <td className="border border-gray-400 px-2 py-1 text-right">7300.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">7300.00</td>
              </tr>
              {/* Row 9 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">9</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Plant Servicing</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">03</td>
                <td className="border border-gray-400 px-2 py-1 text-right">5000.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">15000.00</td>
              </tr>
              {/* Row 10 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">10</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">RO Membrane</span><br/>
                  <span className="pl-4 block">Size : 40 x 40</span><br/>
                  <span className="pl-4 block">Make : LG</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">01</td>
                <td className="border border-gray-400 px-2 py-1 text-right">13500.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">13500.00</td>
              </tr>
              {/* Row 11 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">11</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Raw Water Pump 0.5 Hp</span><br/>
                  <span className="pl-4 block">Make : CRI</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">01</td>
                <td className="border border-gray-400 px-2 py-1 text-right">5500.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">5500.00</td>
              </tr>
              {/* Row 12 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">12</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Membrane Cleaning with Chemicals</span><br/>
                  <span className="pl-4 block">Make : CRI</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">03</td>
                <td className="border border-gray-400 px-2 py-1 text-right">3500.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">10500.00</td>
              </tr>
              {/* Row 13 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">13</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">High Pressure Pump 1.5 hp</span><br/>
                  <span className="pl-4 block">Make : CRI</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">01</td>
                <td className="border border-gray-400 px-2 py-1 text-right">24000.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">24000.00</td>
              </tr>
              {/* Row 14 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">14</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Antiscalent 5 Ltr</span><br/>
                  <span className="pl-4 block">Make : Aquachem 101</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Can</td>
                <td className="border border-gray-400 px-2 py-1 text-center">05</td>
                <td className="border border-gray-400 px-2 py-1 text-right">1750.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">8750.00</td>
              </tr>
              {/* Row 15 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">15</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Cartridge 4 x 20</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">50</td>
                <td className="border border-gray-400 px-2 py-1 text-right">300.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">15000.00</td>
              </tr>
              {/* Row 16 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">16</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Cartridge 4 x 10</span><br/>
                  <span className="pl-4 block">Make : ECO</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">12</td>
                <td className="border border-gray-400 px-2 py-1 text-right">270.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">3240.00</td>
              </tr>
              {/* Row 17 */}
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">17</td>
                <td className="border border-gray-400 px-2 py-1">
                  <span className="font-bold">Control Panel</span><br/>
                  <span className="pl-4 block">Make : Aster</span>
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">Nos</td>
                <td className="border border-gray-400 px-2 py-1 text-center">01</td>
                <td className="border border-gray-400 px-2 py-1 text-right">7900.00</td>
                <td className="border border-gray-400 px-2 py-1 text-right">7900.00</td>
              </tr>
              {/* Totals and GST rows */}
              <tr className="font-bold">
                <td className="border border-gray-400 px-2 py-1 text-right" colSpan={5}>Total</td>
                <td className="border border-gray-400 px-2 py-1 text-right">1,43,440.00</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-right" colSpan={5}>Add: Gst @ 18%</td>
                <td className="border border-gray-400 px-2 py-1 text-right">25,819.00</td>
              </tr>
              <tr className="font-bold">
                <td className="border border-gray-400 px-2 py-1 text-right" colSpan={5}>Grand Total</td>
                <td className="border border-gray-400 px-2 py-1 text-right">1,69,259.00</td>
              </tr>
            </tbody>
          </table>
          {/* Amount in words below the table */}
          <div className="mt-1 text-[15px] font-bold">(INR in Words : One Lakh Sixty Nine Thousand Two Hundred Fifty Nine only)</div>
          {/* Detailed Terms Block (matches second image) */}
          <div className="mt-6 border border-gray-400 pdf-page-break">
            <div className="p-2 text-[15px]">
            <ol className="list-decimal ml-6 text-[15px]">
              <li className="avoid-break">The amount value is rounded at nearest amount.</li>
              <li className="avoid-break">Please see overleaf for standard Terms and Conditions.</li>
            
            
              <div className="font-bold mb-1">M/s. {workOrderData.vendor.name}</div>
              <div className="flex flex-row justify-between mb-1">
                <div className="font-bold">W.O. No. :</div>
                <div className="font-bold">Date :</div>
                <div className="font-bold">Grand Total: <span className="font-bold">1,69,259.00</span></div>
              </div>
              <div className="font-bold mb-1">(INR in Words : One Lakh Sixty Nine Thousand Two Hundred Fifty Nine only)</div>
                <li className="avoid-break">The rates mentioned in the Purchase/Work Order shall be firm for all supplies including the extension of time, any granted and will not be subject to any fluctuation due to increasing in the cost of materials, labour, taxes, octroi, or any other new taxes, levies, etc.</li>
                <li className="avoid-break">You shall execute the work as per instructions given by the College Authority.</li>
                <li className="avoid-break">You will be fully responsible for the safety of the workforce employed by you at the above site and we shall not entertain any claim from you or your workers towards compensation for injury or damages while working at the above site.</li>
                <li className="avoid-break">You shall be under strict obligation and duty to obey all the Laws of the land, especially pertaining to the minimum wages, gratuity, provident fund, ESIC, labour laws, or any other requirements of the workers and such rules/ regulations, etc., as prohibitory laws e.g. minor child below 18 years restrained or women labour should not be permitted to work at night on the work, etc., licensing authorities rules and regulations, as per the provisions of legislations prevailing and applicable from time to time must be followed strictly and properly, without default.</li>
                <li className="avoid-break">The actual quantity of work shall be measured by our College Authority in the presence of your representative.</li>
                <li className="avoid-break">Material supplied by you shall be checked & validated by our Store Dept. Or Site Engg.</li>
                <li className="avoid-break">You shall coordinate with our Maintenance department Mr. Narendra Wagmale Mobile No. 9552526650 at the time of material delivery & execution of work.</li>
              </ol>
              <div className="grid grid-cols-2 gap-4 mt-4 text-[15px]">
                <div><span className="font-bold">GST</span> : Extra As Above @ 18%</div>
                <div><span className="font-bold">Warranty</span> : One Year</div>
                <div><span className="font-bold">Loading & Unloading</span> : Inclusive</div>
                <div><span className="font-bold">P & F /Transportation</span> : Inclusive</div>
                <div><span className="font-bold">Work/ Service Schedule</span> : Immediate</div>
                <div><span className="font-bold">Work/ Service At</span> : Dr. DYP Institute of Technology, Pimpri</div>
              </div>
              <div className="mt-4 font-bold text-[15px]">Payment Terms : <span className="font-normal">100% After completion of work against Tax Invoice duly certified by the College Authority.</span></div>
              <div className="flex justify-between items-end mt-8 pt-8">
                <div className="flex flex-col items-center">
                  <div>Suraj Wangane</div>
                  <div className="text-sm">Prepared By</div>
                </div>
                <div className="flex flex-col items-center">
                  <div>Kailas Tupsundar</div>
                  <div className="text-sm">Checked By</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-bold">For DR. D. Y. PATIL UNITECH SOCIETY, PUNE</div>
                  <div>Dr. D. Y. Patil Institute of Technology</div>
                  <div className="text-sm mt-2">Secretary/ Vice-Chairman/ Chairman</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPage; 