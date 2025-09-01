import React, { useState } from 'react';
import { Download, FileText, TrendingUp, Users, Trophy } from 'lucide-react';
import Card from '../components/ui/Card';
import ExportManager from '../components/export/ExportManager';
import exportService, { ExportOptions } from '../services/exportService';

const ExportPage: React.FC = () => {
  const [activeExport, setActiveExport] = useState<'tournaments' | 'players' | 'analytics' | 'reports'>('tournaments');
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<Array<{
    id: string;
    type: string;
    format: string;
    date: string;
    status: 'completed' | 'failed';
  }>>([]);

  const handleExport = async (options: ExportOptions) => {
    setIsExporting(true);
    
    try {
      switch (activeExport) {
        case 'tournaments':
          const tournamentData = await exportService.getRealTournamentData(options);
          await exportService.exportTournaments(tournamentData, options);
          break;
        case 'players':
          const playerData = await exportService.getRealPlayerData(options);
          await exportService.exportPlayers(playerData, options);
          break;
        case 'analytics':
          const analyticsData = await exportService.getRealAnalyticsData();
          await exportService.exportAnalytics(analyticsData, options);
          break;
        case 'reports':
          // Custom report logic would go here
          console.log('Custom report export not implemented yet');
          break;
      }
      
      // Add to export history
      const newExport = {
        id: Date.now().toString(),
        type: activeExport,
        format: options.format,
        date: new Date().toISOString(),
        status: 'completed' as const
      };
      setExportHistory(prev => [newExport, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Export failed:', error);
      const failedExport = {
        id: Date.now().toString(),
        type: activeExport,
        format: options.format,
        date: new Date().toISOString(),
        status: 'failed' as const
      };
      setExportHistory(prev => [failedExport, ...prev.slice(0, 9)]);
    } finally {
      setIsExporting(false);
    }
  };

  const exportTypes = [
    {
      key: 'tournaments' as const,
      label: 'Tournaments',
      icon: Trophy,
      description: 'Export tournament data, registrations, and results',
      color: 'text-yellow-600'
    },
    {
      key: 'players' as const,
      label: 'Players',
      icon: Users,
      description: 'Export player profiles, statistics, and rankings',
      color: 'text-blue-600'
    },
    {
      key: 'analytics' as const,
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Export performance metrics and growth reports',
      color: 'text-green-600'
    },
    {
      key: 'reports' as const,
      label: 'Custom Reports',
      icon: FileText,
      description: 'Create and export custom data reports',
      color: 'text-purple-600'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto mobile-container">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Download className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Export</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Type Selection */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Type</h2>
              <div className="space-y-3">
                {exportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.key}
                      onClick={() => setActiveExport(type.key)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        activeExport === type.key
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 ${type.color}`} />
                        <div>
                          <h3 className="font-medium text-gray-900">{type.label}</h3>
                          <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Export History */}
            <Card className="p-4 sm:p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Exports</h2>
              {exportHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No exports yet</p>
              ) : (
                <div className="space-y-3">
                  {exportHistory.map((exportItem) => (
                    <div key={exportItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {exportItem.type.charAt(0).toUpperCase() + exportItem.type.slice(1)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {exportItem.format.toUpperCase()} • {formatDate(exportItem.date)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exportItem.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exportItem.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Export Configuration */}
          <div className="lg:col-span-2">
            <ExportManager
              exportType={activeExport}
              onExport={handleExport}
              isExporting={isExporting}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-500">Total Tournaments</p>
          </Card>
          
          <Card className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">456</p>
            <p className="text-sm text-gray-500">Registered Players</p>
          </Card>
          
          <Card className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">$123.5K</p>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </Card>
          
          <Card className="p-4 text-center">
            <FileText className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{exportHistory.length}</p>
            <p className="text-sm text-gray-500">Exports Generated</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;