import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAvailableSlots, TimeSlot } from '../../store/reservationSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface TimeSlotPickerProps {
  courtId: number;
  selectedDate: string;
  onSlotSelect: (startTime: string, endTime: string, price: number) => void;
  selectedStartTime?: string;
  selectedEndTime?: string;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  courtId,
  selectedDate,
  onSlotSelect,
  selectedStartTime: _selectedStartTime,
  selectedEndTime: _selectedEndTime
}) => {
  const dispatch = useAppDispatch();
  const { availableSlots, availabilityLoading, availabilityError, conflicts } = useAppSelector(state => state.reservations);

  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (courtId && selectedDate) {
      dispatch(fetchAvailableSlots({ courtId, date: selectedDate }));
    }
  }, [dispatch, courtId, selectedDate]);

  useEffect(() => {
    // Reset selection when date changes
    setSelectedSlots([]);
    setIsSelecting(false);
  }, [selectedDate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.isAvailable || slot.isBlocked) return;

    if (isSelecting) {
      // Check if this slot can be part of a continuous selection
      const lastSelectedSlot = selectedSlots[selectedSlots.length - 1];
      if (lastSelectedSlot && slot.startTime === lastSelectedSlot.endTime) {
        const newSelection = [...selectedSlots, slot];
        setSelectedSlots(newSelection);
        
        // Calculate total duration and price
        const startTime = newSelection[0].startTime;
        const endTime = slot.endTime;
        const totalPrice = newSelection.reduce((sum, s) => sum + s.price, 0);
        
        onSlotSelect(startTime, endTime, totalPrice);
      } else {
        // Start a new selection
        setSelectedSlots([slot]);
        setIsSelecting(true);
        onSlotSelect(slot.startTime, slot.endTime, slot.price);
      }
    } else {
      // Start selecting
      setSelectedSlots([slot]);
      setIsSelecting(true);
      onSlotSelect(slot.startTime, slot.endTime, slot.price);
    }
  };

  const handleFinishSelection = () => {
    setIsSelecting(false);
  };

  const handleClearSelection = () => {
    setSelectedSlots([]);
    setIsSelecting(false);
  };

  const isSlotSelected = (slot: TimeSlot) => {
    return selectedSlots.some(s => s.startTime === slot.startTime);
  };

  const canExtendSelection = (slot: TimeSlot) => {
    if (!isSelecting || selectedSlots.length === 0) return false;
    const lastSlot = selectedSlots[selectedSlots.length - 1];
    return slot.startTime === lastSlot.endTime && slot.isAvailable && !slot.isBlocked;
  };

  if (availabilityLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (availabilityError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">{availabilityError}</p>
        <Button onClick={() => dispatch(fetchAvailableSlots({ courtId, date: selectedDate }))}>
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  if (!availableSlots.length) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay horarios disponibles
        </h3>
        <p className="text-gray-600">
          Esta cancha no tiene horarios disponibles para la fecha seleccionada.
        </p>
      </div>
    );
  }

  // Group slots by hour for better display
  const groupedSlots = availableSlots.reduce((groups, slot) => {
    const hour = slot.startTime.split(':')[0];
    if (!groups[hour]) groups[hour] = [];
    groups[hour].push(slot);
    return groups;
  }, {} as { [hour: string]: TimeSlot[] });

  return (
    <div className="space-y-4">
      {/* Selection Status */}
      {selectedSlots.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-blue-900">Horario Seleccionado</h3>
              <p className="text-blue-700">
                {formatTime(selectedSlots[0].startTime)} - {formatTime(selectedSlots[selectedSlots.length - 1].endTime)}
              </p>
              <p className="text-blue-700">
                Precio total: {formatPrice(selectedSlots.reduce((sum, s) => sum + s.price, 0))}
              </p>
              {isSelecting && (
                <p className="text-sm text-blue-600 mt-1">
                  Haz clic en el siguiente horario para extender tu reserva
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {isSelecting && (
                <Button size="sm" variant="primary" onClick={handleFinishSelection}>
                  Confirmar
                </Button>
              )}
              <Button size="sm" variant="secondary" onClick={handleClearSelection}>
                Limpiar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Conflicts Warning */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-900 mb-2">Conflictos Detectados</h3>
          <ul className="space-y-1">
            {conflicts.map((conflict, index) => (
              <li key={index} className="text-red-700 text-sm">
                • {conflict.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
          <span>Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
          <span>Bloqueado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
          <span>Seleccionado</span>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(groupedSlots)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([hour, slots]) => (
            <div key={hour} className="space-y-2">
              <h3 className="font-medium text-gray-900 text-center">
                {formatTime(`${hour}:00`)}
              </h3>
              
              <div className="space-y-1">
                {slots.map((slot) => {
                  const isSelected = isSlotSelected(slot);
                  const canExtend = canExtendSelection(slot);
                  const isDisabled = !slot.isAvailable || slot.isBlocked;
                  
                  let bgColor = 'bg-green-100 hover:bg-green-200 border-green-300';
                  let textColor = 'text-green-900';
                  
                  if (isSelected) {
                    bgColor = 'bg-blue-200 border-blue-300';
                    textColor = 'text-blue-900';
                  } else if (canExtend) {
                    bgColor = 'bg-blue-100 hover:bg-blue-200 border-blue-200';
                    textColor = 'text-blue-800';
                  } else if (slot.isBlocked) {
                    bgColor = 'bg-gray-200 border-gray-300 cursor-not-allowed';
                    textColor = 'text-gray-600';
                  } else if (!slot.isAvailable) {
                    bgColor = 'bg-red-200 border-red-300 cursor-not-allowed';
                    textColor = 'text-red-900';
                  }
                  
                  return (
                    <button
                      key={`${slot.startTime}-${slot.endTime}`}
                      onClick={() => handleSlotClick(slot)}
                      disabled={isDisabled && !canExtend}
                      className={`w-full p-2 text-xs rounded border transition-colors duration-200 ${bgColor} ${textColor} ${
                        isDisabled && !canExtend ? '' : 'cursor-pointer'
                      }`}
                    >
                      <div className="font-medium">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-semibold">
                          {formatPrice(slot.price)}
                        </span>
                        
                        {slot.isBlocked && slot.blockReason && (
                          <Badge variant="error" className="text-xs">
                            {slot.blockReason}
                          </Badge>
                        )}
                        
                        {slot.reservationId && (
                          <Badge variant="error" className="text-xs">
                            Reservado
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <p className="font-medium mb-1">Instrucciones:</p>
        <ul className="space-y-1">
          <li>• Haz clic en un horario disponible para seleccionarlo</li>
          <li>• Puedes seleccionar horarios consecutivos para reservas más largas</li>
          <li>• Los precios mostrados incluyen 16% de IVA</li>
        </ul>
      </div>
    </div>
  );
};