import React from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface Location {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  locationName?: string;
  radius: number;
  isPublic: boolean;
  isCurrentLocation: boolean;
  lastUpdated: string;
  createdAt: string;
}

interface LocationCardProps {
  location: Location;
  onEdit?: (location: Location) => void;
  onDelete?: (locationId: number) => void;
  onSetAsCurrent?: (locationId: number) => void;
  className?: string;
  showActions?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onEdit,
  onDelete,
  onSetAsCurrent,
  className = "",
  showActions = true
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLocationDisplayName = () => {
    if (location.locationName) {
      return location.locationName;
    }
    return `${location.city}, ${location.state}`;
  };

  const handleMapClick = () => {
    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {getLocationDisplayName()}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {location.address}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          {location.isCurrentLocation && (
            <Badge variant="success" size="sm">
              Current
            </Badge>
          )}
          <Badge variant={location.isPublic ? 'primary' : 'secondary'} size="sm">
            {location.isPublic ? 'Public' : 'Private'}
          </Badge>
        </div>
      </div>

      {/* Location Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <button
            onClick={handleMapClick}
            className="text-blue-600 hover:text-blue-800 hover:underline"
            title="View on Google Maps"
          >
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </button>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
          Search radius: {location.radius} km
        </div>

        {location.zipCode && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            ZIP: {location.zipCode}
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Updated: {formatDate(location.lastUpdated)}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          {!location.isCurrentLocation && onSetAsCurrent && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetAsCurrent(location.id)}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark as current
            </Button>
          )}

          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(location)}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleMapClick}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
            </svg>
            View on Map
          </Button>

          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(location.id)}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 ml-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationCard;