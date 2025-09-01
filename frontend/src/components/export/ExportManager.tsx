import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Camera, Mail, Filter } from 'lucide-react';
import Card from '../ui/Card';
import FormField from '../forms/FormField';
import SelectField from '../forms/SelectField';

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    status: string;
    category: string;
    location: string;
  };
  includeImages: boolean;
  emailReport: boolean;
  emailAddress?: string;
}

interface ExportManagerProps {
  exportType: 'tournaments' | 'players' | 'analytics' | 'reports';
  onExport: (options: ExportOptions) => Promise<void>;
  isExporting?: boolean;
}

const ExportManager: React.FC<ExportManagerProps> = ({
  exportType,
  onExport,
  isExporting = false
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    filters: {
      status: '',
      category: '',
      location: ''
    },
    includeImages: true,
    emailReport: false
  });

  const handleOptionChange = (field: string, value: any) => {
    setOptions(prev => {
      const newOptions = { ...prev };
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        (newOptions as any)[parent] = {
          ...(newOptions as any)[parent],
          [child]: value
        };
      } else {
        (newOptions as any)[field] = value;
      }
      return newOptions;
    });
  };

  const handleExport = async () => {
    try {
      await onExport(options);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'excel':
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const getExportTitle = () => {
    switch (exportType) {
      case 'tournaments':
        return 'Export Tournament Data';
      case 'players':
        return 'Export Player Data';
      case 'analytics':
        return 'Export Analytics Report';
      case 'reports':
        return 'Export Custom Report';
      default:
        return 'Export Data';
    }
  };

  const getStatusOptions = () => {
    switch (exportType) {
      case 'tournaments':
        return [
          { value: '', label: 'All Statuses' },
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'registration_open', label: 'Registration Open' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' }
        ];
      case 'players':
        return [
          { value: '', label: 'All Statuses' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'suspended', label: 'Suspended' }
        ];
      default:
        return [{ value: '', label: 'All Statuses' }];
    }
  };

  const getCategoryOptions = () => {
    switch (exportType) {
      case 'tournaments':
        return [
          { value: '', label: 'All Categories' },
          { value: 'singles', label: 'Singles' },
          { value: 'doubles', label: 'Doubles' },
          { value: 'mixed', label: 'Mixed Doubles' },
          { value: 'team', label: 'Team Event' }
        ];
      case 'players':
        return [
          { value: '', label: 'All Categories' },
          { value: 'recreational', label: 'Recreational' },
          { value: 'competitive', label: 'Competitive' },
          { value: 'professional', label: 'Professional' }
        ];
      default:
        return [{ value: '', label: 'All Categories' }];
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">{getExportTitle()}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SelectField
            name="format"
            label="Export Format"
            value={options.format}
            onChange={(value) => handleOptionChange('format', value)}
            options={[
              { value: 'pdf', label: 'PDF Report' },
              { value: 'excel', label: 'Excel Spreadsheet' },
              { value: 'csv', label: 'CSV File' },
              { value: 'json', label: 'JSON Data' }
            ]}
          />

          <FormField
            name="startDate"
            label="Start Date"
            type="date"
            value={options.dateRange.start}
            onChange={(value) => handleOptionChange('dateRange.start', value)}
          />

          <FormField
            name="endDate"
            label="End Date"
            type="date"
            value={options.dateRange.end}
            onChange={(value) => handleOptionChange('dateRange.end', value)}
          />
        </div>

        <div className="space-y-4">
          <SelectField
            name="status"
            label="Status Filter"
            value={options.filters.status}
            onChange={(value) => handleOptionChange('filters.status', value)}
            options={getStatusOptions()}
          />

          <SelectField
            name="category"
            label="Category Filter"
            value={options.filters.category}
            onChange={(value) => handleOptionChange('filters.category', value)}
            options={getCategoryOptions()}
          />

          <SelectField
            name="location"
            label="Location Filter"
            value={options.filters.location}
            onChange={(value) => handleOptionChange('filters.location', value)}
            options={[
              { value: '', label: 'All Locations' },
              { value: 'cdmx', label: 'Ciudad de México' },
              { value: 'jalisco', label: 'Jalisco' },
              { value: 'nuevo_leon', label: 'Nuevo León' },
              { value: 'yucatan', label: 'Yucatán' },
              { value: 'puebla', label: 'Puebla' }
            ]}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Camera className="h-5 w-5 text-gray-500" />
            <div>
              <h4 className="font-medium text-gray-900">Include Images</h4>
              <p className="text-sm text-gray-500">Embed images in PDF reports</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeImages}
              onChange={(e) => handleOptionChange('includeImages', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <h4 className="font-medium text-gray-900">Email Report</h4>
              <p className="text-sm text-gray-500">Send export to email address</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={options.emailReport}
              onChange={(e) => handleOptionChange('emailReport', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {options.emailReport && (
          <FormField
            name="emailAddress"
            label="Email Address"
            type="email"
            value={options.emailAddress || ''}
            onChange={(value) => handleOptionChange('emailAddress', value)}
            placeholder="Enter email address"
          />
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={handleExport}
          disabled={isExporting || (options.emailReport && !options.emailAddress)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Exporting...
            </>
          ) : (
            <>
              {getFormatIcon(options.format)}
              Export {options.format.toUpperCase()}
            </>
          )}
        </button>
        
        <button
          type="button"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Preview
        </button>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Export Summary</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>Format: {options.format.toUpperCase()}</p>
          <p>Date Range: {options.dateRange.start} to {options.dateRange.end}</p>
          {options.filters.status && <p>Status: {options.filters.status}</p>}
          {options.filters.category && <p>Category: {options.filters.category}</p>}
          {options.filters.location && <p>Location: {options.filters.location}</p>}
        </div>
      </div>
    </Card>
  );
};

export default ExportManager;