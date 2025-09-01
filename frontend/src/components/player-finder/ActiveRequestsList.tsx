import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  XMarkIcon,
  EyeIcon,
  CalendarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface PlayerFinderRequest {
  id: number;
  requesterId: number;
  locationId: number;
  nrtpLevelMin?: string;
  nrtpLevelMax?: string;
  preferredGender?: 'male' | 'female' | 'any';
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  searchRadius: number;
  availableTimeSlots: any[];
  message?: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  location?: {
    id: number;
    city: string;
    state: string;
    locationName?: string;
  };
}

interface ActiveRequestsListProps {
  requests: PlayerFinderRequest[];
  onRefresh: () => void;
}

const ActiveRequestsList: React.FC<ActiveRequestsListProps> = ({ requests, onRefresh }) => {
  const [deactivatingRequest, setDeactivatingRequest] = useState<number | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);

  const handleDeactivateRequest = async (requestId: number) => {
    if (!window.confirm('Are you sure you want to deactivate this request? You won\'t receive any more matches for it.')) {
      return;
    }

    setDeactivatingRequest(requestId);
    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the API to cancel the request
      await apiService.delete(`/api/player-finder/requests/${requestId}`);
      
      onRefresh();
    } catch (error) {
      console.error('Failed to deactivate request:', error);
    } finally {
      setDeactivatingRequest(null);
    }
  };

  const formatTimeSlots = (timeSlots: any[]) => {
    if (!timeSlots || timeSlots.length === 0) return 'No time slots specified';
    
    return timeSlots.map(slot => {
      const flexible = slot.flexible ? ' (Flexible)' : '';
      return `${slot.day} ${slot.startTime}-${slot.endTime}${flexible}`;
    }).join(', ');
  };

  const formatCriteria = (request: PlayerFinderRequest) => {
    const criteria: string[] = [];
    
    if (request.nrtpLevelMin || request.nrtpLevelMax) {
      const min = request.nrtpLevelMin || 'Any';
      const max = request.nrtpLevelMax || 'Any';
      criteria.push(`NRTP: ${min} - ${max}`);
    }
    
    if (request.preferredGender && request.preferredGender !== 'any') {
      criteria.push(`Gender: ${request.preferredGender}`);
    }
    
    if (request.preferredAgeMin || request.preferredAgeMax) {
      const min = request.preferredAgeMin || 'Any';
      const max = request.preferredAgeMax || 'Any';
      criteria.push(`Age: ${min} - ${max}`);
    }
    
    return criteria.length > 0 ? criteria.join(' " ') : 'No specific criteria';
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} left`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} left`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} left`;
    }
  };

  const isExpiringSoon = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours <= 24 && diffHours > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">My Active Requests</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your current player finder requests
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Request Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPinIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.location?.locationName || 
                           `${request.location?.city}, ${request.location?.state}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.searchRadius}km radius
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isExpiringSoon(request.expiresAt) 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {getTimeUntilExpiry(request.expiresAt)}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedRequest(
                            expandedRequest === request.id ? null : request.id
                          )}
                          className="p-1.5"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Request Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Created:</span>{' '}
                        <span className="text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Expires:</span>{' '}
                        <span className="text-gray-600">
                          {new Date(request.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Quick Criteria Preview */}
                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">Criteria:</span> {formatCriteria(request)}
                    </div>

                    {/* Message Preview */}
                    {request.message && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          "{request.message}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRequest === request.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Player Preferences */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Player Preferences
                        </h4>
                        <div className="space-y-2 text-sm">
                          {request.nrtpLevelMin || request.nrtpLevelMax ? (
                            <div className="flex justify-between">
                              <span className="text-gray-600">NRTP Level:</span>
                              <span className="text-gray-900">
                                {request.nrtpLevelMin || 'Any'} - {request.nrtpLevelMax || 'Any'}
                              </span>
                            </div>
                          ) : (
                            <div className="flex justify-between">
                              <span className="text-gray-600">NRTP Level:</span>
                              <span className="text-gray-900">Any</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Gender:</span>
                            <span className="text-gray-900 capitalize">
                              {request.preferredGender || 'Any'}
                            </span>
                          </div>
                          
                          {request.preferredAgeMin || request.preferredAgeMax ? (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Age Range:</span>
                              <span className="text-gray-900">
                                {request.preferredAgeMin || 'Any'} - {request.preferredAgeMax || 'Any'}
                              </span>
                            </div>
                          ) : (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Age Range:</span>
                              <span className="text-gray-900">Any</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Available Time Slots */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Available Time Slots
                        </h4>
                        <div className="space-y-2">
                          {request.availableTimeSlots && request.availableTimeSlots.length > 0 ? (
                            request.availableTimeSlots.map((slot, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{slot.day}:</span>
                                <span className="text-gray-900">
                                  {slot.startTime} - {slot.endTime}
                                  {slot.flexible && (
                                    <span className="text-xs text-blue-600 ml-1">(Flexible)</span>
                                  )}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No specific time slots</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Full Message */}
                    {request.message && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Message</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">{request.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeactivateRequest(request.id)}
                    disabled={deactivatingRequest === request.id}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    {deactivatingRequest === request.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <XMarkIcon className="h-4 w-4" />
                    )}
                    <span>Deactivate</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active requests</h3>
            <p className="text-gray-500">
              You don't have any active player finder requests. Create one to start finding players!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActiveRequestsList;