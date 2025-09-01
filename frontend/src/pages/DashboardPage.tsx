import React from 'react';
import { useAppSelector } from '@/store';
import { selectCurrentUser } from '@/store/authSlice';
import { USER_ROLES } from '@/utils/constants';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PlayerDashboard from '@/components/dashboards/PlayerDashboard';
import CoachDashboard from '@/components/dashboards/CoachDashboard';
import ClubDashboard from '@/components/dashboards/ClubDashboard';
import PartnerDashboard from '@/components/dashboards/PartnerDashboard';
import StateDashboard from '@/components/dashboards/StateDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

const DashboardPage: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  // Route to the appropriate dashboard based on user role
  switch (user.role) {
    case USER_ROLES.PLAYER:
      return <PlayerDashboard />;
    case USER_ROLES.COACH:
      return <CoachDashboard />;
    case USER_ROLES.CLUB:
      return <ClubDashboard />;
    case USER_ROLES.PARTNER:
      return <PartnerDashboard />;
    case USER_ROLES.STATE:
      return <StateDashboard />;
    case USER_ROLES.FEDERATION:
      return <AdminDashboard />;
    default:
      // Fallback for unknown roles - show player dashboard
      return <PlayerDashboard />;
  }
};

export default DashboardPage;