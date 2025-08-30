import React from 'react';
import { Tournament } from '../../types/tournament';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface TournamentCardProps {
  tournament: Tournament;
  onView?: (tournament: Tournament) => void;
  onRegister?: (tournament: Tournament) => void;
  showActions?: boolean;
  isRegistered?: boolean;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onView,
  onRegister,
  showActions = true,
  isRegistered = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'published':
      case 'registration_open':
        return 'success';
      case 'registration_closed':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'National':
        return 'bg-red-100 text-red-800';
      case 'State':
        return 'bg-blue-100 text-blue-800';
      case 'Municipal':
        return 'bg-yellow-100 text-yellow-800';
      case 'Local':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isRegistrationOpen = () => {
    const now = new Date();
    const regStart = new Date(tournament.registrationStart);
    const regEnd = new Date(tournament.registrationEnd);
    return tournament.status === 'registration_open' && now >= regStart && now <= regEnd;
  };

  const canRegister = () => {
    return isRegistrationOpen() && 
           !isRegistered && 
           tournament.currentParticipants < tournament.maxParticipants;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Tournament Image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {tournament.images && tournament.images.length > 0 ? (
          <img
            src={tournament.images[0]}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-6xl">🏆</div>
          </div>
        )}
        
        {/* Status and Level Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Badge variant={getStatusVariant(tournament.status)} size="sm" className="text-xs">
            {tournament.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(tournament.level)}`}>
            {tournament.level}
          </span>
        </div>

        {/* Prize Pool */}
        {tournament.prizePool > 0 && (
          <div className="absolute top-4 left-4">
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
              💰 {formatCurrency(tournament.prizePool)}
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Tournament Name and Type */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {tournament.name}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            {tournament.tournamentType} • {tournament.organizerType}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {tournament.description}
        </p>

        {/* Key Information */}
        <div className="space-y-3 mb-6">
          {/* Date */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📅</span>
            <span>
              {formatDate(tournament.startDate)}
              {tournament.startDate !== tournament.endDate && 
                ` - ${formatDate(tournament.endDate)}`
              }
            </span>
          </div>

          {/* Venue */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📍</span>
            <span>{tournament.venueName}</span>
          </div>

          {/* Entry Fee */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">💳</span>
            <span>{formatCurrency(tournament.entryFee)}</span>
          </div>

          {/* Participants */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">👥</span>
            <span>
              {tournament.currentParticipants} / {tournament.maxParticipants} participantes
            </span>
          </div>

          {/* Registration Period */}
          {tournament.status === 'registration_open' && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">⏰</span>
              <span>
                Registro hasta: {formatDate(tournament.registrationEnd)}
              </span>
            </div>
          )}

          {/* Categories */}
          {tournament.categories && tournament.categories.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">🏅</span>
              <span>{tournament.categories.length} categorías</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {tournament.maxParticipants > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Registros</span>
              <span>
                {Math.round((tournament.currentParticipants / tournament.maxParticipants) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Registration Status */}
        {isRegistered && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800 text-sm">
              <span className="mr-2">✅</span>
              <span className="font-medium">Ya estás registrado</span>
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(tournament)}
              className="flex-1"
            >
              Ver Detalles
            </Button>
            
            {canRegister() && onRegister && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onRegister(tournament)}
                className="flex-1"
              >
                Registrarse
              </Button>
            )}

            {tournament.status === 'registration_closed' && !isRegistered && (
              <Button
                variant="secondary"
                size="sm"
                disabled
                className="flex-1"
              >
                Registro Cerrado
              </Button>
            )}

            {tournament.currentParticipants >= tournament.maxParticipants && !isRegistered && (
              <Button
                variant="secondary"
                size="sm"
                disabled={!tournament.waitingListEnabled}
                onClick={() => tournament.waitingListEnabled && onRegister?.(tournament)}
                className="flex-1"
              >
                {tournament.waitingListEnabled ? 'Lista de Espera' : 'Lleno'}
              </Button>
            )}
          </div>
        )}

        {/* Warning Messages */}
        {tournament.lateRegistrationAllowed && new Date() > new Date(tournament.registrationEnd) && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
            ⚠️ Registro tardío permitido (pueden aplicar cargos adicionales)
          </div>
        )}
      </div>
    </Card>
  );
};

export default TournamentCard;