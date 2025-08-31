import React, { useState, useEffect } from 'react';
import { CredentialCard } from './CredentialCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../ui/Button';

interface CredentialListProps {
  userId?: number;
  stateId?: number;
  userType?: string;
  status?: string;
  showActions?: boolean;
  limit?: number;
}

interface Credential {
  id: string;
  userType: string;
  fullName: string;
  federationIdNumber: string;
  stateName: string;
  nrtpLevel?: string;
  affiliationStatus: string;
  rankingPosition?: number;
  clubName?: string;
  photo?: string;
  issuedDate: string;
  expirationDate: string;
  status: string;
  qrCode?: string;
  verificationCount: number;
  lastVerified?: string;
}

interface CredentialResponse {
  success: boolean;
  data: Credential[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
}

export const CredentialList: React.FC<CredentialListProps> = ({
  userId,
  stateId,
  userType,
  status,
  showActions = false,
  limit = 20
}) => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    userType: userType || '',
    status: status || ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    totalPages: 0
  });
  const [currentPage, setCurrentPage] = useState(0);

  const userTypeOptions = [
    { value: '', label: 'All types' },
    { value: 'player', label: 'Players' },
    { value: 'coach', label: 'Coaches' },
    { value: 'referee', label: 'Referees' },
    { value: 'club_admin', label: 'Club Administrators' }
  ];

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'revoked', label: 'Revoked' },
    { value: 'pending', label: 'Pending' }
  ];

  const fetchCredentials = async (offset: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      let url = '';
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      if (filters.userType) params.append('userType', filters.userType);
      if (filters.status) params.append('status', filters.status);

      if (userId) {
        url = `/api/credentials/user/${userId}?${params}`;
      } else if (stateId) {
        url = `/api/credentials/state/${stateId}?${params}`;
      } else {
        // This would need to be implemented as a general credentials endpoint
        throw new Error('Either userId or stateId must be provided');
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credentials');
      }

      const data: CredentialResponse = await response.json();

      if (data.success) {
        setCredentials(data.data);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        throw new Error('Failed to load credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials(0);
    setCurrentPage(0);
  }, [userId, stateId, filters.userType, filters.status, limit]);

  const handlePageChange = (newPage: number) => {
    const offset = newPage * pagination.limit;
    setCurrentPage(newPage);
    fetchCredentials(offset);
  };

  const handleRefresh = () => {
    fetchCredentials(currentPage * pagination.limit);
  };

  const handleDownloadPDF = async (credentialId: string) => {
    try {
      const response = await fetch(`/api/credentials/${credentialId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `credential-${credentialId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF');
    }
  };

  const handleDownloadImage = async (credentialId: string) => {
    try {
      const response = await fetch(`/api/credentials/${credentialId}/image`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `credential-${credentialId}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error downloading image');
    }
  };

  const handleStatusUpdate = async (credentialId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/credentials/${credentialId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          reason: `Status updated to ${newStatus}` 
        })
      });

      if (response.ok) {
        // Refresh the list
        fetchCredentials(currentPage * pagination.limit);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleRenew = async (credentialId: string) => {
    try {
      const response = await fetch(`/api/credentials/${credentialId}/renew`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ extensionMonths: 12 })
      });

      if (response.ok) {
        // Refresh the list
        fetchCredentials(currentPage * pagination.limit);
        alert('Credential renewed successfully');
      } else {
        throw new Error('Failed to renew credential');
      }
    } catch (error) {
      console.error('Error renewing credential:', error);
      alert('Error renewing credential');
    }
  };

  if (loading && credentials.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={handleRefresh} variant="secondary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {!userId && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Filters</h3>
            <Button
              onClick={() => setFilters({ userType: '', status: '' })}
              variant="secondary"
              size="sm"
            >
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type
              </label>
              <select
                value={filters.userType}
                onChange={(e) => setFilters(prev => ({ ...prev, userType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {userTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Credentials ({pagination.total || credentials.length})
        </div>
        <Button 
          onClick={handleRefresh}
          variant="secondary"
          size="sm"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </div>

      {/* Credentials List */}
      {credentials.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No credentials found</div>
          <div className="text-sm">
            No credentials match the selected criteria.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {credentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              showActions={showActions}
              onDownloadPDF={() => handleDownloadPDF(credential.id)}
              onDownloadImage={() => handleDownloadImage(credential.id)}
              onStatusUpdate={(status) => handleStatusUpdate(credential.id, status)}
              onRenew={() => handleRenew(credential.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            variant="secondary"
            size="sm"
          >
            Previous
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 7) {
                pageNum = i;
              } else if (currentPage <= 3) {
                pageNum = i;
              } else if (currentPage >= pagination.totalPages - 4) {
                pageNum = pagination.totalPages - 7 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }

              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  variant={currentPage === pageNum ? 'primary' : 'secondary'}
                  size="sm"
                  className="w-10"
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages - 1}
            variant="secondary"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}

      {/* Loading overlay for pagination */}
      {loading && credentials.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <LoadingSpinner />
          </div>
        </div>
      )}
    </div>
  );
};