import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormField } from '../forms/FormField';
import { SelectField } from '../forms/SelectField';
import { FileField } from '../forms/FileField';
import { LoadingSpinner } from '../common/LoadingSpinner';

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
    { value: '', label: 'Seleccionar tipo' },
    { value: 'player', label: 'Jugador' },
    { value: 'coach', label: 'Entrenador' },
    { value: 'referee', label: 'Árbitro' },
    { value: 'club_admin', label: 'Administrador de Club' }
  ];

  const nrtpLevelOptions = [
    { value: '', label: 'Sin nivel asignado' },
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
  }, [formData.userType, formData.stateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.userType || !formData.fullName || 
        !formData.stateId || !formData.federationIdNumber) {
      setError('Por favor complete todos los campos requeridos');
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
        throw new Error(errorData.error || 'Error al crear la credencial');
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
        
        alert('Credencial creada exitosamente');
      } else {
        throw new Error(result.error || 'Error al crear la credencial');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Generar Nueva Credencial</h2>
        {onClose && (
          <Button onClick={onClose} variant="outline">
            Cerrar
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
            Buscar Usuario *
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Escriba el nombre del usuario..."
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
          <SelectField
            label="Tipo de Usuario *"
            value={formData.userType}
            onChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}
            options={userTypeOptions}
            required
          />

          {/* Full Name */}
          <FormField
            label="Nombre Completo *"
            value={formData.fullName}
            onChange={(value) => setFormData(prev => ({ ...prev, fullName: value }))}
            required
          />

          {/* State */}
          <SelectField
            label="Estado *"
            value={formData.stateId}
            onChange={handleStateChange}
            options={[
              { value: '', label: 'Seleccionar estado' },
              ...states.map(state => ({
                value: state.id.toString(),
                label: state.name
              }))
            ]}
            required
          />

          {/* Federation ID */}
          <div className="flex space-x-2">
            <FormField
              label="ID de Federación *"
              value={formData.federationIdNumber}
              onChange={(value) => setFormData(prev => ({ ...prev, federationIdNumber: value }))}
              required
              className="flex-1"
            />
            <div className="self-end">
              <Button 
                type="button"
                onClick={generateFederationId}
                variant="outline"
                size="sm"
                disabled={!formData.userType || !formData.stateId}
              >
                Generar
              </Button>
            </div>
          </div>

          {/* NRTP Level */}
          {formData.userType === 'player' && (
            <SelectField
              label="Nivel NRTP"
              value={formData.nrtpLevel}
              onChange={(value) => setFormData(prev => ({ ...prev, nrtpLevel: value }))}
              options={nrtpLevelOptions}
            />
          )}

          {/* Ranking Position */}
          {formData.userType === 'player' && (
            <FormField
              label="Posición en Ranking"
              type="number"
              value={formData.rankingPosition}
              onChange={(value) => setFormData(prev => ({ ...prev, rankingPosition: value }))}
              min="1"
            />
          )}

          {/* Club Name */}
          <FormField
            label="Club"
            value={formData.clubName}
            onChange={(value) => setFormData(prev => ({ ...prev, clubName: value }))}
          />

          {/* License Type */}
          {['coach', 'referee'].includes(formData.userType) && (
            <FormField
              label="Tipo de Licencia"
              value={formData.licenseType}
              onChange={(value) => setFormData(prev => ({ ...prev, licenseType: value }))}
            />
          )}

          {/* Nationality */}
          <FormField
            label="Nacionalidad"
            value={formData.nationality}
            onChange={(value) => setFormData(prev => ({ ...prev, nationality: value }))}
          />

          {/* Photo URL */}
          <FormField
            label="URL de Foto"
            value={formData.photo}
            onChange={(value) => setFormData(prev => ({ ...prev, photo: value }))}
            placeholder="https://..."
          />

          {/* Expiration Date */}
          <FormField
            label="Fecha de Vencimiento *"
            type="date"
            value={formData.expirationDate}
            onChange={(value) => setFormData(prev => ({ ...prev, expirationDate: value }))}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-6">
          {onClose && (
            <Button type="button" onClick={onClose} variant="outline">
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Generando...
              </>
            ) : (
              'Generar Credencial'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};