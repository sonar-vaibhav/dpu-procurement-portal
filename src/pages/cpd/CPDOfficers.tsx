import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = [
  'Laboratory',
  'IT Equipment',
  'Stationery',
  'Furniture',
  'General',
];

const DESIGNATIONS = [
  'Procurement Officer',
  'Assistant Officer',
  'Senior Officer',
  'Other',
];

const DEPARTMENTS = [
  'CPD',
  'Store',
  'Registrar',
  'Other',
];

const CPDOfficers: React.FC = () => {
  const [officers, setOfficers] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    password: '',
    category: '',
    designation: '',
    department: '',
    notes: '',
  });
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    // Minimal validation
    if (!form.name || !form.contact || !form.email || !form.password || !form.category) {
      setError('Please fill all required fields.');
      return;
    }
    setOfficers(prev => [
      ...prev,
      { ...form, id: Date.now().toString() }
    ]);
    setForm({ name: '', contact: '', email: '', password: '', category: '', designation: '', department: '', notes: '' });
    setError('');
  };

  const handleDeleteOfficer = (id: string) => {
    setOfficers(prev => prev.filter(officer => officer.id !== id));
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Officer Management"
        subtitle="Add and manage procurement officers"
      />
      <div className="p-6 max-w-5xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Officer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddOfficer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <Input value={form.name} onChange={e => handleChange('name', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Number *</label>
                  <Input value={form.contact} onChange={e => handleChange('contact', e.target.value)} required maxLength={15} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <Input value={form.email} onChange={e => handleChange('email', e.target.value)} required type="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <Input value={form.password} onChange={e => handleChange('password', e.target.value)} required type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <Select value={form.category} onValueChange={v => handleChange('category', v)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Designation</label>
                  <Select value={form.designation} onValueChange={v => handleChange('designation', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGNATIONS.map(des => (
                        <SelectItem key={des} value={des}>{des}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <Select value={form.department} onValueChange={v => handleChange('department', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(dep => (
                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
              <Button type="submit" className="dpu-button-primary">Add Officer</Button>
            </form>
          </CardContent>
        </Card>
        {/* Officer List */}
        <Card>
          <CardHeader>
            <CardTitle>Officer List</CardTitle>
          </CardHeader>
          <CardContent>
            {officers.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No officers added yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Name</th>
                      <th className="px-3 py-2 text-left font-semibold">Contact</th>
                      <th className="px-3 py-2 text-left font-semibold">Email</th>
                      <th className="px-3 py-2 text-left font-semibold">Category</th>
                      <th className="px-3 py-2 text-left font-semibold">Designation</th>
                      <th className="px-3 py-2 text-left font-semibold">Department</th>
                      <th className="px-3 py-2 text-left font-semibold">Notes</th>
                      <th className="px-3 py-2 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officers.map(officer => (
                      <tr key={officer.id} className="even:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-900">{officer.name}</td>
                        <td className="px-3 py-2">{officer.contact}</td>
                        <td className="px-3 py-2">{officer.email}</td>
                        <td className="px-3 py-2"><Badge variant="outline">{officer.category}</Badge></td>
                        <td className="px-3 py-2">{officer.designation}</td>
                        <td className="px-3 py-2">{officer.department}</td>
                        <td className="px-3 py-2 text-xs text-gray-500">{officer.notes}</td>
                        <td className="px-3 py-2">
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDeleteOfficer(officer.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CPDOfficers; 