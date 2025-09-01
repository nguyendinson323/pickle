import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface PlayerFinderMatch {
  id: number;
  requestId: number;
  matchedUserId: number;
  distance: number;
  compatibilityScore: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  responseMessage?: string;
  matchedAt: string;
  respondedAt?: string;
  contactShared: boolean;
  matchedUser?: {
    id: number;
    username: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
      profilePhotoUrl?: string;
      nrtpLevel: string;
    };
  };
}

interface MatchesListProps {
  receivedMatches: PlayerFinderMatch[];
  sentMatches: PlayerFinderMatch[];
  onRespondToMatch: (matchId: number, response: 'accepted' | 'declined', message?: string) => Promise<void>;
  onRefresh: () => void;
}

const MatchesList: React.FC<MatchesListProps> = ({
  receivedMatches,
  sentMatches,
  onRespondToMatch,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [respondingToMatch, setRespondingToMatch] = useState<number | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<PlayerFinderMatch | null>(null);
  const [pendingResponse, setPendingResponse] = useState<'accepted' | 'declined' | null>(null);

  const handleRespond = async (matchId: number, response: 'accepted' | 'declined') => {
    if (response === 'accepted' || responseMessage.trim()) {
      setRespondingToMatch(matchId);
      try {
        await onRespondToMatch(matchId, response, responseMessage.trim() || undefined);
        setResponseMessage('');
        setShowMessageModal(false);
        setSelectedMatch(null);
        setPendingResponse(null);
      } catch (error) {
        console.error('Failed to respond to match:', error);
      } finally {
        setRespondingToMatch(null);
      }
    } else {
      // Show message modal for declined responses
      setSelectedMatch(receivedMatches.find(m => m.id === matchId) || null);
      setPendingResponse(response);
      setShowMessageModal(true);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          color: 'bg-yellow-100 text-yellow-800',
          icon: ClockIcon
        };
      case 'accepted':
        return {
          label: 'Accepted',
          color: 'bg-green-100 text-green-800',
          icon: CheckIcon
        };
      case 'declined':
        return {
          label: 'Declined',
          color: 'bg-red-100 text-red-800',
          icon: XMarkIcon
        };
      case 'expired':
        return {
          label: 'Expired',
          color: 'bg-gray-100 text-gray-800',
          icon: ClockIcon
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800',
          icon: ClockIcon
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderMatch = (match: PlayerFinderMatch, type: 'received' | 'sent') => {
    const statusInfo = getStatusDisplay(match.status);
    const StatusIcon = statusInfo.icon;

    return (
      <Card key={match.id} className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Player Info */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-shrink-0">
                {match.matchedUser?.profile?.profilePhotoUrl ? (
                  <img
                    src={match.matchedUser.profile.profilePhotoUrl}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {match.matchedUser?.profile?.firstName} {match.matchedUser?.profile?.lastName}
                </h3>
                <p className="text-sm text-gray-500">@{match.matchedUser?.username}</p>
              </div>
              
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </div>
            </div>

            {/* Match Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4" />
                <span>{match.distance.toFixed(1)} km away</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <StarIcon className="h-4 w-4" />
                <span>{match.compatibilityScore}% compatibility</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>NRTP: {match.matchedUser?.profile?.nrtpLevel || 'N/A'}</span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-gray-400 mb-3">
              <p>Matched on {formatDate(match.matchedAt)}</p>
              {match.respondedAt && (
                <p>Responded on {formatDate(match.respondedAt)}</p>
              )}
            </div>

            {/* Response Message */}
            {match.responseMessage && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Message:</span>
                </div>
                <p className="text-sm text-gray-600">{match.responseMessage}</p>
              </div>
            )}

            {/* Contact Info for Accepted Matches */}
            {match.status === 'accepted' && match.contactShared && (
              <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-2">Contact Information</h4>
                <p className="text-sm text-green-700">
                  Email: {match.matchedUser?.email}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  You can now contact this player directly to arrange a game!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons for Pending Received Matches */}
        {type === 'received' && match.status === 'pending' && (
          <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRespond(match.id, 'declined')}
              disabled={respondingToMatch === match.id}
              className="flex items-center space-x-2"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Decline</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleRespond(match.id, 'accepted')}
              disabled={respondingToMatch === match.id}
              className="flex items-center space-x-2"
            >
              {respondingToMatch === match.id ? (
                <LoadingSpinner size="sm" />
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
              <span>Accept</span>
            </Button>
          </div>
        )}
      </Card>
    );
  };

  const currentMatches = activeTab === 'received' ? receivedMatches : sentMatches;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Player Matches</h2>
          <p className="text-sm text-gray-500 mt-1">
            View and respond to player matching requests
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Received Matches ({receivedMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent Matches ({sentMatches.length})
          </button>
        </nav>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {currentMatches.length > 0 ? (
          currentMatches.map((match) => renderMatch(match, activeTab))
        ) : (
          <Card className="p-8 text-center">
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'received' ? 'No matches received yet' : 'No matches sent yet'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'received' 
                ? 'When other players find you as a potential match, they\'ll appear here.'
                : 'Your sent match requests will appear here when you create player finder requests.'
              }
            </p>
          </Card>
        )}
      </div>

      {/* Response Message Modal */}
      {showMessageModal && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {pendingResponse === 'accepted' ? 'Accept Match' : 'Decline Match'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {pendingResponse === 'accepted' 
                ? 'Add an optional message to introduce yourself:'
                : 'Would you like to add a polite message explaining why you\'re declining?'
              }
            </p>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder={pendingResponse === 'accepted' 
                ? 'Hi! I\'d love to play. When are you available?'
                : 'Thanks for the interest, but I\'m not available right now.'
              }
              rows={3}
              maxLength={500}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4"
            />
            <p className="text-xs text-gray-500 mb-4">{responseMessage.length}/500 characters</p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowMessageModal(false);
                  setResponseMessage('');
                  setSelectedMatch(null);
                  setPendingResponse(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={pendingResponse === 'accepted' ? 'primary' : 'outline'}
                onClick={() => selectedMatch && handleRespond(selectedMatch.id, pendingResponse!)}
                disabled={respondingToMatch === selectedMatch?.id}
              >
                {respondingToMatch === selectedMatch?.id ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  pendingResponse === 'accepted' ? 'Accept Match' : 'Decline Match'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesList;