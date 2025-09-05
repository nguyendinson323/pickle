# 03. Dashboard Functionality Implementation - Role-Based Complete System

## Overview
The current project has incomplete dashboard implementations. Each user role requires specific functionality and workflows according to the admin requirements. The dashboards need to be fully functional with proper data integration, navigation, and role-specific features.

## Current State Analysis

### Missing Critical Features
1. **Role-Specific Navigation**: Different sidebar menus per role
2. **Real-Time Data Integration**: Live statistics and updates
3. **Interactive Components**: Functional widgets and actions
4. **Notification Center**: Inbox and messaging system
5. **Quick Actions**: Context-specific shortcuts
6. **Data Visualization**: Charts and graphs for statistics

## Step-by-Step Implementation Plan

### Phase 1: Dashboard Layout System

#### 1.1 Enhanced Dashboard Layout (`frontend/src/components/dashboard/DashboardLayout.tsx`)
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title,
  actions 
}) => {
  const user = useAppSelector(selectCurrentUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useNotifications();

  const getRoleConfig = (role: UserRole) => {
    const configs: Record<UserRole, {
      title: string;
      color: string;
      navigation: NavigationItem[];
    }> = {
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
          { name: 'Affiliation', href: '/state/affiliation', icon: BadgeCheckIcon },
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
          { name: 'Affiliation', href: '/club/affiliation', icon: BadgeCheckIcon },
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
          { name: 'My Credential', href: '/dashboard', icon: BadgeCheckIcon, current: true },
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
          { name: 'My Credential', href: '/dashboard', icon: BadgeCheckIcon, current: true },
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

  const roleConfig = getRoleConfig(user?.role || 'player');

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        navigation={roleConfig.navigation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        roleConfig={roleConfig}
      />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top header */}
        <Header 
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
```

#### 1.2 Enhanced Sidebar Component (`frontend/src/components/dashboard/Sidebar.tsx`)
```typescript
interface SidebarProps {
  navigation: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
  roleConfig: {
    title: string;
    color: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  navigation, 
  isOpen, 
  onClose,
  roleConfig 
}) => {
  const location = useLocation();
  const user = useAppSelector(selectCurrentUser);

  const isCurrentPath = (href: string) => {
    return location.pathname === href || 
           (href !== '/dashboard' && location.pathname.startsWith(href));
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-900 text-red-100',
      blue: 'bg-blue-900 text-blue-100', 
      green: 'bg-green-900 text-green-100',
      purple: 'bg-purple-900 text-purple-100',
      indigo: 'bg-indigo-900 text-indigo-100',
      cyan: 'bg-cyan-900 text-cyan-100',
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 flex z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onClose}
            aria-hidden="true"
          />
          <SidebarContent />
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent />
      </div>
    </>
  );

  function SidebarContent() {
    return (
      <div className={`flex-1 flex flex-col min-h-0 ${getColorClasses(roleConfig.color)}`}>
        {/* Sidebar header */}
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="h-8 w-auto"
              src="/admin-logo-white.png"
              alt="Mexican Pickleball Federation"
            />
            <h1 className="ml-3 text-sm font-semibold">
              {roleConfig.title}
            </h1>
          </div>

          {/* User info */}
          <div className="mt-6 px-4">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full"
                src={user?.profilePhotoUrl || '/default-avatar.png'}
                alt=""
              />
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs opacity-75 capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const current = isCurrentPath(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    current
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white text-opacity-75 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                  onClick={() => onClose()}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      current ? 'text-white' : 'text-white text-opacity-75'
                    }`}
                  />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User menu */}
        <div className="flex-shrink-0 bg-black bg-opacity-20 p-4">
          <Menu as="div" className="relative">
            <Menu.Button className="w-full text-left flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-25 rounded-md p-2 hover:bg-white hover:bg-opacity-10 transition-colors">
              <UserIcon className="h-5 w-5 mr-2" />
              Account Settings
              <ChevronUpIcon className="ml-auto h-4 w-4" />
            </Menu.Button>
            
            <Menu.Items className="absolute bottom-full left-0 w-full bg-white rounded-md shadow-lg py-1 mb-2">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    Edit Profile
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/settings"
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    Settings
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {/* handle logout */}}
                    className={`w-full text-left block px-4 py-2 text-sm text-gray-700 ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    );
  }
};
```

### Phase 2: Role-Specific Dashboard Components

#### 2.1 Enhanced Player Dashboard (`frontend/src/components/dashboards/PlayerDashboard.tsx`)
```typescript
const PlayerDashboard: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const [dashboardData, setDashboardData] = useState<PlayerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiService.get<PlayerDashboardData>('/dashboard/player');
        setDashboardData(response);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.playerProfile?.fullName || user?.username}!
            </h1>
            <p className="mt-1 text-cyan-100">
              Ready to play some pickleball today?
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">NRTP Level</div>
            <div className="text-3xl font-bold">
              {user?.playerProfile?.nrtpLevel || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Current Ranking"
          value={`#${dashboardData?.ranking?.position || 'N/A'}`}
          subtitle={dashboardData?.ranking?.change ? 
            `${dashboardData.ranking.change > 0 ? '+' : ''}${dashboardData.ranking.change} this month` : 
            'No change'
          }
          icon={<TrophyIcon className="h-8 w-8 text-yellow-500" />}
          trend={dashboardData?.ranking?.change}
        />
        
        <StatCard
          title="Matches Played"
          value={dashboardData?.statistics?.matchesPlayed.toString() || '0'}
          subtitle="This season"
          icon={<ChartBarIcon className="h-8 w-8 text-green-500" />}
        />
        
        <StatCard
          title="Win Rate"
          value={`${dashboardData?.statistics?.winRate || 0}%`}
          subtitle="Overall performance"
          icon={<FireIcon className="h-8 w-8 text-red-500" />}
        />
        
        <StatCard
          title="Upcoming Matches"
          value={dashboardData?.statistics?.upcomingMatches.toString() || '0'}
          subtitle="Next 7 days"
          icon={<CalendarIcon className="h-8 w-8 text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digital Credential Preview */}
        <Card title="My Digital Credential" className="h-fit">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BadgeCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Official Player Credential
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              View and download your official admin credential with QR code
            </p>
            <Link
              to="/credentials"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>View Credential</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-4">
            {dashboardData?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'match' ? 'bg-green-400' :
                  activity.type === 'tournament' ? 'bg-blue-400' :
                  activity.type === 'ranking' ? 'bg-yellow-400' : 'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            )) || (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </Card>

        {/* Upcoming Tournaments */}
        <Card title="Upcoming Tournaments">
          <div className="space-y-3">
            {dashboardData?.upcomingTournaments?.map((tournament) => (
              <div key={tournament.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{tournament.name}</h4>
                    <p className="text-sm text-gray-600">{tournament.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(tournament.date).toLocaleDateString()}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tournament.status === 'registered' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tournament.status}
                    </span>
                  </div>
                </div>
                {tournament.status === 'open' && (
                  <button className="mt-2 text-sm text-primary-600 hover:text-primary-800">
                    Register Now →
                  </button>
                )}
              </div>
            )) || (
              <p className="text-sm text-gray-500 text-center py-4">
                No upcoming tournaments
              </p>
            )}
          </div>
        </Card>

        {/* Player Connection */}
        <Card title="Find Players">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connect with Other Players
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Find players in your area or when traveling to play matches
            </p>
            <Link
              to="/player/connection"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Find Players</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            icon={<CalendarIcon className="h-6 w-6" />}
            title="Book Court"
            subtitle="Reserve playing time"
            href="/courts"
          />
          <QuickActionButton
            icon={<TrophyIcon className="h-6 w-6" />}
            title="Join Tournament"
            subtitle="Register for events"
            href="/tournaments"
          />
          <QuickActionButton
            icon={<ChartBarIcon className="h-6 w-6" />}
            title="View Rankings"
            subtitle="See your position"
            href="/rankings"
          />
          <QuickActionButton
            icon={<InboxIcon className="h-6 w-6" />}
            title="Messages"
            subtitle="Check your inbox"
            href="/messages"
            badge={dashboardData?.notifications?.unread}
          />
        </div>
      </Card>
    </div>
  );
};
```

#### 2.2 Federation Admin Dashboard (`frontend/src/components/dashboards/AdminDashboard.tsx`)
```typescript
const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiService.get<AdminDashboardData>('/dashboard/admin');
        setDashboardData(response);
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-sm p-6 text-white">
        <h1 className="text-2xl font-bold">Federation Administration</h1>
        <p className="mt-1 text-red-100">
          Manage the Mexican Pickleball Federation platform
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={dashboardData?.statistics?.totalUsers?.toString() || '0'}
          subtitle={`+${dashboardData?.statistics?.newUsersThisMonth || 0} this month`}
          icon={<UsersIcon className="h-8 w-8 text-blue-500" />}
          trend={dashboardData?.statistics?.userGrowthRate}
        />
        
        <StatCard
          title="Active Memberships"
          value={dashboardData?.statistics?.activeMemberships?.toString() || '0'}
          subtitle="Paying members"
          icon={<BadgeCheckIcon className="h-8 w-8 text-green-500" />}
        />
        
        <StatCard
          title="Registered Courts"
          value={dashboardData?.statistics?.totalCourts?.toString() || '0'}
          subtitle="Across all states"
          icon={<BuildingOfficeIcon className="h-8 w-8 text-indigo-500" />}
        />
        
        <StatCard
          title="Monthly Revenue"
          value={`$${dashboardData?.statistics?.monthlyRevenue?.toLocaleString() || '0'}`}
          subtitle="Membership fees"
          icon={<CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />}
        />
        
        <StatCard
          title="Active Tournaments"
          value={dashboardData?.statistics?.activeTournaments?.toString() || '0'}
          subtitle="Currently running"
          icon={<TrophyIcon className="h-8 w-8 text-purple-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* User Management Quick Access */}
        <Card title="User Management" className="lg:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">Players</div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.userBreakdown?.players || 0}
                </div>
              </div>
              <UserIcon className="h-8 w-8 text-cyan-500" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">Clubs</div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.userBreakdown?.clubs || 0}
                </div>
              </div>
              <BuildingOfficeIcon className="h-8 w-8 text-green-500" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">Coaches</div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.userBreakdown?.coaches || 0}
                </div>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-indigo-500" />
            </div>
            
            <Link 
              to="/admin/users" 
              className="block w-full text-center btn-primary mt-4"
            >
              Manage All Users
            </Link>
          </div>
        </Card>

        {/* Recent Registrations */}
        <Card title="Recent Registrations" className="lg:col-span-1">
          <div className="space-y-3">
            {dashboardData?.recentRegistrations?.map((user, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.profilePhoto || '/default-avatar.png'}
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.role} • {user.state}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'verified' 
                    ? 'bg-green-100 text-green-800'
                    : user.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </div>
            )) || (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent registrations
              </p>
            )}
          </div>
        </Card>

        {/* System Alerts */}
        <Card title="System Alerts" className="lg:col-span-1 xl:col-span-1">
          <div className="space-y-3">
            {dashboardData?.systemAlerts?.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-400' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {alert.severity === 'high' ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    ) : alert.severity === 'medium' ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">All systems operational</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Admin Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <QuickActionButton
            icon={<UsersIcon className="h-6 w-6" />}
            title="Manage Users"
            subtitle="View all users"
            href="/admin/users"
          />
          <QuickActionButton
            icon={<InboxIcon className="h-6 w-6" />}
            title="Send Message"
            subtitle="Broadcast to users"
            href="/admin/messages"
          />
          <QuickActionButton
            icon={<DocumentTextIcon className="h-6 w-6" />}
            title="Reports"
            subtitle="Generate reports"
            href="/admin/reports"
          />
          <QuickActionButton
            icon={<CogIcon className="h-6 w-6" />}
            title="System Settings"
            subtitle="Configure platform"
            href="/admin/settings"
          />
          <QuickActionButton
            icon={<GlobeAltIcon className="h-6 w-6" />}
            title="Microsites"
            subtitle="Manage microsites"
            href="/admin/microsites"
          />
          <QuickActionButton
            icon={<ChartBarIcon className="h-6 w-6" />}
            title="Analytics"
            subtitle="Platform insights"
            href="/admin/analytics"
          />
        </div>
      </Card>

      {/* Revenue Chart */}
      <Card title="Revenue Trends">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData?.revenueChart || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
```

### Phase 3: Interactive Widget Components

#### 3.1 Reusable Stat Card (`frontend/src/components/dashboard/StatCard.tsx`)
```typescript
interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = '',
  onClick
}) => {
  return (
    <div 
      className={`bg-white overflow-hidden shadow-sm border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {trend !== undefined && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend > 0 
                    ? 'text-green-600' 
                    : trend < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  {trend > 0 ? (
                    <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                  ) : trend < 0 ? (
                    <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                  ) : null}
                  <span className="sr-only">
                    {trend > 0 ? 'Increased' : 'Decreased'} by
                  </span>
                  {Math.abs(trend)}%
                </div>
              )}
            </dd>
            {subtitle && (
              <dd className="text-sm text-gray-600 mt-1">
                {subtitle}
              </dd>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};
```

#### 3.2 Quick Action Button (`frontend/src/components/dashboard/QuickActionButton.tsx`)
```typescript
interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  badge?: number;
  onClick?: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  title,
  subtitle,
  href,
  badge,
  onClick
}) => {
  const content = (
    <div className="relative bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 text-gray-400 group-hover:text-primary-500 transition-colors">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-900 transition-colors">
            {title}
          </h4>
          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>
      
      {badge && badge > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
          {badge > 99 ? '99+' : badge}
        </div>
      )}
      
      <ArrowRightIcon className="absolute top-2 right-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return (
    <Link to={href} className="block">
      {content}
    </Link>
  );
};
```

### Phase 4: Real-Time Data Integration

#### 4.1 Dashboard Data Hooks (`frontend/src/hooks/useDashboardData.ts`)
```typescript
export const useDashboardData = (role: UserRole) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const endpoints = {
    admin: '/dashboard/admin',
    state: '/dashboard/state',
    club: '/dashboard/club',
    partner: '/dashboard/partner',
    coach: '/dashboard/coach',
    player: '/dashboard/player'
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = endpoints[role] || endpoints.player;
      const response = await apiService.get(endpoint);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState({
    unread: 0,
    total: 0,
    latest: []
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiService.get('/notifications/summary');
        setNotifications(response);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return notifications;
};
```

## Backend Dashboard Endpoints Implementation

### Phase 5: Backend Dashboard APIs

#### 5.1 Dashboard Controller (`backend/src/controllers/dashboardController.ts`)
```typescript
class DashboardController {
  async getPlayerDashboard(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      
      const dashboardData = await this.buildPlayerDashboard(userId);
      
      return res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Player dashboard error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to load dashboard data'
      });
    }
  }

  async getAdminDashboard(req: Request, res: Response) {
    try {
      const dashboardData = await this.buildAdminDashboard();
      
      return res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Admin dashboard error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to load admin dashboard data'
      });
    }
  }

  private async buildPlayerDashboard(userId: string) {
    const [
      player,
      ranking,
      statistics,
      recentActivity,
      upcomingTournaments,
      notifications
    ] = await Promise.all([
      User.findByPk(userId, {
        include: [
          { model: Player, as: 'playerProfile', include: [{ model: State }] }
        ]
      }),
      this.getPlayerRanking(userId),
      this.getPlayerStatistics(userId),
      this.getPlayerRecentActivity(userId),
      this.getPlayerUpcomingTournaments(userId),
      this.getPlayerNotifications(userId)
    ]);

    return {
      ranking,
      statistics,
      recentActivity,
      upcomingTournaments,
      notifications
    };
  }

  private async buildAdminDashboard() {
    const [
      userStats,
      revenueStats,
      systemAlerts,
      recentRegistrations,
      revenueChart
    ] = await Promise.all([
      this.getUserStatistics(),
      this.getRevenueStatistics(),
      this.getSystemAlerts(),
      this.getRecentRegistrations(),
      this.getRevenueChart()
    ]);

    return {
      statistics: { ...userStats, ...revenueStats },
      systemAlerts,
      recentRegistrations,
      revenueChart,
      userBreakdown: await this.getUserBreakdown()
    };
  }

  private async getUserStatistics() {
    const totalUsers = await User.count({ where: { isActive: true } });
    const newUsersThisMonth = await User.count({
      where: {
        isActive: true,
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });
    
    const activeMemberships = await Membership.count({
      where: { status: 'active' }
    });
    
    const totalCourts = await Court.count({ where: { isActive: true } });
    const activeTournaments = await Tournament.count({
      where: { status: 'active' }
    });

    return {
      totalUsers,
      newUsersThisMonth,
      activeMemberships,
      totalCourts,
      activeTournaments,
      userGrowthRate: this.calculateGrowthRate(totalUsers, newUsersThisMonth)
    };
  }

  private async getRevenueStatistics() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: new Date(currentYear, currentMonth, 1),
          [Op.lt]: new Date(currentYear, currentMonth + 1, 1)
        }
      }
    });

    return {
      monthlyRevenue: monthlyRevenue || 0
    };
  }
}
```

## Implementation Priority

### Week 1 - Critical Components
1. **Enhanced Dashboard Layout**: Proper role-based navigation and layout
2. **Player Dashboard**: Complete functionality with real data
3. **Admin Dashboard**: Essential admin overview and quick actions

### Week 2 - Core Functionality  
1. **State Committee Dashboard**: State-specific management features
2. **Club Dashboard**: Club management and microsite integration
3. **Real-time Data Hooks**: Live updating dashboard data

### Week 3 - Advanced Features
1. **Interactive Widgets**: Charts, graphs, and analytics
2. **Quick Actions**: Contextual shortcuts and workflows
3. **Notification System**: Real-time alerts and messaging

## Expected Results

After full implementation:
- ✅ Role-specific dashboards with proper navigation
- ✅ Real-time data and statistics display
- ✅ Interactive components and quick actions
- ✅ Proper user experience flows
- ✅ Comprehensive admin tools
- ✅ Mobile-responsive design
- ✅ Performance optimized with caching

This dashboard system will provide complete functionality for all user roles according to the admin requirements.