import React, { useState } from 'react';

interface NotificationPreferencesProps {
  onClose?: () => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ onClose }) => {
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    tournaments: true,
    messages: true,
    system: false
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Notification Preferences
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Email Notifications
          </label>
          <input
            type="checkbox"
            checked={preferences.email}
            onChange={() => handleToggle('email')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Push Notifications
          </label>
          <input
            type="checkbox"
            checked={preferences.push}
            onChange={() => handleToggle('push')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Tournament Updates
          </label>
          <input
            type="checkbox"
            checked={preferences.tournaments}
            onChange={() => handleToggle('tournaments')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Messages
          </label>
          <input
            type="checkbox"
            checked={preferences.messages}
            onChange={() => handleToggle('messages')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            System Notifications
          </label>
          <input
            type="checkbox"
            checked={preferences.system}
            onChange={() => handleToggle('system')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            console.log('Saving preferences:', preferences);
            onClose?.();
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferences;