import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchDashboardData, 
  selectDashboardData, 
  selectDashboardLoading, 
  selectDashboardError 
} from '@/store/dashboardSlice';
import { 
  fetchMessages, 
  selectUnreadCount 
} from '@/store/messageSlice';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  UserIcon,
  CogIcon,
  InboxIcon,
  AcademicCapIcon,
  CalendarIcon,
  DocumentIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const CoachDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectDashboardData);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);
  // const messages = useAppSelector(selectMessages); // Unused for now
  const unreadCount = useAppSelector(selectUnreadCount);
  
  const [activeTab, setActiveTab] = useState('credential');

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchMessages({ page: 1, limit: 10 }));
  }, [dispatch]);

  const tabs = [
    {
      id: 'credential',
      label: 'Credential',
      icon: <UserIcon className="w-4 h-4" />,
      count: 0
    },
    {
      id: 'account',
      label: 'My Account',
      icon: <CogIcon className="w-4 h-4" />,
      count: 0
    },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: <InboxIcon className="w-4 h-4" />,
      count: unreadCount
    },
    {
      id: 'students',
      label: 'Students',
      icon: <AcademicCapIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.students || 0
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <CalendarIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.upcomingSessions || 0
    },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: <DocumentIcon className="w-4 h-4" />,
      count: 0
    },
    {
      id: 'ratings',
      label: 'Ratings',
      icon: <StarIcon className="w-4 h-4" />,
      count: 0
    }
  ];

  const renderCredentialTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Coach Credential</h3>
              <p className="text-blue-100 mb-4">
                Certified by the Mexican Pickleball Federation
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-200">ID:</span>
                  <span className="ml-2 font-medium">{dashboardData?.user?.id || 'COACH001'}</span>
                </div>
                <div>
                  <span className="text-blue-200">Level:</span>
                  <span className="ml-2 font-medium">Certified L2</span>
                </div>
                <div>
                  <span className="text-blue-200">Validity:</span>
                  <span className="ml-2 font-medium">Dec 2024</span>
                </div>
                <div>
                  <span className="text-blue-200">Status:</span>
                  <span className="ml-2 font-medium">Active</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <AcademicCapIcon className="w-10 h-10 text-white" />
              </div>
              <Button variant="ghost" size="sm" className="text-white border-white/30">
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Specialties</h4>
            <div className="space-y-2">
              <Badge variant="primary">Basic Technique</Badge>
              <Badge variant="success">Youth Training</Badge>
              <Badge variant="warning">Advanced Competition</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Certifications</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">PPR Level 2 Coach</span>
                <Badge variant="success">Valid</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">First Aid CPR</span>
                <Badge variant="success">Valid</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderStudentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">My Students</h3>
        <Button variant="primary">
          <AcademicCapIcon className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((student) => (
          <Card key={student} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Student {student}</h4>
                  <p className="text-sm text-gray-500">Level 2.5</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Classes completed:</span>
                  <span className="font-medium">{12 + student}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Next class:</span>
                  <span className="font-medium">Mar 15</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" fullWidth>
                  View Progress
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">My Schedule</h3>
        <Button variant="primary">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Schedule Class
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4 mb-6">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">{day}</div>
                <div className="space-y-2">
                  {day === 'Tue' || day === 'Thu' ? (
                    <>
                      <div className="bg-blue-100 text-blue-800 text-xs p-2 rounded">
                        9:00 - Group Class
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs p-2 rounded">
                        14:00 - Individual
                      </div>
                    </>
                  ) : day === 'Sat' ? (
                    <div className="bg-purple-100 text-purple-800 text-xs p-2 rounded">
                      10:00 - Clinic
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Upcoming Classes</h4>
            <div className="space-y-3">
              {[
                { time: '9:00 AM', student: 'Juan Pérez', type: 'Individual' },
                { time: '2:00 PM', student: 'Group A', type: 'Group' },
                { time: '4:00 PM', student: 'María García', type: 'Individual' }
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{session.time}</div>
                    <div className="text-sm text-gray-500">{session.student}</div>
                  </div>
                  <Badge variant={session.type === 'Individual' ? 'primary' : 'success'}>
                    {session.type === 'Group' ? 'Group' : session.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Availability</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monday to Friday</span>
                <span className="text-sm font-medium">8:00 - 18:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Saturdays</span>
                <span className="text-sm font-medium">9:00 - 15:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sundays</span>
                <span className="text-sm font-medium">Closed</span>
              </div>
            </div>
            <Button variant="outline" size="sm" fullWidth className="mt-4">
              Edit Availability
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'credential':
        return renderCredentialTab();
      case 'account':
        return (
          <div className="text-center py-12">
            <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h3>
            <p className="text-gray-500">Manage your personal information and preferences.</p>
          </div>
        );
      case 'inbox':
        return (
          <div className="text-center py-12">
            <InboxIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-500">Your inbox is empty.</p>
          </div>
        );
      case 'students':
        return renderStudentsTab();
      case 'schedule':
        return renderScheduleTab();
      case 'certifications':
        return (
          <div className="text-center py-12">
            <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Certifications</h3>
            <p className="text-gray-500">Manage your certifications and renewals.</p>
          </div>
        );
      case 'ratings':
        return (
          <div className="text-center py-12">
            <StarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ratings</h3>
            <p className="text-gray-500">Review your students' ratings.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard</p>
          <Button onClick={() => dispatch(fetchDashboardData())}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      tabs={tabs}
      onTabChange={setActiveTab}
    >
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Students"
            value={dashboardData?.statistics?.students?.toString() || '24'}
            trend={{ value: 3, direction: 'up', label: '+3' }}
            icon={<AcademicCapIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Classes This Month"
            value={dashboardData?.statistics?.sessionsThisMonth?.toString() || '156'}
            trend={{ value: 12, direction: 'up', label: '+12%' }}
            icon={<CalendarIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Hours Taught"
            value={dashboardData?.statistics?.totalHours?.toString() || '342'}
            trend={{ value: 8, direction: 'up', label: '+8%' }}
            icon={<StarIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Income This Month"
            value="$18,500"
            trend={{ value: 15, direction: 'up', label: '+15%' }}
            icon={<DocumentIcon className="w-6 h-6" />}
          />
        </div>

        {/* Main Content with Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <Tabs
              items={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="underline"
            />
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoachDashboard;