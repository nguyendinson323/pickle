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
  selectMessages, 
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
  FlagIcon,
  CogIcon,
  InboxIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const StateDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectDashboardData);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);
  const messages = useAppSelector(selectMessages);
  const unreadCount = useAppSelector(selectUnreadCount);
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchMessages({ page: 1, limit: 10 }));
  }, [dispatch]);

  const tabs = [
    {
      id: 'overview',
      label: 'Resumen Estatal',
      icon: <FlagIcon className="w-4 h-4" />,
      count: 0
    },
    {
      id: 'account',
      label: 'Mi Cuenta',
      icon: <CogIcon className="w-4 h-4" />,
      count: 0
    },
    {
      id: 'inbox',
      label: 'Bandeja',
      icon: <InboxIcon className="w-4 h-4" />,
      count: unreadCount
    },
    {
      id: 'clubs',
      label: 'Clubes',
      icon: <BuildingOfficeIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.registeredClubs || 0
    },
    {
      id: 'tournaments',
      label: 'Torneos',
      icon: <TrophyIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.stateTournaments || 0
    },
    {
      id: 'players',
      label: 'Jugadores',
      icon: <UserGroupIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.registeredPlayers || 0
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: <DocumentTextIcon className="w-4 h-4" />,
      count: 0
    }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Comité Estatal</h3>
              <p className="text-red-100 mb-4">
                {dashboardData?.user?.state || 'Estado de México'}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-red-200">Código:</span>
                  <span className="ml-2 font-medium">MEX</span>
                </div>
                <div>
                  <span className="text-red-200">Región:</span>
                  <span className="ml-2 font-medium">Centro</span>
                </div>
                <div>
                  <span className="text-red-200">Establecido:</span>
                  <span className="ml-2 font-medium">2019</span>
                </div>
                <div>
                  <span className="text-red-200">Estatus:</span>
                  <span className="ml-2 font-medium">Activo</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <FlagIcon className="w-10 h-10 text-white" />
              </div>
              <Button variant="ghost" size="sm" className="text-white border-white/30">
                Ver Certificado
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Desarrollo del Estado</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Clubes Registrados</span>
                <span className="font-medium">{dashboardData?.statistics?.registeredClubs || 28}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Jugadores Activos</span>
                <span className="font-medium">{dashboardData?.statistics?.registeredPlayers || 1240}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Entrenadores</span>
                <span className="font-medium">{dashboardData?.statistics?.certifiedCoaches || 45}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Actividad Reciente</h4>
            <div className="space-y-2">
              <div className="text-xs text-gray-500 bg-green-50 p-2 rounded">
                Nuevo club registrado: Club Deportivo Toluca
              </div>
              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                Torneo estatal programado para Mayo
              </div>
              <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
                15 nuevos jugadores certificados
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Objetivos 2024</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Nuevos Clubes</span>
                  <span>28/35</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Jugadores</span>
                  <span>1240/1500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderClubsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Clubes Registrados</h3>
        <Button variant="primary">
          <BuildingOfficeIcon className="w-4 h-4 mr-2" />
          Registrar Club
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Club Deportivo Toluca', city: 'Toluca', members: 45, status: 'active' },
          { name: 'Pickleball Naucalpan', city: 'Naucalpan', members: 67, status: 'active' },
          { name: 'Club Satélite', city: 'Ciudad Satélite', members: 38, status: 'active' },
          { name: 'Deportivo Texcoco', city: 'Texcoco', members: 29, status: 'pending' },
          { name: 'Club Valle de Bravo', city: 'Valle de Bravo', members: 52, status: 'active' },
          { name: 'Pickleball Ecatepec', city: 'Ecatepec', members: 41, status: 'active' }
        ].map((club, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">{club.name}</h4>
                  <p className="text-sm text-gray-500">{club.city}</p>
                </div>
                <Badge 
                  variant={club.status === 'active' ? 'success' : 'warning'}
                >
                  {club.status === 'active' ? 'Activo' : 'Pendiente'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Miembros:</span>
                  <span className="font-medium">{club.members}</span>
                </div>
                <div className="flex justify-between">
                  <span>Última actualización:</span>
                  <span className="font-medium">Hace {Math.floor(Math.random() * 10) + 1} días</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" fullWidth>
                Ver Detalles
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTournamentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Torneos Estatales</h3>
        <Button variant="primary">
          <TrophyIcon className="w-4 h-4 mr-2" />
          Nuevo Torneo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            name: 'Campeonato Estatal 2024',
            date: '15-17 Jun 2024',
            location: 'Toluca',
            participants: 128,
            status: 'upcoming'
          },
          { 
            name: 'Liga Regional Norte',
            date: '2-4 Ago 2024',
            location: 'Naucalpan',
            participants: 64,
            status: 'registration'
          },
          { 
            name: 'Torneo Juvenil Estatal',
            date: '5-7 Jul 2024',
            location: 'Texcoco',
            participants: 32,
            status: 'planning'
          },
          { 
            name: 'Copa Estado de México',
            date: '10-12 Mar 2024',
            location: 'Valle de Bravo',
            participants: 96,
            status: 'completed'
          }
        ].map((tournament, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">{tournament.name}</h4>
                <Badge 
                  variant={
                    tournament.status === 'upcoming' ? 'primary' :
                    tournament.status === 'registration' ? 'warning' :
                    tournament.status === 'planning' ? 'secondary' :
                    'success'
                  }
                >
                  {tournament.status === 'upcoming' ? 'Próximo' :
                   tournament.status === 'registration' ? 'Inscripciones' :
                   tournament.status === 'planning' ? 'Planeación' :
                   'Completado'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span className="font-medium">{tournament.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sede:</span>
                  <span className="font-medium">{tournament.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participantes:</span>
                  <span className="font-medium">{tournament.participants}</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" fullWidth>
                Gestionar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'account':
        return (
          <div className="text-center py-12">
            <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración de Cuenta</h3>
            <p className="text-gray-500">Gestiona la información del comité estatal.</p>
          </div>
        );
      case 'inbox':
        return (
          <div className="text-center py-12">
            <InboxIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mensajes</h3>
            <p className="text-gray-500">Tu bandeja de entrada está vacía.</p>
          </div>
        );
      case 'clubs':
        return renderClubsTab();
      case 'tournaments':
        return renderTournamentsTab();
      case 'players':
        return (
          <div className="text-center py-12">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Jugadores Registrados</h3>
            <p className="text-gray-500">Base de datos de jugadores del estado.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Reportes Estatales</h3>
            <p className="text-gray-500">Genera reportes y estadísticas del estado.</p>
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
          <p className="text-red-600 mb-4">Error cargando el dashboard</p>
          <Button onClick={() => dispatch(fetchDashboardData())}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Clubes Registrados"
            value={dashboardData?.statistics?.registeredClubs?.toString() || '28'}
            change="+4"
            changeType="positive"
            icon={<BuildingOfficeIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Jugadores Activos"
            value={dashboardData?.statistics?.registeredPlayers?.toString() || '1,240'}
            change="+85"
            changeType="positive"
            icon={<UserGroupIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Torneos Anuales"
            value={dashboardData?.statistics?.stateTournaments?.toString() || '12'}
            change="+3"
            changeType="positive"
            icon={<TrophyIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Entrenadores"
            value={dashboardData?.statistics?.certifiedCoaches?.toString() || '45'}
            change="+7"
            changeType="positive"
            icon={<UserGroupIcon className="w-6 h-6" />}
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

export default StateDashboard;