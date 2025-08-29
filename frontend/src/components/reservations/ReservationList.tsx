import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchUserReservations, 
  cancelReservation, 
  checkInReservation,
  checkOutReservation,
  setCurrentPage,
  Reservation 
} from '../../store/slices/reservationSlice';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

export const ReservationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reservations, loading, error, pagination } = useAppSelector(state => state.reservations);

  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; reservation: Reservation | null }>({
    isOpen: false,
    reservation: null
  });
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    dispatch(fetchUserReservations({ page: 1, limit: 10 }));
  }, [dispatch]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: dateObj.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: dateObj.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: 'warning', label: 'Pendiente' },
      confirmed: { variant: 'success', label: 'Confirmada' },
      checked_in: { variant: 'primary', label: 'Check-in' },
      completed: { variant: 'success', label: 'Completada' },
      cancelled: { variant: 'danger', label: 'Cancelada' }
    };

    const config = statusMap[status as keyof typeof statusMap] || { variant: 'outline', label: status };
    
    return (
      <Badge variant={config.variant as any}>
        {config.label}
      </Badge>
    );
  };

  const canCancel = (reservation: Reservation) => {
    if (reservation.status === 'cancelled' || reservation.status === 'completed') return false;
    
    const now = new Date();
    const reservationDateTime = new Date(`${reservation.reservationDate}T${reservation.startTime}`);
    const hoursUntilReservation = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursUntilReservation > 2; // Can cancel if more than 2 hours away
  };

  const canCheckIn = (reservation: Reservation) => {
    if (reservation.status !== 'confirmed') return false;
    
    const now = new Date();
    const reservationDateTime = new Date(`${reservation.reservationDate}T${reservation.startTime}`);
    const minutesUntilReservation = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60);
    
    return minutesUntilReservation <= 30 && minutesUntilReservation >= -15; // 30 min before to 15 min after
  };

  const canCheckOut = (reservation: Reservation) => {
    return reservation.status === 'checked_in';
  };

  const handleCancelClick = (reservation: Reservation) => {
    setCancelModal({ isOpen: true, reservation });
    setCancelReason('');
  };

  const handleCancelConfirm = async () => {
    if (cancelModal.reservation) {
      setActionLoading(prev => ({ ...prev, [`cancel-${cancelModal.reservation!.id}`]: true }));
      
      try {
        await dispatch(cancelReservation({
          id: cancelModal.reservation.id,
          reason: cancelReason.trim() || undefined
        })).unwrap();
        
        setCancelModal({ isOpen: false, reservation: null });
      } catch (err) {
        // Error handled by Redux
      } finally {
        setActionLoading(prev => ({ ...prev, [`cancel-${cancelModal.reservation!.id}`]: false }));
      }
    }
  };

  const handleCheckIn = async (reservationId: number) => {
    setActionLoading(prev => ({ ...prev, [`checkin-${reservationId}`]: true }));
    
    try {
      await dispatch(checkInReservation(reservationId)).unwrap();
    } catch (err) {
      // Error handled by Redux
    } finally {
      setActionLoading(prev => ({ ...prev, [`checkin-${reservationId}`]: false }));
    }
  };

  const handleCheckOut = async (reservationId: number) => {
    setActionLoading(prev => ({ ...prev, [`checkout-${reservationId}`]: true }));
    
    try {
      await dispatch(checkOutReservation(reservationId)).unwrap();
    } catch (err) {
      // Error handled by Redux
    } finally {
      setActionLoading(prev => ({ ...prev, [`checkout-${reservationId}`]: false }));
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchUserReservations({ page, limit: 10 }));
  };

  if (loading && reservations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error al cargar las reservas
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => dispatch(fetchUserReservations({ page: 1, limit: 10 }))}>
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6l2 2h6a2 2 0 012 2v4m-8 16H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes reservas
        </h3>
        <p className="text-gray-600 mb-4">
          Cuando hagas una reserva aparecerá aquí.
        </p>
        <Link to="/courts">
          <Button variant="primary">
            Explorar Canchas
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-600 mt-1">
            {pagination.total} reserva{pagination.total !== 1 ? 's' : ''} encontrada{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        
        <Link to="/courts">
          <Button variant="primary">
            Nueva Reserva
          </Button>
        </Link>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {reservations.map((reservation) => {
          const startDateTime = formatDateTime(reservation.reservationDate, reservation.startTime);
          const endTime = formatDateTime(reservation.reservationDate, reservation.endTime).time;
          
          return (
            <Card key={reservation.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Reservation Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {reservation.court?.name || 'Cancha'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {reservation.court?.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(reservation.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Fecha:</span>
                      <p className="font-medium">{startDateTime.date}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Horario:</span>
                      <p className="font-medium">{startDateTime.time} - {endTime}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <p className="font-medium text-green-600">
                        {formatPrice(reservation.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {reservation.notes && (
                    <div className="mt-3">
                      <span className="text-gray-500 text-sm">Notas:</span>
                      <p className="text-sm text-gray-700">{reservation.notes}</p>
                    </div>
                  )}

                  {reservation.cancellationReason && (
                    <div className="mt-3">
                      <span className="text-red-500 text-sm">Motivo de cancelación:</span>
                      <p className="text-sm text-red-600">{reservation.cancellationReason}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to={`/reservations/${reservation.id}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Ver Detalles
                    </Button>
                  </Link>

                  {canCheckIn(reservation) && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={actionLoading[`checkin-${reservation.id}`]}
                      onClick={() => handleCheckIn(reservation.id)}
                    >
                      {actionLoading[`checkin-${reservation.id}`] ? 'Procesando...' : 'Check-in'}
                    </Button>
                  )}

                  {canCheckOut(reservation) && (
                    <Button
                      variant="success"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={actionLoading[`checkout-${reservation.id}`]}
                      onClick={() => handleCheckOut(reservation.id)}
                    >
                      {actionLoading[`checkout-${reservation.id}`] ? 'Procesando...' : 'Check-out'}
                    </Button>
                  )}

                  {canCancel(reservation) && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={actionLoading[`cancel-${reservation.id}`]}
                      onClick={() => handleCancelClick(reservation)}
                    >
                      Cancelar
                    </Button>
                  )}

                  {reservation.status === 'completed' && !reservation.courtReview && (
                    <Link to={`/courts/${reservation.courtId}/review?reservation=${reservation.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Reseñar
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            disabled={pagination.current === 1 || loading}
            onClick={() => handlePageChange(pagination.current - 1)}
          >
            Anterior
          </Button>
          
          <div className="flex space-x-2">
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (pagination.current <= 3) {
                pageNum = i + 1;
              } else if (pagination.current >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = pagination.current - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pagination.current === pageNum ? 'primary' : 'outline'}
                  size="sm"
                  disabled={loading}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            disabled={pagination.current === pagination.pages || loading}
            onClick={() => handlePageChange(pagination.current + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, reservation: null })}
        title="Cancelar Reserva"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas cancelar esta reserva?
          </p>
          
          {cancelModal.reservation && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {cancelModal.reservation.court?.name}
              </h4>
              <p className="text-sm text-gray-600">
                {formatDateTime(cancelModal.reservation.reservationDate, cancelModal.reservation.startTime).date} • {' '}
                {formatDateTime(cancelModal.reservation.reservationDate, cancelModal.reservation.startTime).time} - {' '}
                {formatDateTime(cancelModal.reservation.reservationDate, cancelModal.reservation.endTime).time}
              </p>
              <p className="text-sm text-green-600 font-medium mt-1">
                {formatPrice(cancelModal.reservation.totalAmount)}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de cancelación (opcional)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Escribe el motivo de la cancelación..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleCancelConfirm}
              disabled={actionLoading[`cancel-${cancelModal.reservation?.id}`]}
              className="flex-1"
            >
              {actionLoading[`cancel-${cancelModal.reservation?.id}`] ? 'Cancelando...' : 'Confirmar Cancelación'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setCancelModal({ isOpen: false, reservation: null })}
              disabled={actionLoading[`cancel-${cancelModal.reservation?.id}`]}
            >
              Mantener Reserva
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};