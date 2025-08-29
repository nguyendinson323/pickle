import React from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface PlayerFinderRequest {
  id: number;
  title: string;
  description: string;
  skillLevel: string;
  preferredGender?: string;
  ageRangeMin?: number;
  ageRangeMax?: number;
  playingStyle?: string;
  maxDistance: number;
  availabilityDays: string[];
  availabilityTimeStart?: string;
  availabilityTimeEnd?: string;
  maxPlayers: number;
  currentPlayers: number;
  isActive: boolean;
  expiresAt?: string;
  status: string;
  createdAt: string;
  location: {
    id: number;
    city: string;
    state: string;
    locationName?: string;
  };
  requester: {
    id: number;
    fullName: string;
    nrtpLevel?: string;
    rankingPosition?: number;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      profileImageUrl?: string;
    };
  };
}

interface PlayerFinderCardProps {
  request: PlayerFinderRequest;
  onViewDetails?: (request: PlayerFinderRequest) => void;
  onRespond?: (requestId: number, action: 'interested' | 'not_interested') => void;
  showActions?: boolean;
  className?: string;
  distance?: number;
  matchScore?: number;
  isOwn?: boolean;
}

const PlayerFinderCard: React.FC<PlayerFinderCardProps> = ({
  request,
  onViewDetails,
  onRespond,
  showActions = true,
  className = "",
  distance,
  matchScore,
  isOwn = false
}) => {
  const getSkillLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'pro': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillLevelText = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      case 'pro': return 'Profesional';
      default: return level;
    }
  };

  const getPlayingStyleText = (style?: string) => {
    if (!style) return null;
    switch (style.toLowerCase()) {
      case 'casual': return 'Casual';
      case 'competitive': return 'Competitivo';
      case 'training': return 'Entrenamiento';
      default: return style;
    }
  };

  const formatDays = (days: string[]) => {
    const dayMap: Record<string, string> = {
      monday: 'Lun',
      tuesday: 'Mar',
      wednesday: 'Mié',
      thursday: 'Jue',
      friday: 'Vie',
      saturday: 'Sáb',
      sunday: 'Dom'
    };
    
    return days.map(day => dayMap[day.toLowerCase()] || day).join(', ');
  };

  const formatTime = (time?: string) => {
    if (!time) return null;
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const getTimeLeft = () => {
    if (!request.expiresAt) return null;
    
    const now = new Date();
    const expires = new Date(request.expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expirado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} día${days > 1 ? 's' : ''}`;
    } else {
      return `${hours} hora${hours > 1 ? 's' : ''}`;
    }
  };

  const getLocationDisplay = () => {
    if (request.location.locationName) {
      return `${request.location.locationName}, ${request.location.city}`;
    }
    return `${request.location.city}, ${request.location.state}`;
  };

  const getAgeRangeText = () => {
    if (request.ageRangeMin && request.ageRangeMax) {
      return `${request.ageRangeMin}-${request.ageRangeMax} años`;
    }
    return null;
  };

  const timeLeft = getTimeLeft();
  const playingStyle = getPlayingStyleText(request.playingStyle);
  const ageRange = getAgeRangeText();

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {request.title}
            </h3>
            {matchScore && (
              <Badge variant="success" size="sm">
                {matchScore}% compatibilidad
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            {request.requester.user.profileImageUrl ? (
              <img
                src={request.requester.user.profileImageUrl}
                alt={request.requester.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">
                  {request.requester.user.firstName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {request.requester.user.firstName} {request.requester.user.lastName}
              </p>
              {request.requester.nrtpLevel && (
                <p className="text-xs text-gray-500">
                  Nivel: {request.requester.nrtpLevel}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge 
            variant={request.isActive ? 'success' : 'secondary'} 
            size="sm"
          >
            {request.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
          
          {timeLeft && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              timeLeft === 'Expirado' ? 'bg-red-100 text-red-800' : 
              timeLeft.includes('hora') ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {timeLeft}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {request.description}
      </p>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`px-2 py-1 rounded-full text-xs ${getSkillLevelColor(request.skillLevel)}`}>
            {getSkillLevelText(request.skillLevel)}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {getLocationDisplay()}
          {distance && <span className="ml-1">({distance} km)</span>}
        </div>

        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          {request.currentPlayers}/{request.maxPlayers} jugadores
        </div>

        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h1a1 1 0 011 1v9a1 1 0 01-1 1H7a1 1 0 01-1-1V8a1 1 0 011-1h1zM9 12l2 2 4-4" />
          </svg>
          {formatDays(request.availabilityDays)}
        </div>

        {(request.availabilityTimeStart || request.availabilityTimeEnd) && (
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {request.availabilityTimeStart && formatTime(request.availabilityTimeStart)}
            {request.availabilityTimeStart && request.availabilityTimeEnd && ' - '}
            {request.availabilityTimeEnd && formatTime(request.availabilityTimeEnd)}
          </div>
        )}

        {playingStyle && (
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {playingStyle}
          </div>
        )}

        {request.preferredGender && request.preferredGender !== 'any' && (
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {request.preferredGender === 'male' ? 'Hombres' : 'Mujeres'}
          </div>
        )}

        {ageRange && (
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h1a1 1 0 011 1v9a1 1 0 01-1 1H7a1 1 0 01-1-1V8a1 1 0 011-1h1zM9 12l2 2 4-4" />
            </svg>
            {ageRange}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(request)}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver detalles
            </Button>
          )}

          {!isOwn && onRespond && request.isActive && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onRespond(request.id, 'interested')}
                className="flex items-center gap-2"
                disabled={request.currentPlayers >= request.maxPlayers}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-1a1 1 0 011-1 1 1 0 001-1v-1a1 1 0 011-1H5a2 2 0 012-2z" />
                </svg>
                {request.currentPlayers >= request.maxPlayers ? 'Completo' : 'Me interesa'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRespond(request.id, 'not_interested')}
                className="flex items-center gap-2 text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                No gracias
              </Button>
            </>
          )}

          {isOwn && (
            <div className="ml-auto">
              <Badge variant="secondary" size="sm">
                Tu solicitud
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerFinderCard;