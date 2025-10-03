
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SystemField } from '@/data/systemFields';
import { categorizeSFMField, SFM_CATEGORY_CONFIG } from './SFMCategorization';
import { Search, X } from 'lucide-react';

export interface FilterOptions {
  search: string;
  sfmCode: string;
  outputType: string;
  page: string;
  sponsorshipYear: string;
}

interface SystemFieldsFilterProps {
  fields: SystemField[];
  onFilterChange: (filteredFields: SystemField[], filters: FilterOptions) => void;
}

const SystemFieldsFilter = ({ fields, onFilterChange }: SystemFieldsFilterProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    sfmCode: '',
    outputType: 'all',
    page: 'all',
    sponsorshipYear: 'all'
  });

  // Extract unique values for dropdowns
  const outputTypes = Array.from(new Set(
    fields.map(field => categorizeSFMField(field.description, field.sfmId))
  )).sort();

  const pages = Array.from(new Set(
    fields.map(field => field.pageName)
  )).sort();

  const sponsorshipYears = Array.from(new Set(
    fields
      .map(field => field.sfmId.match(/-(\d+)$/)?.[1])
      .filter(Boolean)
  )).sort((a, b) => parseInt(a!) - parseInt(b!));

  const applyFilters = (newFilters: FilterOptions) => {
    let filteredFields = fields;

    // General search filter
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      filteredFields = filteredFields.filter(field =>
        field.description.toLowerCase().includes(searchTerm) ||
        field.pageName.toLowerCase().includes(searchTerm) ||
        field.cardName.toLowerCase().includes(searchTerm) ||
        field.correlatedTo.toLowerCase().includes(searchTerm)
      );
    }

    // SFM Code specific filter
    if (newFilters.sfmCode) {
      const sfmCodeTerm = newFilters.sfmCode.toLowerCase().replace(/^sfm-?/, ''); // Remove SFM- prefix if provided
      filteredFields = filteredFields.filter(field => {
        const sfmCode = field.sfmId.toLowerCase();
        return sfmCode.includes(sfmCodeTerm) || 
               sfmCode.replace('sfm-', '').includes(sfmCodeTerm);
      });
    }

    // Output type filter
    if (newFilters.outputType && newFilters.outputType !== 'all') {
      filteredFields = filteredFields.filter(field =>
        categorizeSFMField(field.description, field.sfmId) === newFilters.outputType
      );
    }

    // Page filter
    if (newFilters.page && newFilters.page !== 'all') {
      filteredFields = filteredFields.filter(field =>
        field.pageName === newFilters.page
      );
    }

    // Sponsorship year filter
    if (newFilters.sponsorshipYear && newFilters.sponsorshipYear !== 'all') {
      filteredFields = filteredFields.filter(field =>
        field.sfmId.endsWith(`-${newFilters.sponsorshipYear}`)
      );
    }

    onFilterChange(filteredFields, newFilters);
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      sfmCode: '',
      outputType: 'all',
      page: 'all',
      sponsorshipYear: 'all'
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    (key === 'search' || key === 'sfmCode') ? value !== '' : value !== 'all'
  );

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filter SFM Fields</h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* SFM Code Search (Priority Position) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">SFM Code</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="e.g. 006, 028-1, SFM-012"
              value={filters.sfmCode}
              onChange={(e) => updateFilter('sfmCode', e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-[8px] text-gray-500">Search by SFM code number or pattern</p>
        </div>

        {/* General Search Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">General Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search descriptions..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Output Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Output Type</label>
          <Select value={filters.outputType} onValueChange={(value) => updateFilter('outputType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Output Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Output Types</SelectItem>
              {outputTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${SFM_CATEGORY_CONFIG[type as keyof typeof SFM_CATEGORY_CONFIG].color}`}></div>
                    {SFM_CATEGORY_CONFIG[type as keyof typeof SFM_CATEGORY_CONFIG].name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Page/Tab</label>
          <Select value={filters.page} onValueChange={(value) => updateFilter('page', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Pages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              {pages.map((page) => (
                <SelectItem key={page} value={page}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sponsorship Year Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sponsorship Year</label>
          <Select value={filters.sponsorshipYear} onValueChange={(value) => updateFilter('sponsorshipYear', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {sponsorshipYears.map((year) => (
                <SelectItem key={year} value={year!}>
                  Year {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-gray-600 dark:text-gray-300">Active filters:</span>
          {filters.sfmCode && (
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-[8px] rounded font-mono">
              SFM: "{filters.sfmCode}"
            </span>
          )}
          {filters.search && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[8px] rounded">
              Search: "{filters.search}"
            </span>
          )}
          {filters.outputType && filters.outputType !== 'all' && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-[8px] rounded">
              Type: {SFM_CATEGORY_CONFIG[filters.outputType as keyof typeof SFM_CATEGORY_CONFIG].name}
            </span>
          )}
          {filters.page && filters.page !== 'all' && (
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[8px] rounded">
              Page: {filters.page}
            </span>
          )}
          {filters.sponsorshipYear && filters.sponsorshipYear !== 'all' && (
            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-[8px] rounded">
              Year: {filters.sponsorshipYear}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemFieldsFilter;
