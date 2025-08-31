import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Court } from '../../store/courtSlice';

interface CourtCardProps {
  court: Court;
  showActions?: boolean;
  onEdit?: (court: Court) => void;
  onDelete?: (courtId: number) => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({ 
  court, 
  showActions = false, 
  onEdit, 
  onDelete 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getSurfaceTypeLabel = (type: string) => {
    const labels = {
      'concrete': 'Concrete',
      'asphalt': 'Asphalt',
      'acrylic': 'Acrylic',
      'composite': 'Composite'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getAmenityLabel = (amenity: string) => {
    const labels = {
      'lighting': '💡 Lighting',
      'seating': '🪑 Seating',
      'parking': '🚗 Parking',
      'restrooms': '🚻 Restrooms',
      'water_fountain': '⛲ Water Fountain',
      'equipment_rental': '🏓 Equipment Rental',
      'cafeteria': '☕ Cafeteria',
      'pro_shop': '🏪 Pro Shop',
      'coaching_area': '👨‍🏫 Coaching Area',
      'professional_lighting': '💡 Professional Lighting',
      'vip_seating': '💺 VIP Seating',
      'valet_parking': '🅿️ Valet Parking',
      'premium_restrooms': '🚻 Premium Restrooms'
    };
    return labels[amenity as keyof typeof labels] || amenity;
  };

  const mainImage = court.images && court.images.length > 0 
    ? court.images[0] 
    : '/placeholder-court.jpg';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        <img
          src={mainImage}
          alt={court.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-court.jpg';
          }}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {court.averageRating && (
            <Badge variant="success" className="bg-green-600 text-white">
              ⭐ {court.averageRating.toFixed(1)}
            </Badge>
          )}
          {!court.isActive && (
            <Badge variant="error">Inactive</Badge>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {court.name}
          </h3>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {formatPrice(court.hourlyRate)}/h
            </div>
            {court.peakHourRate && (
              <div className="text-sm text-gray-500">
                Peak: {formatPrice(court.peakHourRate)}/h
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {court.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-500">📍</span>
          <span className="text-sm text-gray-600 line-clamp-1">
            {court.address}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="info" className="text-xs">
            {getSurfaceTypeLabel(court.surfaceType)}
          </Badge>
          {court.state && (
            <Badge variant="info" className="text-xs">
              {court.state.name}
            </Badge>
          )}
        </div>

        {court.amenities && court.amenities.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {court.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {getAmenityLabel(amenity)}
                </span>
              ))}
              {court.amenities.length > 3 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  +{court.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {court.totalReviews && court.totalReviews > 0 && (
          <div className="text-sm text-gray-500 mb-3">
            {court.totalReviews} review{court.totalReviews !== 1 ? 's' : ''}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Link to={`/courts/${court.id}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          
          {showActions && (
            <>
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(court)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="error" 
                  size="sm"
                  onClick={() => onDelete(court.id)}
                >
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};