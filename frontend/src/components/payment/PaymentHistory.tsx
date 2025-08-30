import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchPayments, refundPayment } from '../../store/paymentSlice';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface PaymentHistoryProps {
  userId?: number;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const { payments, loading, error } = useAppSelector(state => state.payment);
  const { user } = useAppSelector(state => state.auth);
  
  const [showRefundModal, setShowRefundModal] = useState<number | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchPayments({ 
      page, 
      limit,
      userId: userId || user?.id 
    }));
  }, [dispatch, page, userId, user?.id]);

  const handleRefund = async () => {
    if (!showRefundModal) return;
    
    try {
      await dispatch(refundPayment({
        paymentId: showRefundModal,
        reason: refundReason
      })).unwrap();
      
      setShowRefundModal(null);
      setRefundReason('');
      
      // Refresh payments
      dispatch(fetchPayments({ 
        page, 
        limit,
        userId: userId || user?.id 
      }));
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      case 'refunded':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canRefund = (payment: any) => {
    const paymentDate = new Date(payment.createdAt);
    const daysSincePayment = (Date.now() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);
    return payment.status === 'completed' && daysSincePayment <= 30;
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error al cargar el historial</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3"
          onClick={() => dispatch(fetchPayments({ page, limit, userId: userId || user?.id }))}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Historial de Pagos
        </h2>
        <div className="text-sm text-gray-500">
          Total: {payments.length} pagos
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-gray-500 text-lg font-medium mt-4">
            No hay pagos registrados
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            Tus pagos aparecerán aquí una vez que realices tu primera compra.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {payment.description || 'Pago de Membresía'}
                    </h3>
                    <Badge variant={getStatusColor(payment.status)}>
                      {getStatusText(payment.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Monto:</span>
                      <div className="font-semibold text-gray-900">
                        {formatAmount(payment.amount)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Fecha:</span>
                      <div className="font-medium text-gray-900">
                        {formatDate(payment.createdAt)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Método:</span>
                      <div className="font-medium text-gray-900">
                        {payment.paymentMethod || 'Tarjeta de crédito'}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">ID de transacción:</span>
                      <div className="font-mono text-xs text-gray-600">
                        {payment.stripeChargeId || payment.id}
                      </div>
                    </div>
                  </div>

                  {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Información adicional:
                      </h4>
                      <div className="text-sm text-gray-600">
                        {Object.entries(payment.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace('_', ' ')}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  {canRefund(payment) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRefundModal(payment.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Solicitar reembolso
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/invoices/${payment.id}`, '_blank')}
                  >
                    Ver factura
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Refund Modal */}
      <Modal
        isOpen={!!showRefundModal}
        onClose={() => {
          setShowRefundModal(null);
          setRefundReason('');
        }}
        title="Solicitar Reembolso"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que quieres solicitar un reembolso para este pago?
            Los reembolsos pueden tardar 5-10 días hábiles en procesarse.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo del reembolso (opcional)
            </label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Explica el motivo de tu solicitud de reembolso..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowRefundModal(null);
                setRefundReason('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleRefund}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Procesando...
                </>
              ) : (
                'Confirmar Reembolso'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pagination */}
      {payments.length >= limit && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            Página {page}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={payments.length < limit || loading}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};