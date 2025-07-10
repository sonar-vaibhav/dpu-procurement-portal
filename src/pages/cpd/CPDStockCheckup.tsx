import React, { useState, useRef } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const colleges = [
  'All Colleges',
  'Dr. D. Y. Patil Institute of Technology',
  'DPU School of Management',
  'DPU College of Pharmacy',
  'DPU College of Architecture',
];

const allStockItems = [
  {
    id: 'STK001',
    college: 'Dr. D. Y. Patil Institute of Technology',
    category: 'Laboratory Equipment',
    name: 'Microscope',
    totalQuantity: 10,
    inUse: 8,
    defective: 1,
    notes: 'High-precision research microscopes',
  },
  {
    id: 'STK002',
    college: 'Dr. D. Y. Patil Institute of Technology',
    category: 'Computer Hardware',
    name: 'Desktop Computers',
    totalQuantity: 50,
    inUse: 45,
    defective: 2,
    notes: 'Dell OptiPlex workstations',
  },
  {
    id: 'STK003',
    college: 'DPU School of Management',
    category: 'Office Supplies',
    name: 'Printers',
    totalQuantity: 15,
    inUse: 12,
    defective: 0,
    notes: 'HP LaserJet printers',
  },
  {
    id: 'STK004',
    college: 'DPU College of Pharmacy',
    category: 'Laboratory Equipment',
    name: 'Centrifuge',
    totalQuantity: 5,
    inUse: 4,
    defective: 0,
    notes: 'For chemical analysis',
  },
  {
    id: 'STK005',
    college: 'DPU College of Architecture',
    category: 'Furniture',
    name: 'Drafting Tables',
    totalQuantity: 20,
    inUse: 18,
    defective: 1,
    notes: 'Adjustable height',
  },
];

const CPDStockCheckup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeInput, setCollegeInput] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredColleges = colleges.filter(college =>
    college.toLowerCase().includes(collegeInput.toLowerCase())
  );

  const filteredItems = allStockItems.filter(item => {
    const matchesCollege = selectedCollege && item.college === selectedCollege;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCollege && matchesSearch;
  });

  const handleCollegeSelect = (college: string) => {
    setCollegeInput(college);
    setShowSuggestions(false);
    setSearchTerm('');
    setLoading(true);
    setTimeout(() => {
      setSelectedCollege(college === 'All Colleges' ? '' : college);
      setLoading(false);
    }, 1000);
    inputRef.current?.blur();
  };

  const handleClearCollege = () => {
    setCollegeInput('');
    setSelectedCollege('');
    setSearchTerm('');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Stock Checkup"
        subtitle="View and search stock across all colleges"
      />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative md:w-64">
                <Input
                  ref={inputRef}
                  placeholder="Search/select college..."
                  value={collegeInput}
                  onChange={e => {
                    setCollegeInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full"
                />
                {collegeInput && (
                  <button
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    onClick={handleClearCollege}
                    tabIndex={-1}
                  >
                    ×
                  </button>
                )}
                {showSuggestions && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-md max-h-48 overflow-y-auto">
                    {filteredColleges.length > 0 ? (
                      filteredColleges.map(college => (
                        <div
                          key={college}
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${college === selectedCollege ? 'bg-gray-100 font-semibold' : ''}`}
                          onClick={() => handleCollegeSelect(college)}
                        >
                          {college}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400">No colleges found</div>
                    )}
                  </div>
                )}
              </div>
              <Input
                placeholder="Search by item or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="md:max-w-sm"
                disabled={!selectedCollege}
              />
            </div>
            {loading && (
              <div className="w-full flex justify-center py-16">
                <svg className="animate-spin h-12 w-12 text-dpu-red" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
            )}
            {!selectedCollege && !loading && (
              <div className="text-center text-gray-400 py-16 text-lg">
                Please select a college to view stock items.
              </div>
            )}
            {selectedCollege && !loading && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>College</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Total Quantity</TableHead>
                      <TableHead>In Use</TableHead>
                      <TableHead>Defective</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.college}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.totalQuantity}</TableCell>
                        <TableCell>{item.inUse}</TableCell>
                        <TableCell>{item.defective}</TableCell>
                        <TableCell>{item.notes}</TableCell>
                      </TableRow>
                    ))}
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                          No stock items found for the selected college or search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CPDStockCheckup; 