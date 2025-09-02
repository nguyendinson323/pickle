import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchCurrentSubscription,
  cancelSubscription,
  changePlan,
  reactivateSubscription,
  fetchUpcomingInvoice,
  fetchPaymentHistory
} from '../../store/subscriptionSlice';
import { SubscriptionPlans } from './SubscriptionPlans';
import { PaymentMethodManager } from './PaymentMethodManager';
import { SubscriptionCheckout } from './SubscriptionCheckout';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Tabs from '../ui/Tabs';
import Modal from '../ui/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  CreditCardIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const stripePromise = loadStripe((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const SubscriptionManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    currentSubscription, 
    subscriptionClientSecret, 
    paymentHistory, 
    upcomingInvoice,
    loading, 
    error 
  } = useAppSelector(state => state.subscription);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentSubscription());
    dispatch(fetchPaymentHistory());
    dispatch(fetchUpcomingInvoice());
  }, [dispatch]);

  // Show checkout modal when subscription is created
  useEffect(() => {
    if (subscriptionClientSecret) {
      setShowCheckout(true);
    }
  }, [subscriptionClientSecret]);

  const handleCancelSubscription = async (immediately: boolean = false) => {
    setCancelling(true);
    try {
      await dispatch(cancelSubscription({ immediately })).unwrap();
      setShowCancelModal(false);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await dispatch(reactivateSubscription()).unwrap();
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Activo</Badge>;
      case 'past_due':
        return <Badge variant="warning">Pago Vencido</Badge>;
      case 'canceled':
        return <Badge variant="error">Cancelado</Badge>;
      case 'trialing':
        return <Badge variant="info">Prueba</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const tabItems = [
    { id: 'overview', label: 'Resumen', icon: ChartBarIcon },
    { id: 'plans', label: 'Cambiar Plan', icon: CreditCardIcon },
    { id: 'payment-methods', label: 'Métodos de Pago', icon: CreditCardIcon },
    { id: 'history', label: 'Historial', icon: CalendarDaysIcon }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Suscripción
        </h1>
        <p className="text-gray-600">
          Administra tu plan, métodos de pago e historial de facturación.
        </p>
      </div>

      {/* Current Subscription Overview */}
      {currentSubscription && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Suscripción Actual
            </h2>
            {getStatusBadge(currentSubscription.status)}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Plan</h4>
              <p className="text-lg font-semibold text-blue-600">
                {currentSubscription.plan?.name || 'Plan Desconocido'}
              </p>
              <p className="text-sm text-gray-500">
                {formatCurrency(currentSubscription.amount, currentSubscription.currency)} / 
                {currentSubscription.interval === 'month' ? 'mes' : 'año'}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Próxima facturación</h4>
              <p className="text-lg">
                {formatDate(currentSubscription.nextBillingDate)}
              </p>
              {currentSubscription.cancelAtPeriodEnd && (
                <p className="text-sm text-red-600 font-medium">
                  Se cancelará en esta fecha
                </p>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Estado</h4>
              <div className="flex items-center space-x-2">
                {currentSubscription.status === 'active' ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                )}
                <span className="capitalize">
                  {currentSubscription.status === 'active' ? 'Activo' : currentSubscription.status}
                </span>
              </div>
            </div>
          </div>

          {/* Usage stats */}
          {currentSubscription.usage && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Uso del período actual</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {currentSubscription.usage.tournamentRegistrations}
                  </p>
                  <p className="text-sm text-gray-600">Torneos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {currentSubscription.usage.courtBookings}
                  </p>
                  <p className="text-sm text-gray-600">Reservas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {currentSubscription.usage.playerMatches}
                  </p>
                  <p className="text-sm text-gray-600">Búsquedas</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            {currentSubscription.cancelAtPeriodEnd ? (
              <Button
                onClick={handleReactivateSubscription}
                variant="primary"
                disabled={loading}
              >
                Reactivar suscripción
              </Button>
            ) : (
              <Button
                onClick={() => setShowCancelModal(true)}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Cancelar suscripción
              </Button>
            )}
          </div>
        </div>
      )}

      {/* No subscription state */}
      {!currentSubscription && !loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <CreditCardIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes una suscripción activa
          </h3>
          <p className="text-gray-600 mb-6">
            Elige un plan para acceder a todas las funciones de la plataforma.
          </p>
          <Button
            onClick={() => setActiveTab('plans')}
            variant="primary"
          >
            Ver planes disponibles
          </Button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <Tabs
          items={tabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="p-6">
          {activeTab === 'overview' && currentSubscription && (
            <div className="space-y-6">
              {/* Upcoming invoice */}
              {upcomingInvoice && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Próxima factura
                  </h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-blue-800">
                        {formatCurrency(upcomingInvoice.amount, upcomingInvoice.currency)}
                      </p>
                      <p className="text-blue-600 text-sm">
                        Fecha: {formatDate(upcomingInvoice.invoiceDate)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Add relevant stats here */}
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <SubscriptionPlans onPlanSelected={() => {}} />
          )}

          {activeTab === 'payment-methods' && (
            <PaymentMethodManager />
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Historial de Pagos
              </h3>
              {paymentHistory.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                  No hay pagos registrados
                </p>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Monto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(payment.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.description || 'Pago de suscripción'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payment.amount, payment.currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(payment.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancelar suscripción"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que quieres cancelar tu suscripción?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">
              ¿Qué sucede cuando cancelas?
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Conservarás el acceso hasta el final del período actual</li>
              <li>• No se te cobrará en el próximo ciclo de facturación</li>
              <li>• Podrás reactivar tu suscripción en cualquier momento</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowCancelModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Mantener suscripción
            </Button>
            <Button
              onClick={() => handleCancelSubscription(false)}
              variant="outline"
              className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Cancelando...
                </>
              ) : (
                'Cancelar al final del período'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Checkout Modal */}
      {subscriptionClientSecret && (
        <Modal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          title="Completar pago"
          size="lg"
        >
          <Elements stripe={stripePromise}>
            <SubscriptionCheckout
              onSuccess={() => {
                setShowCheckout(false);
                dispatch(fetchCurrentSubscription());
              }}
              onCancel={() => setShowCheckout(false)}
            />
          </Elements>
        </Modal>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};