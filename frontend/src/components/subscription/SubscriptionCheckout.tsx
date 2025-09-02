import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearPaymentSecrets, fetchCurrentSubscription } from '../../store/subscriptionSlice';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151',
      '::placeholder': {
        color: '#9CA3AF',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    invalid: {
      color: '#EF4444',
    },
  },
  hidePostalCode: false,
};

interface SubscriptionCheckoutProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const SubscriptionCheckout: React.FC<SubscriptionCheckoutProps> = ({
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  
  const { 
    subscriptionClientSecret, 
    currentSubscription,
    loading 
  } = useAppSelector(state => state.subscription);
  const { user } = useAppSelector(state => state.auth);

  const [processing, setProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: user?.username || user?.email || '',
    email: user?.email || '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'MX'
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !subscriptionClientSecret) return;

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        subscriptionClientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: billingDetails,
          }
        }
      );

      if (error) {
        console.error('Payment confirmation error:', error);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentSucceeded(true);
        dispatch(clearPaymentSecrets());
        
        // Refresh subscription data
        setTimeout(() => {
          dispatch(fetchCurrentSubscription());
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    dispatch(clearPaymentSecrets());
    onCancel();
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  if (paymentSucceeded) {
    return (
      <div className="text-center py-8">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Pago exitoso!
        </h3>
        <p className="text-gray-600 mb-4">
          Tu suscripción ha sido activada correctamente.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-green-800 mb-2">
            ¡Bienvenido a tu nuevo plan!
          </h4>
          <p className="text-green-700 text-sm">
            Ya puedes acceder a todas las funciones incluidas en tu suscripción.
          </p>
        </div>
        <Button onClick={onSuccess} variant="primary">
          Continuar
        </Button>
      </div>
    );
  }

  if (!subscriptionClientSecret || !currentSubscription) {
    return (
      <div className="text-center py-8">
        <h3 className="text-gray-500 text-lg font-medium">
          No hay pago pendiente
        </h3>
        <p className="text-gray-400 text-sm mt-2">
          No se encontró información de pago válida.
        </p>
        <Button onClick={onCancel} variant="secondary" className="mt-4">
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-6">
        {/* Payment summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">
            Resumen de suscripción
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-800">Plan:</span>
              <span className="font-medium text-blue-900">
                {currentSubscription.plan?.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-800">Facturación:</span>
              <span className="font-medium text-blue-900">
                {currentSubscription.interval === 'month' ? 'Mensual' : 'Anual'}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-blue-200 pt-2">
              <span className="text-blue-800">Total a pagar:</span>
              <span className="text-lg font-bold text-blue-900">
                {formatAmount(currentSubscription.amount, currentSubscription.currency)}
              </span>
            </div>
            <p className="text-xs text-blue-600">
              IVA (16%) incluido • Pago seguro con Stripe
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Billing details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={billingDetails.name}
                onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={billingDetails.email}
                onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (opcional)
            </label>
            <input
              type="text"
              value={billingDetails.phone}
              onChange={(e) => setBillingDetails(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={billingDetails.address.city}
                onChange={(e) => setBillingDetails(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, city: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <input
                type="text"
                value={billingDetails.address.state}
                onChange={(e) => setBillingDetails(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, state: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código postal
            </label>
            <input
              type="text"
              value={billingDetails.address.postal_code}
              onChange={(e) => setBillingDetails(prev => ({ 
                ...prev, 
                address: { ...prev.address, postal_code: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Card information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Información de la tarjeta
            </label>
            <div className="p-4 border border-gray-300 rounded-lg bg-white">
              <CardElement 
                options={CARD_ELEMENT_OPTIONS}
                onChange={(event) => setCardComplete(event.complete)}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Términos de suscripción
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• La suscripción se renueva automáticamente</li>
              <li>• Puedes cancelar en cualquier momento</li>
              <li>• El acceso continúa hasta el final del período pagado</li>
              <li>• Los reembolsos se procesan según nuestros términos</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="flex-1"
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={!stripe || processing || !cardComplete || loading}
            >
              {processing ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Procesando...
                </>
              ) : (
                `Pagar ${formatAmount(currentSubscription.amount, currentSubscription.currency)}`
              )}
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Tu información está protegida por cifrado SSL de 256 bits.
              No almacenamos datos de tarjetas de crédito.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};