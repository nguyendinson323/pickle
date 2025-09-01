import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import TournamentAnalytics from '../../components/tournaments/TournamentAnalytics';

const TournamentAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-4 flex items-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Tournament Analytics
            </h1>
          </div>
          <p className="text-gray-600">
            Comprehensive analytics and insights for tournament management and performance tracking.
          </p>
        </div>

        {/* Analytics Component */}
        <TournamentAnalytics showGlobalStats={true} />
      </div>
    </div>
  );
};

export default TournamentAnalyticsPage;