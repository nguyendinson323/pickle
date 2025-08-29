import React, { useState } from 'react';
import { useAppSelector } from '../store';
import { Layout } from '../components/common/Layout';
import { Tabs } from '../components/ui/Tabs';
import { MembershipPlans } from '../components/payment/MembershipPlans';
import { MembershipStatus } from '../components/payment/MembershipStatus';
import { PaymentHistory } from '../components/payment/PaymentHistory';
import { PaymentForm } from '../components/payment/PaymentForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export const MembershipPage: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const { currentPaymentIntent } = useAppSelector(state => state.payment);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('status');

  // Show payment modal when payment intent is created
  React.useEffect(() => {
    if (currentPaymentIntent) {
      setShowPaymentModal(true);
    }
  }, [currentPaymentIntent]);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setActiveTab('status'); // Switch to status tab to see updated membership
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const tabs = [
    {
      id: 'status',
      label: 'Mi Membresía',
      content: <MembershipStatus />
    },
    {
      id: 'plans',
      label: 'Planes Disponibles',
      content: <MembershipPlans userRole={user?.role} />
    },
    {
      id: 'history',
      label: 'Historial de Pagos',
      content: <PaymentHistory />
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Membresía
            </h1>
            <p className="mt-2 text-gray-600">
              Administra tu suscripción, revisa tu historial de pagos y explora planes disponibles.
            </p>
          </div>

          {/* Welcome Message for New Users */}
          {user && !user.stripeCustomerId && (
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex">
                <svg className="h-6 w-6 text-blue-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-blue-900 font-semibold text-lg">
                    ¡Bienvenido a la Federación Mexicana de Pickleball!
                  </h3>
                  <p className="text-blue-800 mt-1">
                    Para acceder a todas las funcionalidades de la plataforma, necesitas una membresía activa. 
                    Explora nuestros planes y elige el que mejor se adapte a tus necesidades.
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      onClick={() => setActiveTab('plans')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Ver Planes Disponibles
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="p-6"
            />
          </div>

          {/* Payment Modal */}
          <Modal
            isOpen={showPaymentModal}
            onClose={handlePaymentCancel}
            title="Procesar Pago"
            size="lg"
          >
            <div className="p-4">
              <PaymentForm
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </div>
          </Modal>

          {/* Footer Information */}
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Pago Seguro
                </h4>
                <p className="text-gray-600 text-sm">
                  Todos los pagos son procesados de forma segura a través de Stripe. 
                  No almacenamos tu información de tarjeta de crédito.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Soporte
                </h4>
                <p className="text-gray-600 text-sm">
                  ¿Necesitas ayuda? Contacta a nuestro equipo de soporte en 
                  <span className="text-blue-600"> soporte@federacionpickleball.mx</span>
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Política de Reembolso
                </h4>
                <p className="text-gray-600 text-sm">
                  Puedes solicitar un reembolso completo dentro de los primeros 30 días 
                  desde la fecha de compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};