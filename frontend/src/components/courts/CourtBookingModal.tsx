import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import LoadingSpinner from '../common/LoadingSpinner';

interface Court {
  id: string;
  name: string;
  courtNumber: string;
  facility: {
    name: string;
    address: string;
    city: string;
    contactPhone: string;
    operatingHours: {
      [key: string]: {
        open: string;
        close: string;
        closed: boolean;
      };
    };
  };
  pricing: {
    baseHourlyRate: number;
    peakHourMultiplier: number;
    weekendMultiplier: number;
    peakHours: {
      start: string;
      end: string;
    };
  };
}

interface CourtBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: Court | null;
}

interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
}

interface BookingForm {
  bookingDate: string;
  startTime: string;
  endTime: string;
  participants: {
    player1: { name: string; phone: string; email: string; };
    player2?: { name: string; phone: string; email: string; };
    player3?: { name: string; phone: string; email: string; };
    player4?: { name: string; phone: string; email: string; };
  };
  contactInfo: {
    primaryContact: string;
    emergencyContact: string;
    specialRequests?: string;
  };
}

export const CourtBookingModal: React.FC<CourtBookingModalProps> = ({
  isOpen,
  onClose,
  court
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    bookingDate: '',
    startTime: '',
    endTime: '',
    participants: {
      player1: { name: user?.username || '', phone: '', email: user?.email || '' }
    },
    contactInfo: {
      primaryContact: user?.phone || '',
      emergencyContact: '',
      specialRequests: ''
    }
  });

  const steps = [
    { id: 1, name: 'Select Date & Time', description: 'Choose when to play' },
    { id: 2, name: 'Player Details', description: 'Add participant information' },
    { id: 3, name: 'Contact & Payment', description: 'Confirm booking details' },
    { id: 4, name: 'Confirmation', description: 'Booking summary' }
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setSelectedDate('');
      setSelectedStartTime('');
      setSelectedEndTime('');
      setAvailableSlots([]);
      setPricing(null);
    }
  }, [isOpen]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate && court?.id) {
      fetchAvailableSlots();
    }
  }, [selectedDate, court?.id]);

  // Calculate pricing when time selection changes
  useEffect(() => {
    if (selectedStartTime && selectedEndTime && court?.id) {
      calculatePricing();
    }
  }, [selectedStartTime, selectedEndTime, selectedDate, court?.id]);

  const fetchAvailableSlots = async () => {
    if (!court?.id || !selectedDate) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/availability/slots?courtId=${court.id}&date=${selectedDate}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data.data || []);
      } else {
        console.error('Failed to fetch available slots');
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = async () => {
    if (!court?.id || !selectedDate || !selectedStartTime || !selectedEndTime) return;
    
    try {
      const response = await fetch(
        `/api/pricing/calculate?courtId=${court.id}&date=${selectedDate}&startTime=${selectedStartTime}&endTime=${selectedEndTime}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setPricing(data.data);
      }
    } catch (error) {
      console.error('Error calculating pricing:', error);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedStartTime('');
    setSelectedEndTime('');
    setPricing(null);
  };

  const handleTimeSlotSelect = (startTime: string) => {
    setSelectedStartTime(startTime);
    
    // Auto-select next available hour as end time
    const startHour = parseInt(startTime.split(':')[0]);
    const nextHour = (startHour + 1).toString().padStart(2, '0') + ':00';
    setSelectedEndTime(nextHour);
  };

  const handleInputChange = (field: string, value: string, section?: string, player?: string) => {
    if (section && player) {
      setBookingForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof BookingForm],
          [player]: {
            ...(prev[section as keyof BookingForm] as any)[player],
            [field]: value
          }
        }
      }));
    } else if (section) {
      setBookingForm(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof BookingForm] as any),
          [field]: value
        }
      }));
    } else {
      setBookingForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmitBooking = async () => {
    if (!court?.id || !user?.id) return;
    
    setLoading(true);
    try {
      const bookingData = {
        courtId: court.id,
        bookingDate: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        participants: bookingForm.participants,
        contactInfo: bookingForm.contactInfo
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentStep(4);
        // Show success message or redirect
      } else {
        const error = await response.json();
        alert(error.message || 'Error creating booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                minDate={new Date().toISOString().split('T')[0]}
                className="w-full"
              />
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Time Slots for {new Date(selectedDate).toLocaleDateString()}
                </label>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && handleTimeSlotSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 text-sm font-medium rounded-md transition-colors ${
                          selectedStartTime === slot.time
                            ? 'bg-blue-500 text-white'
                            : slot.available
                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <div>{slot.time}</div>
                        {slot.available && (
                          <div className="text-xs mt-1">
                            ${slot.price} MXN
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedStartTime && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <select
                  value={selectedEndTime}
                  onChange={(e) => setSelectedEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableSlots
                    .filter(slot => slot.time > selectedStartTime && slot.available)
                    .slice(0, 3)
                    .map(slot => (
                      <option key={slot.time} value={slot.time}>
                        {slot.time} - ${slot.price} MXN
                      </option>
                    ))}
                </select>
              </div>
            )}

            {pricing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Pricing Summary</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Base Rate:</span>
                    <span>${pricing.basePrice} MXN</span>
                  </div>
                  {pricing.peakHourMultiplier > 1 && (
                    <div className="flex justify-between">
                      <span>Peak Hour Surcharge ({pricing.peakHourMultiplier}x):</span>
                      <span>+${pricing.peakSurcharge} MXN</span>
                    </div>
                  )}
                  {pricing.weekendMultiplier > 1 && (
                    <div className="flex justify-between">
                      <span>Weekend Surcharge ({pricing.weekendMultiplier}x):</span>
                      <span>+${pricing.weekendSurcharge} MXN</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${pricing.subtotal} MXN</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (16%):</span>
                    <span>${pricing.tax} MXN</span>
                  </div>
                  <hr className="my-2 border-blue-300" />
                  <div className="flex justify-between font-medium text-blue-900">
                    <span>Total:</span>
                    <span>${pricing.total} MXN</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Booking Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Court:</span>
                  <div className="font-medium">{court?.facility.name} - {court?.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">Date & Time:</span>
                  <div className="font-medium">
                    {new Date(selectedDate).toLocaleDateString()} | {selectedStartTime} - {selectedEndTime}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Player Information</h4>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Player 1 (You)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={bookingForm.participants.player1.name}
                        onChange={(e) => handleInputChange('name', e.target.value, 'participants', 'player1')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={bookingForm.participants.player1.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value, 'participants', 'player1')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        value={bookingForm.participants.player1.email}
                        onChange={(e) => handleInputChange('email', e.target.value, 'participants', 'player1')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {[2, 3, 4].map((playerNum) => (
                  <div key={playerNum} className="border rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Player {playerNum} (Optional)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                        <input
                          type="text"
                          value={bookingForm.participants[`player${playerNum}` as keyof typeof bookingForm.participants]?.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value, 'participants', `player${playerNum}`)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={bookingForm.participants[`player${playerNum}` as keyof typeof bookingForm.participants]?.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value, 'participants', `player${playerNum}`)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={bookingForm.participants[`player${playerNum}` as keyof typeof bookingForm.participants]?.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value, 'participants', `player${playerNum}`)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={bookingForm.contactInfo.primaryContact}
                    onChange={(e) => handleInputChange('primaryContact', e.target.value, 'contactInfo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={bookingForm.contactInfo.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value, 'contactInfo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={bookingForm.contactInfo.specialRequests || ''}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value, 'contactInfo')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requirements or requests..."
                  />
                </div>
              </div>
            </div>

            {pricing && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex justify-between">
                    <span>Court:</span>
                    <span className="font-medium">{court?.facility.name} - {court?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{selectedStartTime} - {selectedEndTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{pricing.durationHours}h</span>
                  </div>
                  <hr className="my-2 border-green-300" />
                  <div className="flex justify-between font-medium text-green-900">
                    <span>Total Amount:</span>
                    <span>${pricing.total} MXN (inc. IVA)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Booking Confirmed!</h3>
              <p className="text-gray-600 mt-2">
                Your court reservation has been successfully created. You will receive a confirmation email shortly.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check your email for booking confirmation</li>
                <li>• Arrive 15 minutes before your scheduled time</li>
                <li>• Bring your confirmation email or booking ID</li>
                <li>• Contact the facility if you need to make changes</li>
              </ul>
            </div>

            <div className="text-xs text-gray-500">
              Facility Contact: {court?.facility.contactPhone}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedDate && selectedStartTime && selectedEndTime && pricing;
      case 2:
        return bookingForm.participants.player1.name && 
               bookingForm.participants.player1.phone && 
               bookingForm.participants.player1.email;
      case 3:
        return bookingForm.contactInfo.primaryContact && 
               bookingForm.contactInfo.emergencyContact;
      default:
        return false;
    }
  };

  if (!court) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Book Court</h2>
            <p className="text-sm text-gray-600">{court.facility.name} - {court.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, stepIdx) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  currentStep >= step.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                {stepIdx < steps.length - 1 && (
                  <div className={`w-16 h-0.5 transition-colors ${
                    currentStep > step.id ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.id} className="text-center" style={{ width: '140px' }}>
                <div className="text-xs font-medium text-gray-900">{step.name}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-96">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="secondary"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
          >
            {currentStep > 1 ? 'Back' : 'Cancel'}
          </Button>

          {currentStep < 4 && (
            <Button
              variant="primary"
              onClick={() => {
                if (currentStep === 3) {
                  handleSubmitBooking();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={!canProceedToNext() || loading}
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : currentStep === 3 ? (
                'Confirm Booking'
              ) : (
                'Next'
              )}
            </Button>
          )}

          {currentStep === 4 && (
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CourtBookingModal;