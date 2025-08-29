import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { createReservation, detectConflicts, clearConflicts } from '../../store/slices/reservationSlice';
import { ReservationCalendar } from './ReservationCalendar';
import { TimeSlotPicker } from './TimeSlotPicker';
import { Button } from '../ui/Button';
import { FormField } from '../forms/FormField';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ReservationFormProps {
  courtId: number;
  court?: {
    id: number;
    name: string;
    hourlyRate: number;
    peakHourRate?: number;
    weekendRate?: number;
    maxAdvanceBookingDays: number;
    minBookingDuration: number;
    maxBookingDuration: number;
    cancellationPolicy: string;
  };
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ courtId, court }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, conflicts } = useAppSelector(state => state.reservations);

  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [notes, setNotes] = useState('');
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateDuration = () => {
    if (!selectedStartTime || !selectedEndTime) return 0;
    
    const start = new Date(`2000-01-01T${selectedStartTime}:00`);
    const end = new Date(`2000-01-01T${selectedEndTime}:00`);
    
    return (end.getTime() - start.getTime()) / (1000 * 60); // minutes
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedStartTime('');
    setSelectedEndTime('');
    setTotalPrice(0);
    setShowTimeSlots(true);
  };

  const handleSlotSelect = (startTime: string, endTime: string, price: number) => {
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
    setTotalPrice(price);
    
    // Check for conflicts
    dispatch(detectConflicts({
      courtId,
      date: selectedDate,
      startTime,
      endTime
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStartTime || !selectedEndTime) {
      alert('Por favor selecciona un horario');
      return;
    }

    if (conflicts.length > 0) {
      alert('No se puede procesar la reserva debido a los conflictos detectados');
      return;
    }

    try {
      const result = await dispatch(createReservation({
        courtId,
        reservationDate: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        notes: notes.trim() || undefined
      })).unwrap();

      // Navigate to reservation confirmation or payment
      navigate(`/reservations/${result.data.id}`, { 
        state: { 
          message: 'Reserva creada exitosamente. Procede con el pago para confirmarla.' 
        } 
      });
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const duration = calculateDuration();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reservar Cancha
        </h1>
        {court && (
          <p className="text-gray-600">
            {court.name} - {formatPrice(court.hourlyRate)}/hora
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar and Time Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Date Selection */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
                Selecciona la Fecha
              </h2>
              
              <ReservationCalendar
                courtId={courtId}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                minDate={today}
                maxAdvanceDays={court?.maxAdvanceBookingDays || 30}
              />
            </div>
          </Card>

          {/* Step 2: Time Selection */}
          {showTimeSlots && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                  Selecciona el Horario
                </h2>
                
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    Fecha seleccionada: {new Date(selectedDate).toLocaleDateString('es-MX', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <TimeSlotPicker
                  courtId={courtId}
                  selectedDate={selectedDate}
                  onSlotSelect={handleSlotSelect}
                  selectedStartTime={selectedStartTime}
                  selectedEndTime={selectedEndTime}
                />
              </div>
            </Card>
          )}

          {/* Step 3: Additional Information */}
          {selectedStartTime && selectedEndTime && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
                  Información Adicional
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    label="Notas adicionales (opcional)"
                    type="textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Escribe cualquier información adicional sobre tu reserva..."
                    rows={3}
                  />

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Error</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading || conflicts.length > 0}
                      className="flex-1"
                    >
                      {loading ? 'Procesando...' : 'Crear Reserva'}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          )}
        </div>

        {/* Reservation Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen de Reserva</h2>

              {court && (
                <div className="space-y-3 mb-6">
                  <div>
                    <h3 className="font-medium text-gray-900">{court.name}</h3>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Precio base: {formatPrice(court.hourlyRate)}/hora</p>
                    {court.peakHourRate && (
                      <p>Hora pico: {formatPrice(court.peakHourRate)}/hora</p>
                    )}
                    {court.weekendRate && (
                      <p>Fin de semana: {formatPrice(court.weekendRate)}/hora</p>
                    )}
                  </div>
                </div>
              )}

              {selectedDate && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Fecha:</span>
                    <span className="font-medium">
                      {new Date(selectedDate).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {selectedStartTime && selectedEndTime && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Horario:</span>
                        <span className="font-medium">
                          {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-700">Duración:</span>
                        <span className="font-medium">
                          {duration} minutos
                        </span>
                      </div>

                      <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                        <span>Total:</span>
                        <span className="text-green-600">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        * Precio incluye 16% de IVA
                      </div>
                    </>
                  )}
                </div>
              )}

              {!selectedStartTime && !selectedEndTime && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">Selecciona fecha y horario para ver el precio</p>
                </div>
              )}
            </div>
          </Card>

          {/* Court Policies */}
          {court && (
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-3">Políticas de la Cancha</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Duración mínima: {court.minBookingDuration} minutos</p>
                  <p>• Duración máxima: {court.maxBookingDuration} minutos</p>
                  <p>• Reserva máxima: {court.maxAdvanceBookingDays} días de anticipación</p>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Política de Cancelación</h4>
                  <p className="text-sm text-gray-600">
                    {court.cancellationPolicy}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};