import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/common/Layout';
import { CredentialList } from '../../components/credentials/CredentialList';
import { CredentialGenerator } from '../../components/credentials/CredentialGenerator';
import { CredentialVerifier } from '../../components/credentials/CredentialVerifier';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { RootState } from '../../store';

export const CredentialsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('my-credentials');
  const [showGenerator, setShowGenerator] = useState(false);
  const [showVerifier, setShowVerifier] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    expiringSoon: 0
  });

  const isAdmin = user?.role === 'federation' || user?.role === 'state';

  useEffect(() => {
    fetchCredentialStats();
    
    // Set default tab based on user role
    if (isAdmin) {
      setActiveTab('manage');
    }
  }, [user]);

  const fetchCredentialStats = async () => {
    try {
      const response = await fetch('/api/credentials/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const statsData = data.data;
          setStats({
            total: statsData.total || 0,
            active: statsData.byStatus?.find((s: any) => s.status === 'active')?.count || 0,
            expired: statsData.byStatus?.find((s: any) => s.status === 'expired')?.count || 0,
            expiringSoon: statsData.expiringSoon || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching credential stats:', error);
    }
  };

  const handleCredentialCreated = (_credential: any) => {
    fetchCredentialStats();
    setShowGenerator(false);
  };

  // Define tabs based on user role
  const getTabs = () => {
    const baseTabs = [
      { id: 'my-credentials', label: 'Mis Credenciales', count: 0 }
    ];

    if (isAdmin) {
      baseTabs.push(
        { id: 'manage', label: 'Gestionar', count: stats.total },
        { id: 'generate', label: 'Generar', count: 0 },
        { id: 'verify', label: 'Verificar', count: 0 },
        { id: 'expiring', label: 'Por Vencer', count: stats.expiringSoon }
      );
    } else {
      baseTabs.push(
        { id: 'verify', label: 'Verificar', count: 0 }
      );
    }

    return baseTabs;
  };

  const tabs = getTabs();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Credenciales Digitales</h1>
              <p className="text-green-100">
                Sistema oficial de credenciales de la Federación Mexicana de Pickleball
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-16 h-20 bg-white/20 rounded border border-white/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs">FMP</div>
                  <div className="text-[8px]">OFICIAL</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          {isAdmin && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
                  <div className="text-sm text-green-100">Total</div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-200">{stats.active.toLocaleString()}</div>
                  <div className="text-sm text-green-100">Activas</div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-200">{stats.expired.toLocaleString()}</div>
                  <div className="text-sm text-green-100">Expiradas</div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-200">{stats.expiringSoon.toLocaleString()}</div>
                  <div className="text-sm text-green-100">Por Vencer</div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {isAdmin && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="font-semibold">Acciones Rápidas</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">
                    {stats.active} Activas
                  </Badge>
                  {stats.expiringSoon > 0 && (
                    <Badge variant="warning">
                      {stats.expiringSoon} Por Vencer
                    </Badge>
                  )}
                  {stats.expired > 0 && (
                    <Badge variant="error">
                      {stats.expired} Expiradas
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowGenerator(true)}
                  variant="primary"
                  size="sm"
                >
                  + Nueva Credencial
                </Button>
                <Button
                  onClick={() => setShowVerifier(true)}
                  variant="outline"
                  size="sm"
                >
                  Verificar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Tabs
          items={tabs.map(tab => ({ ...tab, badge: tab.count > 0 ? tab.count : undefined }))}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'my-credentials' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Mis Credenciales</h3>
                  <Button
                    onClick={() => setShowVerifier(true)}
                    variant="outline"
                    size="sm"
                  >
                    Verificar Credencial
                  </Button>
                </div>
                
                {user?.id && (
                  <CredentialList
                    userId={user.id}
                    showActions={false}
                  />
                )}
              </Card>
            </div>
          )}

          {activeTab === 'manage' && isAdmin && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Gestión de Credenciales</h3>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setShowGenerator(true)}
                      variant="primary"
                      size="sm"
                    >
                      + Nueva Credencial
                    </Button>
                  </div>
                </div>
                
                <CredentialList
                  stateId={user?.role === 'state' && user.profile ? (user.profile as any).stateId : undefined}
                  showActions={true}
                />
              </Card>
            </div>
          )}

          {activeTab === 'generate' && isAdmin && (
            <CredentialGenerator onCredentialCreated={handleCredentialCreated} />
          )}

          {activeTab === 'verify' && (
            <CredentialVerifier />
          )}

          {activeTab === 'expiring' && isAdmin && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Credenciales por Vencer</h3>
              <p className="text-gray-600 mb-6">
                Credenciales que expiran en los próximos 30 días
              </p>
              
              <CredentialList
                stateId={user?.role === 'state' && user.profile ? (user.profile as any).stateId : undefined}
                status="active" // We'll need to filter by expiration date in the backend
                showActions={true}
              />
            </Card>
          )}
        </div>

        {/* Generator Modal */}
        <Modal
          isOpen={showGenerator}
          onClose={() => setShowGenerator(false)}
          title=""
          size="lg"
        >
          <CredentialGenerator
            onCredentialCreated={handleCredentialCreated}
            onClose={() => setShowGenerator(false)}
          />
        </Modal>

        {/* Verifier Modal */}
        <Modal
          isOpen={showVerifier}
          onClose={() => setShowVerifier(false)}
          title=""
          size="lg"
        >
          <CredentialVerifier />
        </Modal>

        {/* Help Section */}
        <Card className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Acerca de las Credenciales Digitales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2">Características</h4>
              <ul className="space-y-1">
                <li>• Verificación mediante código QR</li>
                <li>• Descarga en formato PDF e imagen</li>
                <li>• Verificación de integridad con checksum</li>
                <li>• Renovación automática disponible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tipos de Credencial</h4>
              <ul className="space-y-1">
                <li>• <Badge variant="primary" size="sm">Jugador</Badge> - Para jugadores federados</li>
                <li>• <Badge variant="secondary" size="sm">Entrenador</Badge> - Para entrenadores certificados</li>
                <li>• <Badge variant="info" size="sm">Árbitro</Badge> - Para árbitros oficiales</li>
                <li>• <Badge variant="secondary" size="sm">Administrador</Badge> - Para administradores de club</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Estados de Credencial</h4>
              <ul className="space-y-1">
                <li>• <Badge variant="success" size="sm">Activa</Badge> - Válida y verificable</li>
                <li>• <Badge variant="error" size="sm">Expirada</Badge> - Requiere renovación</li>
                <li>• <Badge variant="warning" size="sm">Suspendida</Badge> - Temporalmente inválida</li>
                <li>• <Badge variant="secondary" size="sm">Revocada</Badge> - Permanentemente inválida</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Verificación</h4>
              <ul className="space-y-1">
                <li>• Escaneo de código QR con cualquier dispositivo</li>
                <li>• Verificación manual por ID</li>
                <li>• Verificación masiva para eventos</li>
                <li>• Historial de verificaciones</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Contact Support */}
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">¿Necesitas ayuda?</h4>
              <p className="text-blue-800 text-sm mb-3">
                Si tienes problemas con tu credencial o necesitas asistencia, contacta al soporte técnico.
              </p>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Contactar Soporte
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};