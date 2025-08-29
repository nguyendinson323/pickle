import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCourtById, fetchCourtStats, clearCurrentCourt } from '../../store/slices/courtSlice';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const CourtDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentCourt, courtStats, loading, error } = useAppSelector(state => state.courts);
  const { user } = useAppSelector(state => state.auth);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const courtId = parseInt(id);
      dispatch(fetchCourtById(courtId));
      dispatch(fetchCourtStats(courtId));
    }

    return () => {
      dispatch(clearCurrentCourt());
    };
  }, [dispatch, id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getSurfaceTypeLabel = (type: string) => {
    const labels = {
      'concrete': 'Concreto',
      'asphalt': 'Asfalto',
      'acrylic': 'Acrílico',
      'composite': 'Compuesto'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getAmenityLabel = (amenity: string) => {
    const labels = {
      'lighting': '💡 Iluminación',
      'seating': '🪑 Asientos',
      'parking': '🚗 Estacionamiento',
      'restrooms': '🚻 Sanitarios',
      'water_fountain': '⛲ Bebedero',
      'equipment_rental': '🏓 Renta de Equipo',
      'cafeteria': '☕ Cafetería',
      'pro_shop': '🏪 Tienda Pro',
      'coaching_area': '👨‍🏫 Área de Entrenamiento',
      'professional_lighting': '💡 Iluminación Profesional',
      'vip_seating': '💺 Asientos VIP',
      'valet_parking': '🅿️ Valet Parking',
      'premium_restrooms': '🚻 Sanitarios Premium'
    };
    return labels[amenity as keyof typeof labels] || amenity;
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayIndex];
  };

  const handlePrevImage = () => {
    if (currentCourt?.images) {
      setCurrentImageIndex(prev => 
        prev === 0 ? currentCourt.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (currentCourt?.images) {
      setCurrentImageIndex(prev => 
        prev === currentCourt.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const canManageCourt = user && currentCourt && (
    (user.role === 'club' && currentCourt.ownerType === 'club' && user.id === currentCourt.ownerId) ||
    (user.role === 'partner' && currentCourt.ownerType === 'partner' && user.id === currentCourt.ownerId) ||
    user.role === 'federation'
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !currentCourt) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {error || 'Cancha no encontrada'}
        </h3>
        <Link to="/courts">
          <Button>Volver a las canchas</Button>
        </Link>
      </div>
    );
  }

  const images = currentCourt.images && currentCourt.images.length > 0 
    ? currentCourt.images 
    : ['/placeholder-court.jpg'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentCourt.name}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold">
                {currentCourt.averageRating?.toFixed(1) || 'Sin calificación'}
              </span>
              {currentCourt.totalReviews && (
                <span className="text-gray-500">
                  ({currentCourt.totalReviews} reseña{currentCourt.totalReviews !== 1 ? 's' : ''})
                </span>
              )}
            </div>
            <Badge variant="outline">
              {getSurfaceTypeLabel(currentCourt.surfaceType)}
            </Badge>
            {!currentCourt.isActive && (
              <Badge variant="danger">Inactiva</Badge>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          {user && (
            <Link to={`/courts/${currentCourt.id}/book`}>
              <Button variant="primary">
                Reservar Ahora
              </Button>
            </Link>
          )}
          
          {canManageCourt && (
            <Button variant="outline">
              Administrar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="overflow-hidden">
            <div className="relative h-96">
              <img
                src={images[currentImageIndex]}
                alt={`${currentCourt.name} - Imagen ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-court.jpg';
                }}
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Description */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">
              {currentCourt.description}
            </p>
          </Card>

          {/* Amenities */}
          {currentCourt.amenities && currentCourt.amenities.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Servicios Disponibles</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentCourt.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <span className="text-sm">{getAmenityLabel(amenity)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Operating Hours */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Horarios de Operación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentCourt.operatingHours).map(([dayIndex, hours]) => (
                <div key={dayIndex} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    {getDayName(parseInt(dayIndex))}
                  </span>
                  <span className="text-gray-600">
                    {hours.isOpen 
                      ? `${hours.startTime} - ${hours.endTime}`
                      : 'Cerrado'
                    }
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Policies */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Políticas de Reserva</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Reserva máxima con anticipación:</span>
                <span className="font-medium">{currentCourt.maxAdvanceBookingDays} días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Duración mínima:</span>
                <span className="font-medium">{currentCourt.minBookingDuration} minutos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Duración máxima:</span>
                <span className="font-medium">{currentCourt.maxBookingDuration} minutos</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-gray-900 mb-2">Política de Cancelación</h3>
              <p className="text-gray-700 text-sm">
                {currentCourt.cancellationPolicy}
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Precios</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Precio regular:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatPrice(currentCourt.hourlyRate)}/h
                </span>
              </div>
              
              {currentCourt.peakHourRate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Hora pico:</span>
                  <span className="font-semibold text-orange-600">
                    {formatPrice(currentCourt.peakHourRate)}/h
                  </span>
                </div>
              )}
              
              {currentCourt.weekendRate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Fin de semana:</span>
                  <span className="font-semibold text-blue-600">
                    {formatPrice(currentCourt.weekendRate)}/h
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                * Los precios incluyen 16% de IVA
              </p>
              {currentCourt.peakHourRate && (
                <p className="text-sm text-gray-600 mt-1">
                  * Hora pico: 6-8 AM y 6-10 PM
                </p>
              )}
            </div>
          </Card>

          {/* Location */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">{currentCourt.address}</span>
              </div>
              
              {currentCourt.state && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <span className="text-gray-700">{currentCourt.state.name}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Statistics */}
          {courtStats && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Calificación promedio:</span>
                  <span className="font-semibold">
                    {courtStats.averageRating.toFixed(1)} ⭐
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Total de reseñas:</span>
                  <span className="font-semibold">{courtStats.totalReviews}</span>
                </div>

                {courtStats.amenityRatings && (
                  <div className="pt-3 border-t">
                    <h3 className="font-medium text-gray-900 mb-2">Calificaciones por Aspecto</h3>
                    <div className="space-y-2">
                      {Object.entries(courtStats.amenityRatings).map(([aspect, rating]) => (
                        <div key={aspect} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{aspect}:</span>
                          <span className="font-medium">{(rating as number).toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Owner Information */}
          {(currentCourt.clubOwner || currentCourt.partnerOwner) && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Información del Propietario</h2>
              {currentCourt.clubOwner && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">
                    {currentCourt.clubOwner.clubName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {currentCourt.clubOwner.contactEmail}
                  </p>
                </div>
              )}
              {currentCourt.partnerOwner && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">
                    {currentCourt.partnerOwner.businessName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {currentCourt.partnerOwner.contactEmail}
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};