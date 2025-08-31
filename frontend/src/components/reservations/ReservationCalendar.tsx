import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCourtAvailability, setSelectedDate } from '../../store/reservationSlice';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface ReservationCalendarProps {
  courtId: number;
  onDateSelect: (date: string) => void;
  selectedDate: string;
  minDate?: string;
  maxAdvanceDays?: number;
}

export const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  courtId,
  onDateSelect,
  selectedDate,
  minDate,
  maxAdvanceDays = 30
}) => {
  const dispatch = useAppDispatch();
  const { availability, availabilityLoading } = useAppSelector(state => state.reservations);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week'>('month');

  const today = new Date();
  const minSelectableDate = minDate ? new Date(minDate) : today;
  const maxSelectableDate = new Date(today.getTime() + maxAdvanceDays * 24 * 60 * 60 * 1000);

  useEffect(() => {
    // Fetch availability for current month view
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    dispatch(fetchCourtAvailability({
      courtId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
  }, [dispatch, courtId, currentMonth]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentMonth);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const isDateSelectable = (date: Date) => {
    return date >= minSelectableDate && date <= maxSelectableDate;
  };

  const isDateSelected = (date: Date) => {
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const getDateAvailability = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const slots = availability[dateString];
    
    if (!slots) return null;
    
    const availableSlots = slots.filter(slot => slot.isAvailable && !slot.isBlocked);
    const totalSlots = slots.length;
    
    return {
      available: availableSlots.length,
      total: totalSlots,
      hasAvailability: availableSlots.length > 0
    };
  };

  const handleDateClick = (date: Date) => {
    if (!isDateSelectable(date)) return;
    
    const dateString = date.toISOString().split('T')[0];
    dispatch(setSelectedDate(dateString));
    onDateSelect(dateString);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentMonth);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentMonth(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentMonth);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentMonth(newDate);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    handleDateClick(new Date());
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentMonth);

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2 h-20"></div>;
          }

          const isSelectable = isDateSelectable(date);
          const isSelected = isDateSelected(date);
          const isToday = date.toDateString() === today.toDateString();
          const availability = getDateAvailability(date);

          let cellClass = 'p-2 h-20 border rounded cursor-pointer transition-colors duration-200 ';
          
          if (!isSelectable) {
            cellClass += 'bg-gray-100 text-gray-400 cursor-not-allowed ';
          } else if (isSelected) {
            cellClass += 'bg-blue-200 border-blue-300 text-blue-900 ';
          } else if (isToday) {
            cellClass += 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200 ';
          } else {
            cellClass += 'bg-white hover:bg-gray-50 ';
          }

          return (
            <div
              key={index}
              className={cellClass}
              onClick={() => handleDateClick(date)}
            >
              <div className="flex flex-col h-full">
                <div className="font-medium text-sm">{date.getDate()}</div>
                
                {availability && isSelectable && (
                  <div className="flex-1 flex flex-col justify-end">
                    {availability.hasAvailability ? (
                      <Badge variant="primary" className="text-xs">
                        {availability.available} available
                      </Badge>
                    ) : (
                      <Badge variant="error" className="text-xs">
                        No availability
                      </Badge>
                    )}
                  </div>
                )}

                {availabilityLoading && isSelectable && (
                  <div className="flex-1 flex justify-center items-end">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays();

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            const isSelectable = isDateSelectable(date);
            const isSelected = isDateSelected(date);
            const isToday = date.toDateString() === today.toDateString();
            const availability = getDateAvailability(date);

            let cellClass = 'p-4 border rounded cursor-pointer transition-colors duration-200 text-center ';
            
            if (!isSelectable) {
              cellClass += 'bg-gray-100 text-gray-400 cursor-not-allowed ';
            } else if (isSelected) {
              cellClass += 'bg-blue-200 border-blue-300 text-blue-900 ';
            } else if (isToday) {
              cellClass += 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200 ';
            } else {
              cellClass += 'bg-white hover:bg-gray-50 ';
            }

            return (
              <div
                key={index}
                className={cellClass}
                onClick={() => handleDateClick(date)}
              >
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-600">{dayNames[date.getDay()]}</div>
                    <div className="font-semibold">{date.getDate()}</div>
                  </div>
                  
                  {availability && isSelectable && (
                    <div>
                      {availability.hasAvailability ? (
                        <Badge variant="primary" className="text-xs">
                          {availability.available} slots
                        </Badge>
                      ) : (
                        <Badge variant="error" className="text-xs">
                          Full
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewType('month')}
              className={`px-3 py-1 text-sm ${
                viewType === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`px-3 py-1 text-sm ${
                viewType === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={viewType === 'month' ? goToPreviousMonth : goToPreviousWeek}
          >
            ←
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={viewType === 'month' ? goToNextMonth : goToNextWeek}
          >
            →
          </Button>
        </div>
      </div>

      {/* Calendar Body */}
      {viewType === 'month' ? renderMonthView() : renderWeekView()}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
          <span>Not available</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
        <p className="font-medium mb-1">Information:</p>
        <ul className="space-y-1">
          <li>• Select a date to view available time slots</li>
          <li>• You can only reserve up to {maxAdvanceDays} days in advance</li>
          <li>• Numbers indicate the amount of available time slots</li>
        </ul>
      </div>
    </div>
  );
};