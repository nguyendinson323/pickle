import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchPaymentMethods,
  createSetupIntent,
  savePaymentMethod,
  removePaymentMethod,
  clearSetupIntent
} from '../../store/subscriptionSlice';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  CreditCardIcon, 
  PlusIcon, 
  TrashIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';

const stripePromise = loadStripe((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || '');

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

interface AddPaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const { setupIntentClientSecret, loading } = useAppSelector(state => state.subscription);
  
  const [processing, setProcessing] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !setupIntentClientSecret) return;

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    try {
      const { error, setupIntent } = await stripe.confirmCardSetup(
        setupIntentClientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Cardholder Name', // You might want to collect this
            },
          }
        }
      );

      if (error) {
        console.error('Setup error:', error);
        setProcessing(false);
        return;
      }

      if (setupIntent.status === 'succeeded') {
        await dispatch(savePaymentMethod({
          paymentMethodId: setupIntent.payment_method as string,
          isDefault
        })).unwrap();

        onSuccess();
      }
    } catch (err) {
      console.error('Payment method save error:', err);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="flex items-center">
        <input
          id="set-default"
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="set-default" className="ml-2 text-sm text-gray-700">
          Establecer como método de pago predeterminado
        </label>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
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
              Guardando...
            </>
          ) : (
            'Guardar tarjeta'
          )}
        </Button>
      </div>
    </form>
  );
};

export const PaymentMethodManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { paymentMethods, loading, error } = useAppSelector(state => state.subscription);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const handleAddPaymentMethod = async () => {
    try {
      await dispatch(createSetupIntent()).unwrap();
      setShowAddModal(true);
    } catch (error) {
      console.error('Failed to create setup intent:', error);
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
      return;
    }

    setRemovingId(paymentMethodId);
    try {
      await dispatch(removePaymentMethod(paymentMethodId)).unwrap();
    } catch (error) {
      console.error('Failed to remove payment method:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    dispatch(clearSetupIntent());
  };

  const handleAddCancel = () => {
    setShowAddModal(false);
    dispatch(clearSetupIntent());
  };

  const getCardBrandIcon = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower.includes('visa')) return '💳';
    if (brandLower.includes('mastercard')) return '💳';
    if (brandLower.includes('amex')) return '💳';
    return '💳';
  };

  if (loading && paymentMethods.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-32">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Métodos de Pago
        </h3>
        <Button
          onClick={handleAddPaymentMethod}
          variant="primary"
          size="sm"
          disabled={loading}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Agregar tarjeta
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {paymentMethods.length === 0 && !loading ? (
        <div className="text-center py-12">
          <CreditCardIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-gray-500 font-medium mb-2">
            No tienes métodos de pago guardados
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            Agrega una tarjeta para facilitar tus pagos futuros.
          </p>
          <Button onClick={handleAddPaymentMethod} variant="primary">
            <PlusIcon className="h-4 w-4 mr-2" />
            Agregar primera tarjeta
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((paymentMethod) => (
            <div
              key={paymentMethod.id}
              className={`bg-white rounded-lg border-2 p-4 flex items-center justify-between ${
                paymentMethod.isDefault 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-8 bg-gray-100 rounded">
                  <span className="text-lg">
                    {paymentMethod.card ? getCardBrandIcon(paymentMethod.card.brand) : '💳'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">
                      {paymentMethod.card ? (
                        `•••• •••• •••• ${paymentMethod.card.last4}`
                      ) : (
                        'Tarjeta'
                      )}
                    </p>
                    {paymentMethod.isDefault && (
                      <Badge variant="success" size="sm">
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Predeterminada
                      </Badge>
                    )}
                  </div>
                  {paymentMethod.card && (
                    <p className="text-sm text-gray-500">
                      {paymentMethod.card.brand.toUpperCase()} • 
                      Expira {paymentMethod.card.expMonth}/{paymentMethod.card.expYear}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleRemovePaymentMethod(paymentMethod.id)}
                  variant="outline"
                  size="sm"
                  disabled={removingId === paymentMethod.id}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  {removingId === paymentMethod.id ? (
                    <LoadingSpinner className="h-4 w-4" />
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Payment Method Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleAddCancel}
        title="Agregar método de pago"
        size="md"
      >
        <Elements stripe={stripePromise}>
          <AddPaymentMethodForm
            onSuccess={handleAddSuccess}
            onCancel={handleAddCancel}
          />
        </Elements>
      </Modal>
    </div>
  );
};