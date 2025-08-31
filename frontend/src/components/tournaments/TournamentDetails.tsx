import React, { useState } from 'react';
import { Tournament } from '../../types/tournament';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Tabs from '../ui/Tabs';

interface TournamentDetailsProps {
  tournament: Tournament;
  userRegistrations?: any[];
  onRegister?: (tournament: Tournament, categoryId?: number) => void;
  onEdit?: (tournament: Tournament) => void;
  canEdit?: boolean;
  isRegistering?: boolean;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({
  tournament,
  userRegistrations = [],
  onRegister,
  onEdit,
  canEdit = false,
  isRegistering = false
}) => {
  const [activeTab, setActiveTab] = useState('info');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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

  const isUserRegistered = (categoryId?: number) => {
    if (categoryId) {
      return userRegistrations.some(reg => 
        reg.tournamentId === tournament.id && reg.categoryId === categoryId
      );
    }
    return userRegistrations.some(reg => reg.tournamentId === tournament.id);
  };

  const canRegisterForTournament = () => {
    const now = new Date();
    const regEnd = new Date(tournament.registrationEnd);
    return tournament.status === 'registration_open' && 
           (now <= regEnd || tournament.lateRegistrationAllowed);
  };

  const tabs = [
    { id: 'info', label: 'General Information', icon: '📋' },
    { id: 'categories', label: 'Categories', icon: '🏅' },
    { id: 'venue', label: 'Venue', icon: '📍' },
    { id: 'rules', label: 'Rules', icon: '📜' },
    { id: 'prizes', label: 'Prizes', icon: '🏆' }
  ];

  const renderGeneralInfo = () => (
    <div className="space-y-6">
      {/* Tournament Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={getStatusVariant(tournament.status)}>
              {tournament.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-600 capitalize">
              {tournament.tournamentType} • {tournament.level}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {tournament.description}
          </p>
        </div>
        {canEdit && (
          <Button variant="outline" onClick={() => onEdit?.(tournament)}>
            Edit
          </Button>
        )}
      </div>

      {/* Key Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dates */}
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            📅 Important Dates
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tournament start:</span>
              <span className="font-medium">{formatDate(tournament.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tournament end:</span>
              <span className="font-medium">{formatDate(tournament.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Registration start:</span>
              <span className="font-medium">{formatDate(tournament.registrationStart)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Registration end:</span>
              <span className="font-medium">{formatDate(tournament.registrationEnd)}</span>
            </div>
          </div>
        </Card>

        {/* Participation */}
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            👥 Participation
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current participants:</span>
              <span className="font-medium">
                {tournament.currentParticipants} / {tournament.maxParticipants}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${tournament.maxParticipants > 0 ? (tournament.currentParticipants / tournament.maxParticipants) * 100 : 0}%` 
                }}
              />
            </div>
            
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Entry fee:</span>
                <span className="font-medium">{formatCurrency(tournament.entryFee)}</span>
              </div>
              {tournament.lateRegistrationAllowed && (
                <div className="text-yellow-600">
                  ⚠️ Late registration allowed
                </div>
              )}
              {tournament.waitingListEnabled && (
                <div className="text-blue-600">
                  📋 Waiting list enabled
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Organizer Info */}
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          🏢 Organizer
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="ml-2 font-medium capitalize">{tournament.organizerType}</span>
          </div>
          {tournament.organizer && (
            <div>
              <span className="text-gray-600">Organizer:</span>
              <span className="ml-2 font-medium">{tournament.organizer.username}</span>
            </div>
          )}
          {tournament.state && (
            <div>
              <span className="text-gray-600">State:</span>
              <span className="ml-2 font-medium">{tournament.state.name}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Registration Status */}
      {isUserRegistered() && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center text-green-800">
            <span className="text-2xl mr-3">✅</span>
            <div>
              <h4 className="font-semibold">You are already registered for this tournament</h4>
              <p className="text-sm mt-1">
                You can view your registrations in the "My Tournaments" section
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Registration Action */}
      {!isUserRegistered() && canRegisterForTournament() && (
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onRegister?.(tournament)}
            disabled={isRegistering}
            className="px-8 py-3"
          >
            {isRegistering ? 'Processing...' : 'Register for Tournament'}
          </Button>
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-4">
      {tournament.categories && tournament.categories.length > 0 ? (
        tournament.categories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{category.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {category.currentParticipants} / {category.maxParticipants}
                </div>
                {category.entryFee > 0 && (
                  <div className="text-sm font-medium text-green-600">
                    +{formatCurrency(category.entryFee)}
                  </div>
                )}
              </div>
            </div>

            {/* Category Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 mb-3">
              <div>
                <span className="font-medium">Format:</span>
                <div className="capitalize">{category.playFormat.replace('_', ' ')}</div>
              </div>
              <div>
                <span className="font-medium">Gender:</span>
                <div className="capitalize">{category.genderRequirement}</div>
              </div>
              {(category.minAge || category.maxAge) && (
                <div>
                  <span className="font-medium">Age:</span>
                  <div>
                    {category.minAge && category.maxAge 
                      ? `${category.minAge}-${category.maxAge} years`
                      : category.minAge 
                        ? `${category.minAge}+ years`
                        : `Up to ${category.maxAge} years`
                    }
                  </div>
                </div>
              )}
              {category.skillLevel && (
                <div>
                  <span className="font-medium">Level:</span>
                  <div className="capitalize">{category.skillLevel}</div>
                </div>
              )}
            </div>

            {/* Category Registration */}
            <div className="flex justify-between items-center">
              <div className="w-full bg-gray-200 rounded-full h-1.5 mr-4">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ 
                    width: `${category.maxParticipants > 0 ? (category.currentParticipants / category.maxParticipants) * 100 : 0}%` 
                  }}
                />
              </div>
              
              {!isUserRegistered(category.id) && canRegisterForTournament() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRegister?.(tournament, category.id)}
                  disabled={isRegistering || category.currentParticipants >= category.maxParticipants}
                >
                  {category.currentParticipants >= category.maxParticipants ? 'Full' : 'Register'}
                </Button>
              )}
              
              {isUserRegistered(category.id) && (
                <Badge variant="success" className="text-xs">
                  Registered
                </Badge>
              )}
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🏅</div>
          <p>Categories will be announced soon</p>
        </div>
      )}
    </div>
  );

  const renderVenueInfo = () => (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">📍 Location</h4>
          <div className="text-gray-700">
            <div className="font-medium">{tournament.venueName}</div>
            <div className="text-sm mt-1">{tournament.venueAddress}</div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🗺️</div>
            <p>Location map</p>
            <p className="text-sm">(Feature coming soon)</p>
          </div>
        </div>

        {/* Transportation and Accommodation */}
        {((tournament as any).transportationInfo || (tournament as any).accommodationInfo) && (
          <div className="border-t pt-4 space-y-3">
            {(tournament as any).transportationInfo && (
              <div>
                <h5 className="font-medium text-gray-900 mb-1">🚗 Transportation</h5>
                <p className="text-sm text-gray-600">{(tournament as any).transportationInfo}</p>
              </div>
            )}
            {(tournament as any).accommodationInfo && (
              <div>
                <h5 className="font-medium text-gray-900 mb-1">🏨 Accommodation</h5>
                <p className="text-sm text-gray-600">{(tournament as any).accommodationInfo}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  const renderRules = () => (
    <Card className="p-6">
      {tournament.rulesDocument ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">📜 Tournament Rules</h4>
            <Button variant="outline" size="sm">
              Download PDF
            </Button>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600">
              The complete rules are available for download. Make sure to read them 
              before registering for the tournament.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📜</div>
          <p>The rules will be published soon</p>
        </div>
      )}
    </Card>
  );

  const renderPrizes = () => (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 mb-2">🏆 Total Prize</h4>
          <div className="text-3xl font-bold text-green-600 mb-4">
            {formatCurrency(tournament.prizePool)}
          </div>
        </div>

        {tournament.prizeDistribution && (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Prize Distribution</h5>
            <div className="grid grid-cols-2 gap-3">
              {tournament.prizeDistribution.first && (
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">🥇</div>
                  <div className="font-medium text-gray-900">1st Place</div>
                  <div className="text-sm text-green-600 font-medium">
                    {(tournament.prizeDistribution.first * 100)}%
                  </div>
                </div>
              )}
              {tournament.prizeDistribution.second && (
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">🥈</div>
                  <div className="font-medium text-gray-900">2nd Place</div>
                  <div className="text-sm text-green-600 font-medium">
                    {(tournament.prizeDistribution.second * 100)}%
                  </div>
                </div>
              )}
              {tournament.prizeDistribution.third && (
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">🥉</div>
                  <div className="font-medium text-gray-900">3rd Place</div>
                  <div className="text-sm text-green-600 font-medium">
                    {(tournament.prizeDistribution.third * 100)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tournament.sponsorInfo && (
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-2">🤝 Sponsors</h5>
            <div className="text-sm text-gray-600">
              Sponsor information available soon
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return renderGeneralInfo();
      case 'categories':
        return renderCategories();
      case 'venue':
        return renderVenueInfo();
      case 'rules':
        return renderRules();
      case 'prizes':
        return renderPrizes();
      default:
        return renderGeneralInfo();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {tournament.name}
        </h1>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <Badge variant={getStatusVariant(tournament.status)} className="text-sm">
            {tournament.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <span className="text-gray-600 capitalize">
            {tournament.tournamentType} • {tournament.level}
          </span>
          <span className="text-gray-600">
            {formatDate(tournament.startDate)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        items={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TournamentDetails;