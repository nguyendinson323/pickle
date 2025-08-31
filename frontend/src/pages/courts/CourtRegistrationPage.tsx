import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { createCourt, clearError } from '../../store/courtSlice';
import Button from '../../components/ui/Button';

export const CourtRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { loading, error } = useAppSelector(state => state.courts);

  useEffect(() => {
    // Check if user can register courts
    if (!user) {
      navigate('/login', { state: { returnUrl: '/courts/register' } });
      return;
    }

    if (!['club', 'partner', 'federation'].includes(user.role)) {
      navigate('/courts', { replace: true });
      return;
    }

    // Clear any existing errors
    dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = async (courtData: any) => {
    try {
      const result = await dispatch(createCourt(courtData)).unwrap();
      
      // Navigate to the newly created court
      navigate(`/courts/${result.id}`, {
        state: { 
          message: 'Court registered successfully. It will be reviewed by our team before being published.' 
        }
      });
    } catch (err) {
      // Error is handled by Redux and displayed in the form
    }
  };

  const handleCancel = () => {
    navigate('/courts');
  };

  if (!user || !['club', 'partner', 'federation'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Restricted Access</h3>
          <p className="text-gray-600 mb-4">
            Only clubs, partners and the federation can register courts.
          </p>
          <Button onClick={() => navigate('/courts')}>
            Back to Courts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/courts')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Courts
                </button>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 font-medium">Register Court</span>
              </li>
            </ol>
          </nav>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Register New Court</h1>
              <p className="text-gray-600 mt-1">
                Complete the information to register your court in the pickleball network
              </p>
            </div>

            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Information Card */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">Important Information</h3>
              <div className="mt-2 text-sm text-blue-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>Your court will be reviewed by our team before being published</li>
                  <li>Make sure to provide accurate and complete information</li>
                  <li>Images must be clear and representative of the court</li>
                  <li>Prices must include all applicable taxes</li>
                  <li>You will be able to edit the information after approval</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const courtData = {
                name: formData.get('name'),
                description: formData.get('description'),
                surfaceType: formData.get('surfaceType'),
                address: formData.get('address'),
                hourlyRate: Number(formData.get('hourlyRate')),
                maxAdvanceBookingDays: 30,
                minBookingDuration: 60,
                maxBookingDuration: 180,
                cancellationPolicy: 'Standard 24-hour cancellation policy',
                amenities: [],
                images: []
              };
              handleSubmit(courtData);
            }}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Court Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="surfaceType" className="block text-sm font-medium text-gray-700">
                    Surface Type *
                  </label>
                  <select
                    name="surfaceType"
                    id="surfaceType"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="concrete">Concrete</option>
                    <option value="asphalt">Asphalt</option>
                    <option value="acrylic">Acrylic</option>
                    <option value="composite">Composite</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                    Hourly Rate (MXN) *
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    id="hourlyRate"
                    min="0"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Court'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Court Requirements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Official pickleball dimensions</li>
                <li>• Suitable surface (concrete, asphalt, etc.)</li>
                <li>• Lighting for night games (optional)</li>
                <li>• Safe access for players</li>
                <li>• Civil liability insurance</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Required Documentation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Registration with the Mexican federation</li>
                <li>• Proof of address for the court</li>
                <li>• Official identification of the person in charge</li>
                <li>• Current insurance policy</li>
                <li>• Required municipal permits</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Do you have questions about the registration process?
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Our team is here to help you
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('mailto:soporte@federacionpickleball.mx', '_blank')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact by Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://wa.me/52XXXXXXXXXX', '_blank')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};