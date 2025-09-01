import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Mail, 
  Shield,
  Edit,
  Trash2
} from 'lucide-react';
import Card from '../ui/Card';
import FormField from '../forms/FormField';
import SelectField from '../forms/SelectField';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'state' | 'club' | 'partner' | 'player' | 'coach' | 'referee';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  location: string;
  registrationDate: string;
  lastActive: string;
  tournamentsPlayed?: number;
  skillLevel?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch from admin dashboard API to get user data
        const response = await fetch('/dashboard/admin', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        const data = await response.json();
        
        if (data.success && data.data?.recentRegistrations) {
          // Transform the registration data into user format
          const transformedUsers = data.data.recentRegistrations.map((registration: any) => ({
            id: registration.id?.toString() || Math.random().toString(),
            name: registration.name || `${registration.firstName || ''} ${registration.lastName || ''}`.trim(),
            email: registration.email || '',
            role: registration.role || 'player',
            status: registration.status || 'active',
            location: registration.location || `${registration.city || ''}, ${registration.state || ''}`.replace(/^,\s*|\s*,$/, '') || '',
            registrationDate: registration.registrationDate || registration.createdAt || new Date().toISOString(),
            lastActive: registration.lastActive || registration.updatedAt || new Date().toISOString(),
            tournamentsPlayed: registration.tournamentsPlayed || 0,
            skillLevel: registration.skillLevel || ''
          }));
          
          setUsers(transformedUsers);
        }
        
        // Also try to fetch users from search API if available
        try {
          const searchResponse = await fetch('/api/location/search-players', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({
              searchTerm: '',
              state: '',
              city: '',
              skillLevel: '',
              radius: 1000
            })
          });
          
          const searchData = await searchResponse.json();
          if (searchData.success && searchData.players) {
            const playerUsers = searchData.players.map((player: any) => ({
              id: player.id?.toString() || Math.random().toString(),
              name: player.name || `${player.firstName || ''} ${player.lastName || ''}`.trim(),
              email: player.email || '',
              role: 'player',
              status: player.status || 'active',
              location: `${player.city || ''}, ${player.state || ''}`.replace(/^,\s*|\s*,$/, ''),
              registrationDate: player.createdAt || new Date().toISOString(),
              lastActive: player.updatedAt || new Date().toISOString(),
              tournamentsPlayed: player.tournamentsPlayed || 0,
              skillLevel: player.skillLevel || ''
            }));
            
            // Merge with existing users, avoiding duplicates
            setUsers(prev => {
              const existingIds = prev.map(u => u.id);
              const newUsers = playerUsers.filter((u: User) => !existingIds.includes(u.id));
              return [...prev, ...newUsers];
            });
          }
        } catch (searchError) {
          console.warn('Could not fetch additional user data from search API:', searchError);
        }
        
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'state':
        return 'bg-purple-100 text-purple-800';
      case 'club':
        return 'bg-blue-100 text-blue-800';
      case 'partner':
        return 'bg-indigo-100 text-indigo-800';
      case 'coach':
        return 'bg-green-100 text-green-800';
      case 'referee':
        return 'bg-yellow-100 text-yellow-800';
      case 'player':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // For now, we'll update locally and log the action
      // In a full implementation, this would call backend APIs
      console.log(`Performing ${action} on user ${userId}`);
      
      switch (action) {
        case 'approve':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: 'active' as const } : user
          ));
          break;
        case 'suspend':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: 'suspended' as const } : user
          ));
          break;
        case 'reactivate':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: 'active' as const } : user
          ));
          break;
      }
      
      // Here you would make an API call to update the user status
      // await fetch(`/api/users/${userId}/status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      //   },
      //   body: JSON.stringify({ status: newStatus })
      // });
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const handleBulkAction = async (action: string) => {
    try {
      console.log(`Performing bulk ${action} on users:`, selectedUsers);
      
      // Update users locally for immediate feedback
      if (action === 'approve') {
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'active' as const } : user
        ));
      } else if (action === 'suspend') {
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'suspended' as const } : user
        ));
      }
      
      // Here you would make API calls for bulk actions
      // await fetch('/api/users/bulk-action', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      //   },
      //   body: JSON.stringify({ userIds: selectedUsers, action })
      // });
      
      setSelectedUsers([]);
    } catch (error) {
      console.error(`Failed to perform bulk ${action}:`, error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Administrator' },
    { value: 'state', label: 'State Manager' },
    { value: 'club', label: 'Club' },
    { value: 'partner', label: 'Partner' },
    { value: 'coach', label: 'Coach' },
    { value: 'referee', label: 'Referee' },
    { value: 'player', label: 'Player' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary">
            Add User
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <SelectField
              name="role"
              label="Role"
              value={roleFilter}
              onChange={setRoleFilter}
              options={roleOptions}
            />
            <SelectField
              name="status"
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />
          </div>
        )}

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Suspend
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.skillLevel && (
                        <div className="text-xs text-gray-400">Skill: {user.skillLevel}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatLastActive(user.lastActive)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.status === 'pending' && (
                        <button
                          onClick={() => handleUserAction(user.id, 'approve')}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Approve"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )}
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Suspend"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      )}
                      {user.status === 'suspended' && (
                        <button
                          onClick={() => handleUserAction(user.id, 'reactivate')}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Reactivate"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-purple-600 hover:bg-purple-100 rounded" title="Send Message">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded" title="More">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
          <p className="text-sm text-gray-500">Active</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'pending').length}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'suspended').length}</p>
          <p className="text-sm text-gray-500">Suspended</p>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;