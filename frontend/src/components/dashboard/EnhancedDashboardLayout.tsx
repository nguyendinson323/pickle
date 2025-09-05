import React, { useState } from 'react';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import { RoleConfig, NavigationItem, UserRole } from '@/types/navigation';
import EnhancedSidebar from './EnhancedSidebar';
import EnhancedHeader from './EnhancedHeader';
import { useNotifications } from '@/hooks/useNotifications';
import {
  HomeIcon,
  UsersIcon,
  InboxIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  TrophyIcon,
  ChartBarIcon,
  UserIcon,
  CogIcon,
  CheckBadgeIcon,
  AcademicCapIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface EnhancedDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

const EnhancedDashboardLayout: React.FC<EnhancedDashboardLayoutProps> = ({
  children,
  title,
  actions
}) => {
  const user = useAppSelector(selectUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const notifications = useNotifications();

  const getRoleConfig = (role: UserRole): RoleConfig => {
    const configs: Record<UserRole, RoleConfig> = {
      admin: {
        title: 'Federation Administration',
        color: 'red',
        navigation: [
          { name: 'Overview', href: '/dashboard', icon: HomeIcon, current: true },
          { name: 'User Management', href: '/admin/users', icon: UsersIcon },
          { name: 'Messaging', href: '/admin/messages', icon: InboxIcon },
          { name: 'Court Registry', href: '/admin/courts', icon: BuildingOfficeIcon },
          { name: 'Payments & Memberships', href: '/admin/payments', icon: CreditCardIcon },
          { name: 'Reports', href: '/admin/reports', icon: DocumentTextIcon },
          { name: 'Microsite Management', href: '/admin/microsites', icon: GlobeAltIcon },
          { name: 'Tournament System', href: '/admin/tournaments', icon: TrophyIcon },
          { name: 'Rankings', href: '/admin/rankings', icon: ChartBarIcon },
        ]
      },
      state: {
        title: 'State Committee',
        color: 'blue',
        navigation: [
          { name: 'State Overview', href: '/dashboard', icon: HomeIcon, current: true },
          { name: 'My Account', href: '/profile', icon: UserIcon },
          { name: 'Inbox', href: '/messages', icon: InboxIcon, badge: notifications.unread },
          { name: 'Management', href: '/state/management', icon: CogIcon },
          { name: 'Microsite', href: '/state/microsite', icon: GlobeAltIcon },
          { name: 'Statistics', href: '/state/statistics', icon: ChartBarIcon },
          { name: 'Documents', href: '/state/documents', icon: DocumentTextIcon },
          { name: 'Affiliation', href: '/state/affiliation', icon: CheckBadgeIcon },
          { name: 'Members', href: '/state/members', icon: UsersIcon },
        ]
      },
      club: {
        title: 'Club Management',
        color: 'green',
        navigation: [
          { name: 'Club Overview', href: '/dashboard', icon: HomeIcon, current: true },
          { name: 'My Account', href: '/profile', icon: UserIcon },
          { name: 'Inbox', href: '/messages', icon: InboxIcon, badge: notifications.unread },
          { name: 'Microsite', href: '/club/microsite', icon: GlobeAltIcon },
          { name: 'Statistics', href: '/club/statistics', icon: ChartBarIcon },
          { name: 'Documents', href: '/club/documents', icon: DocumentTextIcon },
          { name: 'Affiliation', href: '/club/affiliation', icon: CheckBadgeIcon },
          { name: 'Management', href: '/club/management', icon: CogIcon },
          { name: 'Members', href: '/club/members', icon: UsersIcon },
        ]
      },
      partner: {
        title: 'Partner Portal',
        color: 'purple',
        navigation: [
          { name: 'Partner Overview', href: '/dashboard', icon: HomeIcon, current: true },
          { name: 'My Account', href: '/profile', icon: UserIcon },
          { name: 'Inbox', href: '/messages', icon: InboxIcon, badge: notifications.unread },
          { name: 'Microsite', href: '/partner/microsite', icon: GlobeAltIcon },
          { name: 'Statistics', href: '/partner/statistics', icon: ChartBarIcon },
          { name: 'Documents', href: '/partner/documents', icon: DocumentTextIcon },
          { name: 'Management', href: '/partner/management', icon: CogIcon },
        ]
      },
      coach: {
        title: 'Coach Portal',
        color: 'indigo',
        navigation: [
          { name: 'My Credential', href: '/dashboard', icon: CheckBadgeIcon, current: true },
          { name: 'My Account', href: '/profile', icon: UserIcon },
          { name: 'Inbox', href: '/messages', icon: InboxIcon, badge: notifications.unread },
          { name: 'Player Connection', href: '/coach/connection', icon: UsersIcon },
          { name: 'Certifications', href: '/coach/certifications', icon: AcademicCapIcon },
          { name: 'Match History', href: '/coach/matches', icon: ClockIcon },
          { name: 'Training Plans', href: '/coach/training', icon: DocumentTextIcon },
        ]
      },
      player: {
        title: 'Player Portal',
        color: 'cyan',
        navigation: [
          { name: 'My Credential', href: '/dashboard', icon: CheckBadgeIcon, current: true },
          { name: 'My Account', href: '/profile', icon: UserIcon },
          { name: 'Inbox', href: '/messages', icon: InboxIcon, badge: notifications.unread },
          { name: 'Player Connection', href: '/player/connection', icon: UsersIcon },
          { name: 'Tournaments', href: '/tournaments', icon: TrophyIcon },
          { name: 'Court Reservations', href: '/courts', icon: CalendarIcon },
          { name: 'Rankings', href: '/rankings', icon: ChartBarIcon },
          { name: 'Match History', href: '/player/matches', icon: ClockIcon },
        ]
      }
    };
    
    return configs[role] || configs.player;
  };

  const roleConfig = getRoleConfig((user?.role as UserRole) || 'player');

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <EnhancedSidebar 
        navigation={roleConfig.navigation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        roleConfig={roleConfig}
      />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top header */}
        <EnhancedHeader 
          title={title || roleConfig.title}
          onMenuClick={() => setSidebarOpen(true)}
          actions={actions}
        />

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnhancedDashboardLayout;