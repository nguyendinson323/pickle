import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  CalendarIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { Tournament } from '../../types/tournament';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface TournamentAnalyticsProps {
  tournament?: Tournament;
  showGlobalStats?: boolean;
}

interface AnalyticsData {
  totalTournaments: number;
  totalParticipants: number;
  completedMatches: number;
  upcomingMatches: number;
  topPerformers: Array<{
    id: number;
    name: string;
    wins: number;
    matches: number;
    winRate: number;
  }>;
  monthlyStats: Array<{
    month: string;
    tournaments: number;
    participants: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  revenueStats: {
    totalRevenue: number;
    averageEntry: number;
    projectedRevenue: number;
  };
}

const TournamentAnalytics: React.FC<TournamentAnalyticsProps> = ({
  tournament,
  showGlobalStats = false
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Mock analytics data - replace with API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: AnalyticsData = {
          totalTournaments: tournament ? 1 : 24,
          totalParticipants: tournament ? tournament.maxParticipants || 32 : 486,
          completedMatches: tournament ? 12 : 156,
          upcomingMatches: tournament ? 8 : 42,
          topPerformers: [
            { id: 1, name: 'Carlos Martinez', wins: 18, matches: 22, winRate: 81.8 },
            { id: 2, name: 'Ana Rodriguez', wins: 16, matches: 20, winRate: 80.0 },
            { id: 3, name: 'Miguel Santos', wins: 14, matches: 18, winRate: 77.8 },
            { id: 4, name: 'Sofia Lopez', wins: 13, matches: 17, winRate: 76.5 },
            { id: 5, name: 'Diego Ramirez', wins: 12, matches: 16, winRate: 75.0 }
          ],
          monthlyStats: [
            { month: 'Jan', tournaments: 3, participants: 48 },
            { month: 'Feb', tournaments: 2, participants: 32 },
            { month: 'Mar', tournaments: 4, participants: 64 },
            { month: 'Apr', tournaments: 3, participants: 48 },
            { month: 'May', tournaments: 5, participants: 80 },
            { month: 'Jun', tournaments: 4, participants: 64 }
          ],
          categoryDistribution: [
            { category: 'Men\'s Singles', count: 8, percentage: 33.3 },
            { category: 'Women\'s Singles', count: 6, percentage: 25.0 },
            { category: 'Men\'s Doubles', count: 5, percentage: 20.8 },
            { category: 'Women\'s Doubles', count: 3, percentage: 12.5 },
            { category: 'Mixed Doubles', count: 2, percentage: 8.3 }
          ],
          revenueStats: {
            totalRevenue: tournament ? 12500 : 125000,
            averageEntry: 250,
            projectedRevenue: tournament ? 15000 : 180000
          }
        };

        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [tournament, timeRange]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const exportData = (format: 'csv' | 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting analytics data as ${format.toUpperCase()}`);
    
    // In real implementation, this would generate and download the file
    const filename = `tournament-analytics-${Date.now()}.${format}`;
    alert(`Analytics data exported as ${filename}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500 text-5xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Analytics Unavailable
        </h3>
        <p className="text-gray-600">
          Unable to load analytics data at this time.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {tournament ? `${tournament.name} Analytics` : 'Tournament Analytics'}
          </h2>
          <p className="text-gray-600 mt-1">
            {showGlobalStats ? 'System-wide tournament statistics' : 'Detailed tournament insights and performance metrics'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>

          {/* Export Dropdown */}
          <div className="relative group">
            <Button variant="outline" className="flex items-center gap-2">
              <DocumentArrowDownIcon className="h-4 w-4" />
              Export
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-2">
                <button
                  onClick={() => exportData('csv')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => exportData('excel')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export as Excel
                </button>
                <button
                  onClick={() => exportData('pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tournaments</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.totalTournaments}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.totalParticipants}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Matches</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.completedMatches}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Matches</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.upcomingMatches}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('performers')}
        >
          <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
          {expandedSection === 'performers' ? 
            <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          }
        </div>
        
        {expandedSection === 'performers' && (
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Player</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Wins</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Matches</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.topPerformers.map((player, index) => (
                    <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {player.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {player.wins}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {player.matches}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          player.winRate >= 80 
                            ? 'bg-green-100 text-green-800' 
                            : player.winRate >= 70 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {player.winRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Monthly Trends */}
      {showGlobalStats && (
        <Card className="p-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('trends')}
          >
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            {expandedSection === 'trends' ? 
              <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            }
          </div>
          
          {expandedSection === 'trends' && (
            <div className="mt-6">
              <div className="grid grid-cols-6 gap-4">
                {analyticsData.monthlyStats.map((stat) => (
                  <div key={stat.month} className="text-center">
                    <div className="bg-blue-100 rounded-lg p-4 mb-2">
                      <div className="text-lg font-bold text-blue-600">
                        {stat.tournaments}
                      </div>
                      <div className="text-xs text-blue-500">Tournaments</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-4 mb-2">
                      <div className="text-lg font-bold text-green-600">
                        {stat.participants}
                      </div>
                      <div className="text-xs text-green-500">Participants</div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {stat.month}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Category Distribution */}
      <Card className="p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('categories')}
        >
          <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
          {expandedSection === 'categories' ? 
            <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          }
        </div>
        
        {expandedSection === 'categories' && (
          <div className="mt-4 space-y-4">
            {analyticsData.categoryDistribution.map((category) => (
              <div key={category.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {category.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {category.count} ({category.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Revenue Stats */}
      {showGlobalStats && (
        <Card className="p-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('revenue')}
          >
            <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
            {expandedSection === 'revenue' ? 
              <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            }
          </div>
          
          {expandedSection === 'revenue' && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${analyticsData.revenueStats.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Total Revenue</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${analyticsData.revenueStats.averageEntry}
                  </div>
                  <div className="text-sm text-blue-700">Average Entry Fee</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${analyticsData.revenueStats.projectedRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-700">Projected Revenue</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <EyeIcon className="h-4 w-4" />
            View Detailed Report
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4" />
            Generate Custom Report
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Schedule Report
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TournamentAnalytics;