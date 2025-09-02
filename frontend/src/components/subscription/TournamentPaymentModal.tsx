import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppDispatch, useAppSelector } from '../../store';
import { createTournamentPayment, clearPaymentSecrets } from '../../store/subscriptionSlice';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

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

interface TournamentPaymentFormProps {
  tournamentId: string;
  amount: number;
  tournamentName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const TournamentPaymentForm: React.FC<TournamentPaymentFormProps> = ({
  tournamentId,
  amount,
  tournamentName,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const { tournamentPaymentClientSecret, loading } = useAppSelector(state => state.subscription);
  const { user } = useAppSelector(state => state.auth);

  const [processing, setProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentCreated, setPaymentCreated] = useState(false);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreatePayment = async () => {
    try {
      await dispatch(createTournamentPayment({
        tournamentId,
        amount: amount * 100, // Convert to cents
        currency: 'MXN'
      })).unwrap();
      setPaymentCreated(true);
    } catch (error) {
      console.error('Error creating tournament payment:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !tournamentPaymentClientSecret) return;

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        tournamentPaymentClientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.username || user?.email || '',
              email: user?.email || '',
            },
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
        
        setTimeout(() => {
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

  if (paymentSucceeded) {
    return (
      <div className="text-center py-8">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Inscripción exitosa!
        </h3>
        <p className="text-gray-600 mb-4">
          Tu inscripción al torneo "{tournamentName}" ha sido confirmada.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-700 text-sm">
            Recibirás un correo de confirmación con los detalles del torneo y las instrucciones adicionales.
          </p>
        </div>
      </div>
    );
  }

  if (!paymentCreated) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Inscripción al Torneo
          </h3>
          <p className="text-gray-600">
            {tournamentName}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-blue-800">Cuota de inscripción:</span>
            <span className="text-xl font-bold text-blue-900">
              {formatAmount(amount)}
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            IVA incluido • Pago único
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">
            Incluye:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Participación en el torneo</li>
            <li>• Kit de bienvenida</li>
            <li>• Refrigerios durante el evento</li>
            <li>• Certificado de participación</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreatePayment}
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner className="mr-2" />
                Procesando...
              </>
            ) : (
              'Continuar al pago'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Completar Pago
        </h3>
        <p className="text-gray-600">
          {tournamentName}
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-blue-800">Total a pagar:</span>
          <span className="text-xl font-bold text-blue-900">
            {formatAmount(amount)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="flex gap-3">
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
            disabled={!stripe || processing || !cardComplete}
          >
            {processing ? (
              <>
                <LoadingSpinner className="mr-2" />
                Procesando...
              </>
            ) : (
              `Pagar ${formatAmount(amount)}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

interface TournamentPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  amount: number;
  tournamentName: string;
  onSuccess: () => void;
}

export const TournamentPaymentModal: React.FC<TournamentPaymentModalProps> = ({
  isOpen,
  onClose,
  tournamentId,
  amount,
  tournamentName,
  onSuccess
}) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="md"
    >
      <Elements stripe={stripePromise}>
        <TournamentPaymentForm
          tournamentId={tournamentId}
          amount={amount}
          tournamentName={tournamentName}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </Elements>
    </Modal>
  );
};