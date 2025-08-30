import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

interface Membership {
  id: number;
  membershipPlanId: number;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  isAutoRenew: boolean;
  plan?: {
    id: number;
    name: string;
    planType: 'basic' | 'premium';
    annualFee: number;
    monthlyFee: number;
    features: string[];
    description: string;
  };
}

interface MembershipStatusProps {
  userId?: number;
}

export const MembershipStatus: React.FC<MembershipStatusProps> = ({ userId }) => {
  const { user } = useAppSelector(state => state.auth);
  
  // Mock payment data since slice doesn't exist
  const [payments, setPayments] = useState<any[]>([]);
  
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [loadingMemberships, setLoadingMemberships] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      // Mock memberships fetch
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockMemberships: Membership[] = [
          {
            id: 1,
            membershipPlanId: 1,
            status: 'active',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            isAutoRenew: true,
            plan: {
              id: 1,
              name: 'Premium Anual',
              planType: 'premium',
              annualFee: 999,
              monthlyFee: 99,
              features: [
                'Acceso completo a todas las canchas',
                'Reservas prioritarias',
                'Descuentos en torneos',
                'Estadísticas avanzadas',
                'Soporte 24/7'
              ],
              description: 'Plan premium con todas las funcionalidades'
            }
          }
        ];
        
        setMemberships(mockMemberships);
      } catch (error) {
        console.error('Error fetching memberships:', error);
      } finally {
        setLoadingMemberships(false);
      }
    };

    fetchMemberships();
    
    // Mock payments fetch
    setTimeout(() => {
      const mockPayments = [
        {
          id: 1,
          amount: 99900, // in cents
          status: 'completed',
          description: 'Membresía Premium Anual',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          amount: 29900,
          status: 'completed', 
          description: 'Membresía Básica Mensual',
          createdAt: '2024-01-01T09:15:00Z'
        }
      ];
      setPayments(mockPayments);
    }, 500);
  }, [userId, user?.id]);

  const handleCancelMembership = async () => {
    if (!showCancelModal) return;
    
    try {
      // Mock membership cancellation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update membership status to cancelled
      setMemberships(prev => prev.map(m => 
        m.id === showCancelModal 
          ? { ...m, status: 'cancelled' as const, isAutoRenew: false }
          : m
      ));
      
      console.log('Mock membership cancelled:', { id: showCancelModal, reason: cancelReason });
      
      setShowCancelModal(null);
      setCancelReason('');
    } catch (error) {
      console.error('Error cancelling membership:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'secondary';
      case 'cancelled':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'pending':
        return 'Pendiente';
      case 'expired':
        return 'Expirada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiration = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loadingMemberships) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const activeMemberships = memberships.filter(m => m.status === 'active');
  const otherMemberships = memberships.filter(m => m.status !== 'active');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Estado de Membresía
        </h2>
        
        {activeMemberships.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="max-w-sm mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes membresías activas
              </h3>
              <p className="text-gray-600 mb-4">
                Suscríbete a un plan para acceder a todas las funcionalidades de la plataforma.
              </p>
              <Button variant="primary">
                Ver Planes Disponibles
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeMemberships.map((membership) => {
              const daysLeft = getDaysUntilExpiration(membership.endDate);
              const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
              
              return (
                <Card key={membership.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {membership.plan?.name}
                        </h3>
                        <Badge variant={getStatusColor(membership.status)}>
                          {getStatusText(membership.status)}
                        </Badge>
                        {membership.plan?.planType === 'premium' && (
                          <Badge variant="primary">Premium</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Fecha de inicio:</span>
                          <div className="font-medium text-gray-900">
                            {formatDate(membership.startDate)}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500">Fecha de expiración:</span>
                          <div className={`font-medium ${
                            isExpiringSoon ? 'text-orange-600' : 'text-gray-900'
                          }`}>
                            {formatDate(membership.endDate)}
                            {daysLeft > 0 && (
                              <span className="text-sm ml-1">
                                ({daysLeft} días restantes)
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500">Renovación automática:</span>
                          <div className="font-medium text-gray-900">
                            {membership.isAutoRenew ? 'Activada' : 'Desactivada'}
                          </div>
                        </div>
                      </div>

                      {isExpiringSoon && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                          <div className="flex">
                            <svg className="h-5 w-5 text-orange-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <h4 className="text-orange-800 font-medium">Tu membresía expira pronto</h4>
                              <p className="text-orange-700 text-sm">
                                Renueva ahora para mantener el acceso a todas las funcionalidades.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {membership.plan?.features && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Beneficios incluidos:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            {membership.plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-600">
                                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-col gap-2">
                      <Button variant="secondary" size="sm">
                        Renovar Ahora
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowCancelModal(membership.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Previous/Cancelled Memberships */}
      {otherMemberships.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Historial de Membresías
          </h3>
          <div className="space-y-3">
            {otherMemberships.map((membership) => (
              <Card key={membership.id} className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {membership.plan?.name}
                      </span>
                      <Badge variant={getStatusColor(membership.status)}>
                        {getStatusText(membership.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(membership.startDate)} - {formatDate(membership.endDate)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Payments */}
      {payments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pagos Recientes
          </h3>
          <div className="space-y-2">
            {payments.slice(0, 3).map((payment) => (
              <div key={payment.id} className="flex justify-between items-center py-2 px-4 bg-white rounded border">
                <div>
                  <span className="font-medium text-gray-900">
                    {payment.description || 'Pago de Membresía'}
                  </span>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString('es-MX')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatAmount(payment.amount / 100)}
                  </div>
                  <Badge variant={getStatusColor(payment.status)} size="sm">
                    {getStatusText(payment.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="secondary" size="sm">
              Ver Todos los Pagos
            </Button>
          </div>
        </div>
      )}

      {/* Cancel Membership Modal */}
      <Modal
        isOpen={!!showCancelModal}
        onClose={() => {
          setShowCancelModal(null);
          setCancelReason('');
        }}
        title="Cancelar Membresía"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-yellow-800 font-medium">¿Estás seguro?</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  Al cancelar tu membresía perderás el acceso a las funcionalidades premium
                  al final del período actual. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de cancelación (opcional)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ayúdanos a mejorar contándonos por qué cancelas..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCancelModal(null);
                setCancelReason('');
              }}
              className="flex-1"
            >
              Mantener Membresía
            </Button>
            <Button
              variant="primary"
              onClick={handleCancelMembership}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Confirmar Cancelación
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};