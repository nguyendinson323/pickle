import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReservationCalendar } from './ReservationCalendar';
import { TimeSlotPicker } from './TimeSlotPicker';
import Button from '../ui/Button';
import Card from '../ui/Card';

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
  const navigate = useNavigate();
  
  // Mock reservation state since slice doesn't exist
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conflicts: any[] = [];

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
    
    // Mock conflict detection
    // In a real implementation, this would check for conflicts
    console.log('Checking conflicts for:', { courtId, date: selectedDate, startTime, endTime });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStartTime || !selectedEndTime) {
      alert('Please select a time slot');
      return;
    }

    if (conflicts.length > 0) {
      alert('Cannot process reservation due to detected conflicts');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Mock reservation creation
      const mockReservation = {
        id: Math.floor(Math.random() * 1000),
        courtId,
        reservationDate: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        notes: notes.trim() || undefined,
        totalPrice
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Mock reservation created:', mockReservation);
      
      // Navigate to confirmation
      navigate(`/reservations/${mockReservation.id}`, { 
        state: { 
          message: 'Reservation created successfully. Proceed with payment to confirm it.',
          reservation: mockReservation
        } 
      });
    } catch (err) {
      setError('Error creating reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const duration = calculateDuration();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reserve Court
        </h1>
        {court && (
          <p className="text-gray-600">
            {court.name} - {formatPrice(court.hourlyRate)}/hour
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
                Select Date
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
                  Select Time
                </h2>
                
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    Selected date: {new Date(selectedDate).toLocaleDateString('en-US', {
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
                  Additional Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write any additional information about your reservation..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

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
                      {loading ? 'Processing...' : 'Create Reservation'}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
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
              <h2 className="text-xl font-semibold mb-4">Reservation Summary</h2>

              {court && (
                <div className="space-y-3 mb-6">
                  <div>
                    <h3 className="font-medium text-gray-900">{court.name}</h3>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Base price: {formatPrice(court.hourlyRate)}/hour</p>
                    {court.peakHourRate && (
                      <p>Peak hour: {formatPrice(court.peakHourRate)}/hour</p>
                    )}
                    {court.weekendRate && (
                      <p>Weekend: {formatPrice(court.weekendRate)}/hour</p>
                    )}
                  </div>
                </div>
              )}

              {selectedDate && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Date:</span>
                    <span className="font-medium">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {selectedStartTime && selectedEndTime && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Time:</span>
                        <span className="font-medium">
                          {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-700">Duration:</span>
                        <span className="font-medium">
                          {duration} minutes
                        </span>
                      </div>

                      <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                        <span>Total:</span>
                        <span className="text-green-600">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        * Price includes 16% VAT
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
                  <p className="text-sm">Select date and time to see the price</p>
                </div>
              )}
            </div>
          </Card>

          {/* Court Policies */}
          {court && (
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-3">Court Policies</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Minimum duration: {court.minBookingDuration} minutes</p>
                  <p>• Maximum duration: {court.maxBookingDuration} minutes</p>
                  <p>• Maximum advance booking: {court.maxAdvanceBookingDays} days</p>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Cancellation Policy</h4>
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