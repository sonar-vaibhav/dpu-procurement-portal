import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, ChevronsUpDown, Check } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
    categories: [] as string[],
    designation: '',
    department: '',
    notes: '',
  });
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleCategoryRemove = (categoryToRemove: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== categoryToRemove)
    }));
  };

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    // Minimal validation
    if (!form.name || !form.contact || !form.email || !form.password || form.categories.length === 0) {
      setError('Please fill all required fields including at least one category.');
      return;
    }
    setOfficers(prev => [
      ...prev,
      { ...form, id: Date.now().toString() }
    ]);
    setForm({ name: '', contact: '', email: '', password: '', categories: [], designation: '', department: '', notes: '' });
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
                  <label className="block text-sm font-medium mb-1">Categories *</label>
                  <div className="space-y-2">
                    {/* Selected Categories Display */}
                    {form.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-gray-50">
                        {form.categories.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => handleCategoryRemove(category)}
                              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Category Selection Dropdown */}
                    <Popover open={categoryDropdownOpen} onOpenChange={setCategoryDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={categoryDropdownOpen}
                          className="w-full justify-between"
                        >
                          {form.categories.length === 0 
                            ? "Select categories" 
                            : `${form.categories.length} category${form.categories.length > 1 ? 'ies' : 'y'} selected`
                          }
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search categories..." />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {CATEGORIES.map((category) => (
                                <CommandItem
                                  key={category}
                                  onSelect={() => handleCategoryToggle(category)}
                                  className="flex items-center justify-between"
                                >
                                  <span>{category}</span>
                                  {form.categories.includes(category) && (
                                    <Check className="h-4 w-4 text-green-600" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
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
                      <th className="px-3 py-2 text-left font-semibold">Categories</th>
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
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {officer.categories && officer.categories.length > 0 ? (
                              officer.categories.map((category: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {category}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs">No categories</span>
                            )}
                          </div>
                        </td>
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