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
  const isCPD = user && user.role && user.role.trim().toLowerCase() === USER_ROLES.CPD;
  // Simulate PO acceptance state (in real app, fetch from API)
  const [accepted, setAccepted] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    ...JSON.parse(JSON.stringify(workOrderData)),
    tnc: {
      gst: 'Extra As Above @ 18%',
      warranty: 'One Year',
      loading: 'Inclusive',
      pf: 'Inclusive',
      schedule: 'Immediate',
      at: 'Dr. DYP Institute of Technology, Pimpri',
      payment: '100% After completion of work against Tax Invoice duly certified by the College Authority.'
    }
  }));

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    const opt = {
      margin:      [10, 0, 0, 0],
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
  const items = form.items || [];
  const subTotal = items.reduce((sum, item) => sum + (item.value || 0), 0);
  const gstAmount = Math.round(subTotal * (form.gstPercent || 0) / 100);
  const grandTotal = subTotal + gstAmount;

  // Handle field changes
  const handleField = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const handleVendorField = (field: string, value: any) => setForm(f => ({ ...f, vendor: { ...f.vendor, [field]: value } }));
  const handleItemField = (idx: number, field: string, value: any) => setForm(f => ({ ...f, items: f.items.map((it: any, i: number) => i === idx ? { ...it, [field]: value } : it) }));
  const handleTncField = (field: string, value: any) => setForm(f => ({ ...f, tnc: { ...f.tnc, [field]: value } }));

  const handleSave = () => {
    setEditMode(false);
    toast({ title: 'PO Updated', description: 'Purchase Order updated successfully.' });
  };

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
      ) : isCPD ? (
        <div className="flex gap-2 mb-6 print:hidden">
          {editMode ? (
            <button
              className="flex items-center gap-1 px-4 py-1 border border-gray-300 text-gray-800 bg-white rounded hover:bg-gray-100 focus:outline-none"
              onClick={handleSave}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Save
            </button>
          ) : (
            <button
              className="flex items-center gap-1 px-4 py-1 border border-gray-300 text-gray-800 bg-white rounded hover:bg-gray-100 focus:outline-none"
              onClick={() => setEditMode(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
              Edit
            </button>
          )}
          <button
            className="flex items-center gap-1 px-4 py-1 border border-gray-300 text-gray-800 bg-white rounded hover:bg-gray-100 focus:outline-none"
            onClick={handleDownloadPDF}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Print
          </button>
        </div>
      ) : (
        <button
          className="mb-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 print:hidden"
          onClick={handleDownloadPDF}
        >
          Download Work Order as PDF
        </button>
      )}
      <div ref={printRef} className="w-full min-h-screen bg-white text-black text-[13px] font-sans print:w-full print:h-auto print:overflow-visible print:static print:block px-4 md:px-10">

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
                <div><span className="font-bold">M/s.</span> {isCPD && editMode ? <input className="border px-1" value={form.vendor.name} onChange={e => handleVendorField('name', e.target.value)} /> : form.vendor.name}</div>
                <div>{isCPD && editMode ? <input className="border px-1 w-full" value={form.vendor.address} onChange={e => handleVendorField('address', e.target.value)} /> : form.vendor.address}</div>
                <div><span className="font-bold">Contact Person: </span> {isCPD && editMode ? <input className="border px-1" value={form.vendor.contactPerson} onChange={e => handleVendorField('contactPerson', e.target.value)} /> : form.vendor.contactPerson}</div>
                <div><span className="font-bold">Mob.No.: </span> {isCPD && editMode ? <input className="border px-1" value={form.vendor.mobile} onChange={e => handleVendorField('mobile', e.target.value)} /> : form.vendor.mobile}</div>
                <div><span className="font-bold">Email: </span> {isCPD && editMode ? <input className="border px-1 w-full" value={form.vendor.email} onChange={e => handleVendorField('email', e.target.value)} /> : form.vendor.email}</div>
                <div><span className="font-bold">PAN No.: </span> {isCPD && editMode ? <input className="border px-1" value={form.vendor.pan} onChange={e => handleVendorField('pan', e.target.value)} /> : form.vendor.pan}</div>
                <div><span className="font-bold">GST No.: </span> {isCPD && editMode ? <input className="border px-1" value={form.vendor.gst} onChange={e => handleVendorField('gst', e.target.value)} /> : form.vendor.gst}</div>
              </div>
              {/* Work Order Details (right) */}
              <div className="p-3 grid grid-cols-2 gap-x-3 gap-y-4">
                <div className="font-bold">Date :</div><div>{isCPD && editMode ? <input className="border px-1" value={form.woDate} onChange={e => handleField('woDate', e.target.value)} /> : form.woDate}</div>
                <div className="font-bold">W.O. No. :</div><div>{isCPD && editMode ? <input className="border px-1" value={form.woNo} onChange={e => handleField('woNo', e.target.value)} /> : form.woNo}</div>
                <div className="font-bold">Indent No. :</div><div>{isCPD && editMode ? <input className="border px-1" value={form.indentNo} onChange={e => handleField('indentNo', e.target.value)} /> : form.indentNo}</div>
                <div className="font-bold">Quotation No. :</div><div>{isCPD && editMode ? <input className="border px-1" value={form.quotationNo} onChange={e => handleField('quotationNo', e.target.value)} /> : form.quotationNo}</div>
                <div className="font-bold">Date :</div><div>{isCPD && editMode ? <input className="border px-1" value={form.quotationDate} onChange={e => handleField('quotationDate', e.target.value)} /> : form.quotationDate}</div>
                <div className="font-bold">Department :</div><div>{isCPD && editMode ? <input className="border px-1" value={form.department} onChange={e => handleField('department', e.target.value)} /> : form.department}</div>
                <div className="font-bold">Material Type :</div><div>{isCPD && editMode ? <input className="border px-1" value={form.materialType} onChange={e => handleField('materialType', e.target.value)} /> : form.materialType}</div>
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
              {form.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-400 px-2 py-1 text-center">{isCPD && editMode ? <input className="border px-1 w-10" value={item.sr} onChange={e => handleItemField(idx, 'sr', e.target.value)} /> : item.sr}</td>
                <td className="border border-gray-400 px-2 py-1">
                    {isCPD && editMode ? (
                      <>
                        <input className="border px-1 font-bold w-full" value={item.description} onChange={e => handleItemField(idx, 'description', e.target.value)} />
                        <br/>
                        <input className="border px-1 pl-4 block w-full" value={item.make} onChange={e => handleItemField(idx, 'make', e.target.value)} />
                      </>
                    ) : (
                      <>
                        <span className="font-bold">{item.description}</span><br/>
                        <span className="pl-4 block">Make : {item.make}</span>
                      </>
                    )}
                </td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{isCPD && editMode ? <input className="border px-1 w-12" value={item.unit} onChange={e => handleItemField(idx, 'unit', e.target.value)} /> : item.unit}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{isCPD && editMode ? <input className="border px-1 w-12" value={item.qty} onChange={e => handleItemField(idx, 'qty', e.target.value)} /> : item.qty}</td>
                  <td className="border border-gray-400 px-2 py-1 text-right">{isCPD && editMode ? <input className="border px-1 w-16 text-right" value={item.rate} onChange={e => handleItemField(idx, 'rate', e.target.value)} /> : item.rate}</td>
                  <td className="border border-gray-400 px-2 py-1 text-right">{isCPD && editMode ? <input className="border px-1 w-20 text-right" value={item.value} onChange={e => handleItemField(idx, 'value', e.target.value)} /> : item.value}</td>
              </tr>
              ))}
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
          <div className="mt-1 text-[15px] font-bold">(INR in Words : {numberToWords(grandTotal)} only)</div>
          {/* Detailed Terms Block (matches second image) */}
          <div className="mt-6 border border-gray-400 pdf-page-break">
            <div className="p-2 text-[15px]">
            <ol className="list-decimal ml-6 text-[15px]">
              <li className="avoid-break">The amount value is rounded at nearest amount.</li>
              <li className="avoid-break">Please see overleaf for standard Terms and Conditions.</li>
              <div className="font-bold mb-1">M/s. {form.vendor.name}</div>
              <div className="flex flex-row justify-between mb-1">
                <div className="font-bold">W.O. No. :</div>
                <div className="font-bold">Date :</div>
                <div className="font-bold">Grand Total: <span className="font-bold">{grandTotal.toLocaleString()}</span></div>
              </div>
              <div className="font-bold mb-1">(INR in Words : {numberToWords(grandTotal)} only)</div>
                <li className="avoid-break">The rates mentioned in the Purchase/Work Order shall be firm for all supplies including the extension of time, any granted and will not be subject to any fluctuation due to increasing in the cost of materials, labour, taxes, octroi, or any other new taxes, levies, etc.</li>
                <li className="avoid-break">You shall execute the work as per instructions given by the College Authority.</li>
                <li className="avoid-break">You will be fully responsible for the safety of the workforce employed by you at the above site and we shall not entertain any claim from you or your workers towards compensation for injury or damages while working at the above site.</li>
                <li className="avoid-break">You shall be under strict obligation and duty to obey all the Laws of the land, especially pertaining to the minimum wages, gratuity, provident fund, ESIC, labour laws, or any other requirements of the workers and such rules/ regulations, etc., as prohibitory laws e.g. minor child below 18 years restrained or women labour should not be permitted to work at night on the work, etc., licensing authorities rules and regulations, as per the provisions of legislations prevailing and applicable from time to time must be followed strictly and properly, without default.</li>
                <li className="avoid-break">The actual quantity of work shall be measured by our College Authority in the presence of your representative.</li>
                <li className="avoid-break">Material supplied by you shall be checked & validated by our Store Dept. Or Site Engg.</li>
                <li className="avoid-break">You shall coordinate with our Maintenance department Mr. Narendra Wagmale Mobile No. 9552526650 at the time of material delivery & execution of work.</li>
              </ol>
              <div className="grid grid-cols-2 gap-4 mt-4 text-[15px]">
                <div><span className="font-bold">GST</span> : {isCPD && editMode ? <input className="border px-1 w-full" value={form.tnc.gst} onChange={e => handleTncField('gst', e.target.value)} /> : form.tnc.gst}</div>
                <div><span className="font-bold">Warranty</span> : {isCPD && editMode ? <input className="border px-1 w-full" value={form.tnc.warranty} onChange={e => handleTncField('warranty', e.target.value)} /> : form.tnc.warranty}</div>
                <div><span className="font-bold">Loading & Unloading</span> : {isCPD && editMode ? <input className="border px-1 w-full" value={form.tnc.loading} onChange={e => handleTncField('loading', e.target.value)} /> : form.tnc.loading}</div>
                <div><span className="font-bold">P & F /Transportation</span> : {isCPD && editMode ? <input className="border px-1 w-full" value={form.tnc.pf} onChange={e => handleTncField('pf', e.target.value)} /> : form.tnc.pf}</div>
                <div><span className="font-bold">Work/ Service Schedule</span> : {isCPD && editMode ? <input className="border px-1 w-full" value={form.tnc.schedule} onChange={e => handleTncField('schedule', e.target.value)} /> : form.tnc.schedule}</div>
                <div><span className="font-bold">Work/ Service At</span> : {isCPD && editMode ? <input className="border px-1 w-full" value={form.tnc.at} onChange={e => handleTncField('at', e.target.value)} /> : form.tnc.at}</div>
              </div>
              <div className="mt-4 font-bold text-[15px]">Payment Terms : <span className="font-normal">{isCPD && editMode ? <input className="border px-1 w-full" value={form.tnc.payment} onChange={e => handleTncField('payment', e.target.value)} /> : form.tnc.payment}</span></div>
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