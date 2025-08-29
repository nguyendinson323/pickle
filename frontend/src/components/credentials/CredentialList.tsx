import React, { useState, useEffect } from 'react';
import { CredentialCard } from './CredentialCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../ui/Button';
import { SelectField } from '../forms/SelectField';

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
    { value: '', label: 'Todos los tipos' },
    { value: 'player', label: 'Jugadores' },
    { value: 'coach', label: 'Entrenadores' },
    { value: 'referee', label: 'Árbitros' },
    { value: 'club_admin', label: 'Administradores de Club' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activas' },
    { value: 'expired', label: 'Expiradas' },
    { value: 'suspended', label: 'Suspendidas' },
    { value: 'revoked', label: 'Revocadas' },
    { value: 'pending', label: 'Pendientes' }
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
      alert('Error al descargar el PDF');
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
      alert('Error al descargar la imagen');
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
      alert('Error al actualizar el estado');
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
        alert('Credencial renovada exitosamente');
      } else {
        throw new Error('Failed to renew credential');
      }
    } catch (error) {
      console.error('Error renewing credential:', error);
      alert('Error al renovar la credencial');
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
        <Button onClick={handleRefresh} variant="outline">
          Reintentar
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
            <h3 className="text-lg font-medium">Filtros</h3>
            <Button
              onClick={() => setFilters({ userType: '', status: '' })}
              variant="outline"
              size="sm"
            >
              Resetear
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Tipo de Usuario"
              value={filters.userType}
              onChange={(value) => setFilters(prev => ({ ...prev, userType: value }))}
              options={userTypeOptions}
            />

            <SelectField
              label="Estado"
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              options={statusOptions}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Credenciales ({pagination.total || credentials.length})
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {/* Credentials List */}
      {credentials.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No se encontraron credenciales</div>
          <div className="text-sm">
            No hay credenciales que coincidan con los criterios seleccionados.
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
            variant="outline"
            size="sm"
          >
            Anterior
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
                  variant={currentPage === pageNum ? 'primary' : 'outline'}
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
            variant="outline"
            size="sm"
          >
            Siguiente
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