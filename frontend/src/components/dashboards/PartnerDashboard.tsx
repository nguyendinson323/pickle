import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import StatCard from '../dashboard/StatCard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  BriefcaseIcon,
  CogIcon,
  InboxIcon,
  PresentationChartBarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const PartnerDashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Mock data since slices don't exist
  const dashboardData = {
    statistics: {
      activeCampaigns: 3,
      activeSponshorships: 5,
      pendingContracts: 2
    }
  };
  const unreadCount = 0;
  const userDisplayName = user?.profile && 'businessName' in user.profile
    ? user.profile.businessName
    : user?.profile && 'contactPersonName' in user.profile
    ? user.profile.contactPersonName
    : 'Empresa Patrocinadora';

  useEffect(() => {
    // Mock loading effect
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const tabs = [
    {
      id: 'profile',
      label: 'Perfil Partner',
      icon: <BriefcaseIcon className="w-4 h-4" />,
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
      id: 'campaigns',
      label: 'Campañas',
      icon: <PresentationChartBarIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.activeCampaigns || 0
    },
    {
      id: 'sponsorships',
      label: 'Patrocinios',
      icon: <BriefcaseIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.activeSponshorships || 0
    },
    {
      id: 'contracts',
      label: 'Contratos',
      icon: <DocumentTextIcon className="w-4 h-4" />,
      count: dashboardData?.statistics?.pendingContracts || 0
    },
    {
      id: 'billing',
      label: 'Facturación',
      icon: <CurrencyDollarIcon className="w-4 h-4" />,
      count: 0
    }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Perfil del Partner</h3>
              <p className="text-purple-100 mb-4">
                {userDisplayName}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-200">ID Partner:</span>
                  <span className="ml-2 font-medium">{user?.id || 'PART001'}</span>
                </div>
                <div>
                  <span className="text-purple-200">Industria:</span>
                  <span className="ml-2 font-medium">Deportes</span>
                </div>
                <div>
                  <span className="text-purple-200">Desde:</span>
                  <span className="ml-2 font-medium">2023</span>
                </div>
                <div>
                  <span className="text-purple-200">Estatus:</span>
                  <span className="ml-2 font-medium">Premium</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <BriefcaseIcon className="w-10 h-10 text-white" />
              </div>
              <Button variant="secondary" size="sm" className="text-white border-white/30">
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Información Comercial</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Razón Social</label>
                <p className="text-gray-900">Empresa Deportiva S.A. de C.V.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">RFC</label>
                <p className="text-gray-900">EDS123456ABC</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contacto Principal</label>
                <p className="text-gray-900">Director Comercial</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">contacto@empresa.com</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Productos/Servicios</h4>
            <div className="space-y-2">
              <Badge variant="primary">Equipamiento Deportivo</Badge>
              <Badge variant="success">Raquetas de Pickleball</Badge>
              <Badge variant="warning">Pelotas Oficiales</Badge>
              <Badge variant="secondary">Ropa Deportiva</Badge>
              <Badge variant="secondary">Accesorios</Badge>
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-4">
              Actualizar Catálogo
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderCampaignsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Campañas Activas</h3>
        <Button variant="primary">
          <PresentationChartBarIcon className="w-4 h-4 mr-2" />
          Nueva Campaña
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { 
            name: 'Torneo Nacional 2024', 
            status: 'active', 
            budget: '$50,000', 
            reach: '15,000',
            engagement: '8.5%'
          },
          { 
            name: 'Liga Estatal CDMX', 
            status: 'active', 
            budget: '$25,000', 
            reach: '8,500',
            engagement: '12.3%'
          },
          { 
            name: 'Clínicas Juveniles', 
            status: 'planning', 
            budget: '$15,000', 
            reach: '3,200',
            engagement: '15.8%'
          }
        ].map((campaign, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                <Badge 
                  variant={
                    campaign.status === 'active' ? 'success' :
                    campaign.status === 'planning' ? 'warning' :
                    'secondary'
                  }
                >
                  {campaign.status === 'active' ? 'Activa' :
                   campaign.status === 'planning' ? 'Planeación' :
                   'Pausada'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Presupuesto:</span>
                  <span className="font-medium">{campaign.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span>Alcance:</span>
                  <span className="font-medium">{campaign.reach}</span>
                </div>
                <div className="flex justify-between">
                  <span>Engagement:</span>
                  <span className="font-medium">{campaign.engagement}</span>
                </div>
              </div>
              
              <Button variant="secondary" size="sm" className="w-full">
                Ver Métricas
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSponsorshipsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Patrocinios</h3>
        <Button variant="primary">
          <BriefcaseIcon className="w-4 h-4 mr-2" />
          Nuevo Patrocinio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Patrocinios Activos</h4>
            <div className="space-y-4">
              {[
                { 
                  event: 'Torneo Nacional de Pickleball 2024',
                  type: 'Patrocinio Principal',
                  amount: '$100,000',
                  duration: '12 meses',
                  status: 'active'
                },
                { 
                  event: 'Liga Regional Norte',
                  type: 'Patrocinio Equipamiento',
                  amount: '$35,000',
                  duration: '6 meses',
                  status: 'active'
                },
                { 
                  event: 'Campeonato Juvenil',
                  type: 'Patrocinio Premios',
                  amount: '$20,000',
                  duration: '3 meses',
                  status: 'pending'
                }
              ].map((sponsorship, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">{sponsorship.event}</h5>
                    <Badge 
                      variant={
                        sponsorship.status === 'active' ? 'success' :
                        sponsorship.status === 'pending' ? 'warning' :
                        'secondary'
                      }
                    >
                      {sponsorship.status === 'active' ? 'Activo' :
                       sponsorship.status === 'pending' ? 'Pendiente' :
                       'Inactivo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{sponsorship.type}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Monto:</span>
                      <span className="ml-2 font-medium">{sponsorship.amount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duración:</span>
                      <span className="ml-2 font-medium">{sponsorship.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'account':
        return (
          <div className="text-center py-12">
            <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración de Cuenta</h3>
            <p className="text-gray-500">Gestiona la información de tu empresa y preferencias.</p>
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
      case 'campaigns':
        return renderCampaignsTab();
      case 'sponsorships':
        return renderSponsorshipsTab();
      case 'contracts':
        return (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestión de Contratos</h3>
            <p className="text-gray-500">Revisa y gestiona tus contratos de patrocinio.</p>
          </div>
        );
      case 'billing':
        return (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Facturación</h3>
            <p className="text-gray-500">Gestiona facturas y pagos de patrocinios.</p>
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Partner Dashboard
          </h1>
          {user && (
            <p className="mt-1 text-sm text-gray-500">
              Bienvenido, {userDisplayName}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Campañas Activas"
              value={dashboardData?.statistics?.activeCampaigns?.toString() || '3'}
              icon={<PresentationChartBarIcon className="w-6 h-6" />}
              trend={{ direction: 'up', value: 1, label: 'este mes' }}
              color="blue"
            />
            <StatCard
              title="Patrocinios"
              value={dashboardData?.statistics?.activeSponshorships?.toString() || '5'}
              icon={<BriefcaseIcon className="w-6 h-6" />}
              trend={{ direction: 'up', value: 2, label: 'este mes' }}
              color="green"
            />
            <StatCard
              title="Inversión Total"
              value="$155,000"
              icon={<CurrencyDollarIcon className="w-6 h-6" />}
              trend={{ direction: 'up', value: 12, label: 'este mes' }}
              color="purple"
            />
            <StatCard
              title="ROI Promedio"
              value="285%"
              icon={<PresentationChartBarIcon className="w-6 h-6" />}
              trend={{ direction: 'up', value: 25, label: 'este mes' }}
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
                        ? 'border-purple-500 text-purple-600'
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

export default PartnerDashboard;