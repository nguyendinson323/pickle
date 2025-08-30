import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import StatCard from '../dashboard/StatCard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
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
  const { user } = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data since slices don't exist
  const dashboardData = {
    user: user || {
      firstName: 'Estado',
      lastName: 'de México'
    },
    statistics: {
      registeredClubs: 28,
      registeredPlayers: 1240,
      stateTournaments: 12,
      certifiedCoaches: 45
    }
  };
  const unreadCount = 0;

  useEffect(() => {
    // Mock loading effect
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

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
                Estado de México
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
              
              <Button variant="secondary" size="sm" className="w-full">
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
              
              <Button variant="secondary" size="sm" className="w-full">
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
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Panel Estatal
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenido al sistema de gestión estatal
          </p>
        </div>
        <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Clubes Registrados"
            value={dashboardData?.statistics?.registeredClubs?.toString() || '28'}
            icon={<BuildingOfficeIcon className="w-6 h-6" />}
            trend={{ direction: 'up', value: 4, label: 'este mes' }}
            color="blue"
          />
          <StatCard
            title="Jugadores Activos"
            value={dashboardData?.statistics?.registeredPlayers?.toString() || '1,240'}
            icon={<UserGroupIcon className="w-6 h-6" />}
            trend={{ direction: 'up', value: 85, label: 'este mes' }}
            color="green"
          />
          <StatCard
            title="Torneos Anuales"
            value={dashboardData?.statistics?.stateTournaments?.toString() || '12'}
            icon={<TrophyIcon className="w-6 h-6" />}
            trend={{ direction: 'up', value: 3, label: 'este mes' }}
            color="purple"
          />
          <StatCard
            title="Entrenadores"
            value={dashboardData?.statistics?.certifiedCoaches?.toString() || '45'}
            icon={<UserGroupIcon className="w-6 h-6" />}
            trend={{ direction: 'up', value: 7, label: 'este mes' }}
            color="yellow"
          />
        </div>

        {/* Main Content with Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2
                    ${activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-900">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StateDashboard;