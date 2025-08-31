import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface CredentialGeneratorProps {
  onCredentialCreated?: (credential: any) => void;
  onClose?: () => void;
}

interface State {
  id: number;
  name: string;
  abbreviation: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const CredentialGenerator: React.FC<CredentialGeneratorProps> = ({
  onCredentialCreated,
  onClose
}) => {
  const [formData, setFormData] = useState({
    userId: '',
    userType: '',
    fullName: '',
    stateId: '',
    stateName: '',
    nrtpLevel: '',
    rankingPosition: '',
    clubName: '',
    licenseType: '',
    federationIdNumber: '',
    nationality: '🇲🇽 México',
    photo: '',
    expirationDate: '',
    metadata: {}
  });

  const [states, setStates] = useState<State[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchUser, setSearchUser] = useState('');

  const userTypeOptions = [
    { value: '', label: 'Select type' },
    { value: 'player', label: 'Player' },
    { value: 'coach', label: 'Coach' },
    { value: 'referee', label: 'Referee' },
    { value: 'club_admin', label: 'Club Administrator' }
  ];

  const nrtpLevelOptions = [
    { value: '', label: 'No level assigned' },
    { value: '2.0', label: '2.0' },
    { value: '2.5', label: '2.5' },
    { value: '3.0', label: '3.0' },
    { value: '3.5', label: '3.5' },
    { value: '4.0', label: '4.0' },
    { value: '4.5', label: '4.5' },
    { value: '5.0', label: '5.0' }
  ];

  useEffect(() => {
    fetchStates();
    
    // Set default expiration date to 1 year from now
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    setFormData(prev => ({
      ...prev,
      expirationDate: oneYearFromNow.toISOString().split('T')[0]
    }));
  }, []);

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/data/states', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStates(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query || query.length < 2) {
      setUsers([]);
      return;
    }

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchUser);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchUser]);

  const handleUserSelect = (user: User) => {
    setFormData(prev => ({
      ...prev,
      userId: user.id.toString(),
      fullName: `${user.firstName} ${user.lastName}`,
      userType: user.role === 'player' ? 'player' : user.role === 'coach' ? 'coach' : ''
    }));
    setSearchUser(`${user.firstName} ${user.lastName}`);
    setUsers([]);
  };

  const handleStateChange = (stateId: string) => {
    const selectedState = states.find(s => s.id.toString() === stateId);
    setFormData(prev => ({
      ...prev,
      stateId,
      stateName: selectedState?.name || ''
    }));
  };

  const generateFederationId = () => {
    const typePrefix = {
      'player': 'JUG',
      'coach': 'ENT',
      'referee': 'ARB',
      'club_admin': 'ADM'
    };

    if (!formData.userType || !formData.stateId) return;

    const prefix = typePrefix[formData.userType as keyof typeof typePrefix];
    const year = new Date().getFullYear().toString().slice(-2);
    const stateCode = formData.stateId.padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    const federationId = `${prefix}-${year}${stateCode}-${random}`;
    setFormData(prev => ({ ...prev, federationIdNumber: federationId }));
  };

  useEffect(() => {
    if (formData.userType && formData.stateId && !formData.federationIdNumber) {
      generateFederationId();
    }
  }, [formData.userType, formData.stateId, formData.federationIdNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.userType || !formData.fullName || 
        !formData.stateId || !formData.federationIdNumber) {
      setError('Please complete all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        ...formData,
        userId: parseInt(formData.userId),
        stateId: parseInt(formData.stateId),
        rankingPosition: formData.rankingPosition ? parseInt(formData.rankingPosition) : undefined,
        expirationDate: new Date(formData.expirationDate).toISOString()
      };

      const response = await fetch('/api/credentials/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating credential');
      }

      const result = await response.json();
      
      if (result.success) {
        if (onCredentialCreated) {
          onCredentialCreated(result.data);
        }
        
        // Reset form
        setFormData({
          userId: '',
          userType: '',
          fullName: '',
          stateId: '',
          stateName: '',
          nrtpLevel: '',
          rankingPosition: '',
          clubName: '',
          licenseType: '',
          federationIdNumber: '',
          nationality: '🇲🇽 México',
          photo: '',
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          metadata: {}
        });
        setSearchUser('');
        
        alert('Credential created successfully');
      } else {
        throw new Error(result.error || 'Error creating credential');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Generate New Credential</h2>
        {onClose && (
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search User *
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Enter user name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
            {users.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleUserSelect(user)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Type *
            </label>
            <select
              value={formData.userType}
              onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {userTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              value={formData.stateId}
              onChange={(e) => handleStateChange(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select state</option>
              {states.map(state => (
                <option key={state.id} value={state.id.toString()}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* Federation ID */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Federation ID *
              </label>
              <input
                type="text"
                value={formData.federationIdNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, federationIdNumber: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="self-end">
              <Button 
                type="button"
                onClick={generateFederationId}
                variant="secondary"
                size="sm"
                disabled={!formData.userType || !formData.stateId}
              >
                Generate
              </Button>
            </div>
          </div>

          {/* NRTP Level */}
          {formData.userType === 'player' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NRTP Level
              </label>
              <select
                value={formData.nrtpLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, nrtpLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {nrtpLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Ranking Position */}
          {formData.userType === 'player' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ranking Position
              </label>
              <input
                type="number"
                value={formData.rankingPosition}
                onChange={(e) => setFormData(prev => ({ ...prev, rankingPosition: e.target.value }))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Club Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club
            </label>
            <input
              type="text"
              value={formData.clubName}
              onChange={(e) => setFormData(prev => ({ ...prev, clubName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* License Type */}
          {['coach', 'referee'].includes(formData.userType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Type
              </label>
              <input
                type="text"
                value={formData.licenseType}
                onChange={(e) => setFormData(prev => ({ ...prev, licenseType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality
            </label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <input
              type="text"
              value={formData.photo}
              onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date *
            </label>
            <input
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-6">
          {onClose && (
            <Button type="button" onClick={onClose} variant="secondary">
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Generating...
              </>
            ) : (
              'Generate Credential'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};