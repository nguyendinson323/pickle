import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectUser } from '@/store/authSlice';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Switch from '@/components/ui/Switch';
import apiService from '@/services/api';

interface PrivacySettingsProps {
  onUpdate?: (settings: any) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ onUpdate }) => {
  const user = useAppSelector(selectUser);
  const [canBeFound, setCanBeFound] = useState(
    user?.role === 'player' && user?.profile ? (user.profile as any).canBeFound ?? true : true
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggleVisibility = async () => {
    setIsLoading(true);
    setShowSuccess(false);
    
    try {
      const response = await apiService.patch('/profile/privacy', {
        canBeFound: !canBeFound
      });

      if ((response as any).success) {
        setCanBeFound(!canBeFound);
        setShowSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
        
        if (onUpdate) {
          onUpdate({ canBeFound: !canBeFound });
        }
      } else {
        throw new Error((response as any).error || 'Failed to update privacy setting');
      }
    } catch (error) {
      console.error('Privacy setting update failed:', error);
      alert('Failed to update privacy setting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Only show privacy settings for players
  if (user?.role !== 'player') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Player Search Visibility
      </h3>
      
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-2">
            Can Be Found in Player Search
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            When enabled, other players can find you in the player search feature. 
            This allows them to connect with you for matches and activities. 
            When disabled, your profile will be hidden from all search results.
          </p>
          
          <div className="flex items-center space-x-3">
            <Switch
              checked={canBeFound}
              onChange={handleToggleVisibility}
              disabled={isLoading}
            />
            
            <span className={`text-sm font-medium ${
              canBeFound ? 'text-green-600' : 'text-gray-600'
            }`}>
              {canBeFound ? 'Visible' : 'Hidden'}
            </span>
            
            {isLoading && <LoadingSpinner size="sm" />}
            
            {showSuccess && (
              <span className="text-sm text-green-600 animate-fade-in">
                ✓ Updated successfully
              </span>
            )}
          </div>
        </div>
        
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          canBeFound ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {canBeFound ? (
            <EyeIcon className="w-6 h-6" />
          ) : (
            <EyeSlashIcon className="w-6 h-6" />
          )}
        </div>
      </div>
      
      {canBeFound && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h5 className="font-medium text-blue-900 mb-2">What others can see:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your name and profile photo</li>
            <li>• Your NRTP level and ranking</li>
            <li>• Your general location (city/state)</li>
            <li>• Your playing preferences</li>
          </ul>
          <p className="text-xs text-blue-600 mt-2">
            Your contact information and personal details remain private until you choose to share them.
          </p>
        </div>
      )}
      
      {!canBeFound && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h5 className="font-medium text-gray-900 mb-2">Privacy Mode Active</h5>
          <p className="text-sm text-gray-600">
            Your profile is hidden from player search results. You can still:
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>• Register for tournaments</li>
            <li>• Access all platform features</li>
            <li>• Message players you're already connected with</li>
            <li>• Be visible to tournament organizers</li>
          </ul>
        </div>
      )}
      
      {/* Additional Privacy Options */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Additional Privacy Options</h4>
        
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Show ranking position</span>
            <Switch checked={true} onChange={() => {}} disabled={isLoading} />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Show NRTP level</span>
            <Switch checked={true} onChange={() => {}} disabled={isLoading} />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Show recent match history</span>
            <Switch checked={false} onChange={() => {}} disabled={isLoading} />
          </label>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          More privacy options coming soon
        </p>
      </div>
    </div>
  );
};

export default PrivacySettings;