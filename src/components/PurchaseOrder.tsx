import React, { useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES } from '@/constants/roles';
import { useToast } from '@/hooks/use-toast';
import { downloadPDF, openPDFInNewTab } from './PurchaseOrderPDF';

// Data to match the provided PDF
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
    address: 'F.No. 106, I Wing, Ramya Nagari, Bibwewadi, Pune:411037',
    contactPerson: 'Appaso Jangam',
    mobile: '9923918207 / 8999671236',
    email: 'jangam.appaso@gmail.com',
    pan: 'AAUCS2079J',
    gst: '27AAUCS2079J1ZM',
  },
  woNo: '009 & 010',
  indentNo: '009 & 010',
  quotationNo: '121/PEC-PL',
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
    'The amount value is rounded at nearest amount.',
    'Please see overleaf for standard Terms and Conditions.',
    'The rates mentioned in the Purchase/Work Order shall be firm for all supplies including the extension of time, any granted and will not be subject to any fluctuation due to increasing in the cost of materials, labour, taxes, octroi, or any other new taxes, levies, etc.',
    'You shall execute the work as per instructions given by the College Authority.',
    'You will be fully responsible for the safety of the workforce employed by you at the above site and we shall not entertain any claim from you or your workers towards compensation for injury or damages while working at the above site.',
    'You shall be under strict obligation and duty to obey all the Laws of the land, especially pertaining to the minimum wages, gratuity, provident fund, ESIC, labour laws, or any other requirements of the workers and such rules/regulations, etc., as prohibitory laws e.g. minor child below 18 years restrained or women labour should not be permitted to work at night on the work, etc., licensing authorities rules and regulations, as per the provisions of legislations prevailing and applicable from time to time must be followed strictly and properly, without default.',
    'The actual quantity of work shall be measured by our College Authority in the presence of your representative.',
    'Material supplied by you shall be checked & validated by our Store Dept. Or Site Engg.',
    'You shall coordinate with our Maintenance department Mr. Narendra Wagmale Mobile No. 9552526650 at the time of material delivery & execution of work.',
  ],
  preparedBy: 'Suraj Wangane',
  checkedBy: 'Kailas Tupsundar',
  gstPercent: 18,
  tnc: {
    gst: '@18%',
    warranty: 'One Year',
    loading: 'Inclusive',
    pf: 'Inclusive',
    schedule: 'Immediate',
    at: 'Dr. DYP Institute of Technology, Pimpri',
    payment: '100% After completion of work against Tax Invoice duly certified by the College Authority.'
  }
};

function numberToWords(num: number) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const number = Math.round(num);
  if (number === 0) return 'Zero';
  if (number < 20) return a[number];
  if (number < 100) return b[Math.floor(number / 10)] + (number % 10 ? ' ' + a[number % 10] : '');
  if (number < 1000) return a[Math.floor(number / 100)] + ' Hundred' + (number % 100 ? ' and ' + numberToWords(number % 100) : '');
  if (number < 100000) return numberToWords(Math.floor(number / 1000)) + ' Thousand' + (number % 1000 ? ' ' + numberToWords(number % 1000) : '');
  if (number < 10000000) return numberToWords(Math.floor(number / 100000)) + ' Lakh' + (number % 100000 ? ' ' + numberToWords(number % 100000) : '');
  return number.toString();
}

const PurchaseOrderPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast ? useToast() : { toast: (args: any) => alert(args.description) };
  const isCPD = user && user.role && user.role.trim().toLowerCase() === USER_ROLES.CPD;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(workOrderData)));

  const handleViewPDF = async () => { await openPDFInNewTab(form); };
  const handleDownloadPDF = async () => { await downloadPDF(form, 'WorkOrder.pdf'); };
  
  const handleFieldChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleVendorFieldChange = (field: string, value: any) => {
    setForm(f => ({ ...f, vendor: { ...f.vendor, [field]: value } }));
  };

  const handleTncFieldChange = (field: string, value: any) => {
    setForm(f => ({ ...f, tnc: { ...f.tnc, [field]: value } }));
  };

  const handleTermChange = (index: number, value: string) => {
    setForm(f => {
      const newTerms = [...f.terms];
      newTerms[index] = value;
      return { ...f, terms: newTerms };
    });
  };

  const handleItemField = (idx: number, field: string, value: any) => {
    setForm(f => {
      const newItems = f.items.map((it, i) => {
        if (i !== idx) return it;
        const updatedItem = { ...it, [field]: value };
        if (field === 'qty' || field === 'rate') {
          updatedItem[field] = parseFloat(value) || 0;
          updatedItem.value = (updatedItem.qty || 0) * (updatedItem.rate || 0);
        }
        return updatedItem;
      });
      return { ...f, items: newItems };
    });
  };

  const addItem = () => {
    setForm(f => ({
      ...f,
      items: [...f.items, {
        sr: f.items.length + 1,
        description: '',
        make: '',
        unit: '',
        qty: 0,
        rate: 0,
        value: 0
      }]
    }));
  };

  const removeItem = (index: number) => {
    setForm(f => ({
      ...f,
      items: f.items.filter((_, i) => i !== index).map((item, i) => ({ ...item, sr: i + 1 }))
    }));
  };

  const handleSave = () => { 
    setEditMode(false); 
    toast({ title: 'PO Updated', description: 'Purchase Order has been updated successfully.' }); 
  };

  const handleCancel = () => {
    setForm(JSON.parse(JSON.stringify(workOrderData)));
    setEditMode(false);
    toast({ title: 'Changes Cancelled', description: 'All changes have been discarded.' });
  };

  const items = form.items || [];
  const subTotal = items.reduce((sum, item) => sum + (item.value || 0), 0);
  const gstAmount = Math.round(subTotal * (form.gstPercent || 0) / 100);
  const grandTotal = subTotal + gstAmount;

  const renderEditableField = (value: string, onChange: (value: string) => void, className: string = '') => {
    if (!editMode) return <span className={className}>{value}</span>;
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-metropolis ${className}`}
      />
    );
  };

  const renderEditableTextarea = (value: string, onChange: (value: string) => void, className: string = '') => {
    if (!editMode) return <span className={className}>{value}</span>;
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-1 py-0.5 border border-gray-300 rounded text-xs resize-none font-metropolis ${className}`}
        rows={2}
      />
    );
  };

  const renderEditableNumber = (value: number, onChange: (value: number) => void, className: string = '') => {
    if (!editMode) return <span className={className}>{value}</span>;
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-metropolis ${className}`}
      />
    );
  };

  return (
    <div className="flex flex-col items-center w-full bg-gray-200 p-4 print:p-0 print:bg-white">
      {isCPD && (
        <div className="flex gap-2 mb-4 print:hidden">
          {editMode ? (
            <>
              <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600">
                Save
              </button>
              <button onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600">
              Edit
            </button>
          )}
          <button onClick={handleViewPDF} className="px-4 py-2 bg-white rounded-md shadow-sm hover:bg-gray-50">
            View PDF
          </button>
          <button onClick={handleDownloadPDF} className="px-4 py-2 bg-white rounded-md shadow-sm hover:bg-gray-50">
            Download PDF
          </button>
        </div>
      )}

      <div ref={printRef} className="w-[210mm] font-metropolis text-black">
        {/* Page 1 */}
        <div className="page-container w-full min-h-[297mm] p-6 flex flex-col bg-white shadow-xl mb-4 print:shadow-none print:mb-0 ">
          <header className="flex items-center justify-between border-b-2 border-black pb-2">
            <img src="/dpu_logo.png" alt="DPU Logo" className="h-8" />
            <div className="text-center">
              <p className="text-xs font-bold">
                {renderEditableField(form.subject, (value) => handleFieldChange('subject', value))}
              </p>
              <p className="font-bold text-lg leading-tight">
                {renderEditableField(form.society, (value) => handleFieldChange('society', value))}
              </p>
              <p className="font-bold text-base leading-tight">
                {renderEditableField(form.institute, (value) => handleFieldChange('institute', value))}
              </p>
              <p className="text-xs leading-tight">
                {renderEditableField(form.address, (value) => handleFieldChange('address', value))}
              </p>
              <p className="text-xs leading-tight">
                Ph. No. {renderEditableField(form.phone, (value) => handleFieldChange('phone', value))} 
                Fax: {renderEditableField(form.fax, (value) => handleFieldChange('fax', value))}
              </p>
              <p className="text-xs leading-tight">
                Email-ID: {renderEditableField(form.email, (value) => handleFieldChange('email', value))}, 
                PAN No: {renderEditableField(form.pan, (value) => handleFieldChange('pan', value))}, 
                GST No: {renderEditableField(form.gst, (value) => handleFieldChange('gst', value))}
              </p>
            </div>
            <div className="w-20 h-20 border border-black flex items-center justify-center text-sm font-bold">QR</div>
          </header>

          <main className="border border-t-0 border-black grid grid-cols-2 text-[13px]">
            <div className="p-2 border-r border-black">
              <div className="grid grid-cols-[auto_1fr] gap-x-2">
                <b>M/s.</b> 
                <span>{renderEditableField(form.vendor.name, (value) => handleVendorFieldChange('name', value))}</span>
              </div>
              <p>{renderEditableField(form.vendor.address, (value) => handleVendorFieldChange('address', value))}</p>
              <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-2 mt-1">
                <b>Contact Person:</b> 
                <span>{renderEditableField(form.vendor.contactPerson, (value) => handleVendorFieldChange('contactPerson', value))}</span>
                <b>Mob.No.:</b> 
                <span>{renderEditableField(form.vendor.mobile, (value) => handleVendorFieldChange('mobile', value))}</span>
                <b>Email:</b> 
                <span>{renderEditableField(form.vendor.email, (value) => handleVendorFieldChange('email', value))}</span>
                <b>PAN No.:</b> 
                <span>{renderEditableField(form.vendor.pan, (value) => handleVendorFieldChange('pan', value))}</span>
                <b>GST No.:</b> 
                <span>{renderEditableField(form.vendor.gst, (value) => handleVendorFieldChange('gst', value))}</span>
              </div>
            </div>
            <div className="p-2 grid grid-rows-5">
              <div className="grid grid-cols-2">
                <p><b>Indent No.:</b> {renderEditableField(form.indentNo, (value) => handleFieldChange('indentNo', value))}</p>
              </div>
              <div className="grid grid-cols-2">
                <p><b>W.O. No.:</b> {renderEditableField(form.woNo, (value) => handleFieldChange('woNo', value))}</p>
                <p><b>W.O.Date:</b> {renderEditableField(form.woDate, (value) => handleFieldChange('woDate', value))}</p>
              </div>
              <div className="grid grid-cols-2">
                <p><b>Quotation No.:</b> {renderEditableField(form.quotationNo, (value) => handleFieldChange('quotationNo', value))}</p>
                <p><b>Quotation Date:</b> {renderEditableField(form.quotationDate, (value) => handleFieldChange('quotationDate', value))}</p>
              </div>
              <div><p><b>Department:</b> {renderEditableField(form.department, (value) => handleFieldChange('department', value))}</p></div>
              <div><p><b>Material Type:</b> {renderEditableField(form.materialType, (value) => handleFieldChange('materialType', value))}</p></div>
            </div>
          </main>

          <div className="mt-4 text-sm">
            <p>Sir,</p>
            <p>With reference to your above mentioned quotation, we are pleased to give you this order for following supplies/services subject to the terms and conditions mentioned therein.</p>
          </div>

          <table className="w-full border-collapse border border-black text-center mt-2 text-[15px]">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-black p-1.5 w-12">Sr.No.</th>
                <th className="border border-black p-1.5">Description</th>
                <th className="border border-black p-1.5 w-20">Unit</th>
                <th className="border border-black p-1.5 w-16">Qty.</th>
                <th className="border border-black p-1.5 w-24">Rate in INR</th>
                <th className="border border-black p-1.5 w-28">Values in INR</th>
                {editMode && <th className="border border-black p-1.5 w-16">Actions</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1.5 font-bold text-left" colSpan={editMode ? 7 : 6}>
                  {renderEditableField(
                    'Work order for RO Plant Cleaning, Servicing, Supply & Installation of Spares Parts',
                    () => {}, // This is a static header, not editable
                    'font-bold text-left'
                  )}
                </td>
              </tr>
              {form.items.map((item, index) => (
                <tr key={item.sr}>
                  <td className="border border-black p-1.5">{item.sr}</td>
                  <td className="border border-black p-1.5 text-left">
                    <div>
                      <b>{editMode ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemField(index, 'description', e.target.value)}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-bold font-metropolis"
                        />
                      ) : item.description}</b>
                      <br />
                      Make: {editMode ? (
                        <input
                          type="text"
                          value={item.make}
                          onChange={(e) => handleItemField(index, 'make', e.target.value)}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-metropolis"
                        />
                      ) : item.make}
                    </div>
                  </td>
                  <td className="border border-black p-1.5">
                    {editMode ? (
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleItemField(index, 'unit', e.target.value)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-metropolis"
                      />
                    ) : item.unit}
                  </td>
                  <td className="border border-black p-1.5">
                    {editMode ? (
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleItemField(index, 'qty', parseFloat(e.target.value) || 0)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-metropolis"
                      />
                    ) : item.qty}
                  </td>
                  <td className="border border-black p-1.5 text-right">
                    {editMode ? (
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemField(index, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-right font-metropolis"
                      />
                    ) : item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="border border-black p-1.5 text-right">
                    {item.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  {editMode && (
                    <td className="border border-black p-1.5">
                      <button
                        onClick={() => removeItem(index)}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {editMode && (
                <tr>
                  <td colSpan={editMode ? 7 : 6} className="border border-black p-1.5">
                    <button
                      onClick={addItem}
                      className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 w-full"
                    >
                      Add Item
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={editMode ? 5 : 5} className="text-right font-bold p-1.5">Total</td>
                <td className="border border-black text-right font-bold p-1.5">{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                {editMode && <td></td>}
              </tr>
              <tr>
                <td colSpan={editMode ? 5 : 5} className="text-right p-1.5">
                  Add: Gst @ {editMode ? (
                    <input
                      type="number"
                      value={form.gstPercent}
                      onChange={(e) => handleFieldChange('gstPercent', parseFloat(e.target.value) || 0)}
                      className="w-12 px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-metropolis"
                    />
                  ) : form.gstPercent}%
                </td>
                <td className="border border-black text-right p-1.5">{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                {editMode && <td></td>}
              </tr>
              <tr>
                <td colSpan={editMode ? 5 : 5} className="border-y border-black font-bold p-1.5 text-left">
                  (INR in Words: {numberToWords(grandTotal)} only)
                </td>
                <td className="border border-black text-right font-bold p-1.5">{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                {editMode && <td></td>}
              </tr>
            </tfoot>
          </table>

          <footer className="mt-2 pt-3">
            <div
              className="p-2 flex-grow flex flex-col"
              style={{
                borderTop: '1px solid black',
                borderLeft: '1px solid black',
                borderRight: '1px solid black',
                borderBottom: 'none',
              }}
            >
              <h2 className="font-bold text-sm">TERMS & CONDITIONS</h2>
              <ol className="list-decimal ml-4 text-x10 space-y-0.5">
                {form.terms.slice(0, 4).map((term, i) => (
                  <li key={i}>
                    {editMode ? (
                      <textarea
                        value={term}
                        onChange={(e) => handleTermChange(i, e.target.value)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs resize-none font-metropolis"
                        rows={2}
                      />
                    ) : term}
                  </li>
                ))}
              </ol>
            </div>

            <hr className="border-t-2 border-gray-400 my-2" />
            <p className="text-center text-xs font-bold">Page 1 of 2</p>
          </footer>
        </div>

        {/* Page 2 */}
        <div className="page-container w-full min-h-[297mm] p-6 flex flex-col relative bg-white shadow-xl print:shadow-none">
          <div className="p-2 flex flex-col mt-5"
            style={{
              borderTop: 'none',
              borderLeft: '1px solid black',
              borderRight: '1px solid black',
              borderBottom: '1px solid black',
            }}>
            <div className="text-xs">
              <div className="flex justify-between">
                <b>M/s. {form.vendor.name}</b>
                <b>Date: {form.woDate}</b>
              </div>

              <div className="flex justify-between">
                <b>W.O. No.: {form.woNo}</b>
                <b>Grand Total: {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b>
              </div>
              <p className="font-bold mt-1">(INR in Words: {numberToWords(grandTotal)} only)</p>
            </div>
            <hr className="border-t-2 border-gray-400 my-2" />

            <ol className="list-decimal ml-4 text-x10 space-y-1 mt-2" start={5}>
              {form.terms.slice(4).map((term, i) => (
                <li key={i}>
                  {editMode ? (
                    <textarea
                      value={term}
                      onChange={(e) => handleTermChange(i + 4, e.target.value)}
                      className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs resize-none font-metropolis"
                      rows={2}
                    />
                  ) : term}
                </li>
              ))}
            </ol>

            <hr className="border-t-2 border-black my-4" />

            <div className="grid grid-cols-2 gap-y-3 gap-x-5 mt-3 text-x1">
              <p><b>GST</b> : {renderEditableField(form.tnc.gst, (value) => handleTncFieldChange('gst', value))}</p>
              <p><b>Warranty</b> : {renderEditableField(form.tnc.warranty, (value) => handleTncFieldChange('warranty', value))}</p>
              <p><b>Loading & Unloading</b> : {renderEditableField(form.tnc.loading, (value) => handleTncFieldChange('loading', value))}</p>
              <p><b>P & F /Transportation</b> : {renderEditableField(form.tnc.pf, (value) => handleTncFieldChange('pf', value))}</p>
              <p><b>Work/ Service Schedule</b> : {renderEditableField(form.tnc.schedule, (value) => handleTncFieldChange('schedule', value))}</p>
              <p><b>Work/ Service At</b> : {renderEditableField(form.tnc.at, (value) => handleTncFieldChange('at', value))}</p>
            </div>

            <hr className="border-t-2 border-black mt-7" />

            <p className="text-[15px]">
              <b>Payment Terms :</b> {renderEditableTextarea(form.tnc.payment, (value) => handleTncFieldChange('payment', value))}
            </p>

            <hr className="border-t-2 border-black" />

            <div className="flex justify-between items-end text-center text-sm">
              <div>
                <p className="font-bold pt-14">
                  {renderEditableField(form.preparedBy, (value) => handleFieldChange('preparedBy', value))}
                </p>
                <p className="border-t-2 border-black mt-1 px-4">Prepared By</p>
              </div>
              <div>
                <p className="font-bold">
                  {renderEditableField(form.checkedBy, (value) => handleFieldChange('checkedBy', value))}
                </p>
                <p className="border-t-2 border-black mt-1 px-4">Checked By</p>
              </div>
              <div>
                <p className="font-bold pb-10">For {form.society}</p>
                <p className="border-t-2 border-black mt-1 px-4">Secretary/ Vice-Chairman/ Chairman</p>
              </div>
            </div>
          </div>

          <span className="flex-grow" />

          <hr className="border-t-2 border-gray-400 my-2" />

          <p className="text-center text-xs mt-1 font-bold">Page 2 of 2</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPage;