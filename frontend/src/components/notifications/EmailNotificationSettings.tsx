import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Bell, 
  Settings, 
  Save, 
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Trophy,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import Card from '../ui/Card';
import { emailService, EmailNotificationSettings } from '../../services/emailService';
import { useAppSelector } from '../../store';

const EmailNotificationSettingsComponent: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [settings, setSettings] = useState<EmailNotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const userSettings = await emailService.getNotificationSettings(user.id.toString());
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: keyof EmailNotificationSettings, value: any) => {
    if (!settings) return;
    
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = async () => {
    if (!settings || !user?.id) return;
    
    try {
      setSaving(true);
      await emailService.updateNotificationSettings(user.id.toString(), settings);
      setSaveMessage({ type: 'success', message: 'Settings saved successfully!' });
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Settings</h3>
        <p className="text-gray-600 mb-4">We couldn't load your notification preferences.</p>
        <button onClick={loadSettings} className="btn-primary">
          Try Again
        </button>
      </Card>
    );
  }

  const notificationTypes = [
    {
      key: 'tournamentReminders' as keyof EmailNotificationSettings,
      label: 'Tournament Reminders',
      description: 'Get reminders about upcoming tournaments and deadlines',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      key: 'paymentConfirmations' as keyof EmailNotificationSettings,
      label: 'Payment Confirmations',
      description: 'Receive confirmations for payments and receipts',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      key: 'partnerRequests' as keyof EmailNotificationSettings,
      label: 'Partner Requests',
      description: 'Get notified when someone wants to be your playing partner',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      key: 'matchResults' as keyof EmailNotificationSettings,
      label: 'Match Results',
      description: 'Receive updates about your match results and rankings',
      icon: Trophy,
      color: 'text-purple-600'
    },
    {
      key: 'systemUpdates' as keyof EmailNotificationSettings,
      label: 'System Updates',
      description: 'Important updates about platform features and maintenance',
      icon: Settings,
      color: 'text-gray-600'
    },
    {
      key: 'marketingEmails' as keyof EmailNotificationSettings,
      label: 'Marketing & Promotions',
      description: 'Special offers, events, and product announcements',
      icon: MessageSquare,
      color: 'text-pink-600'
    },
    {
      key: 'weeklyDigest' as keyof EmailNotificationSettings,
      label: 'Weekly Digest',
      description: 'Weekly summary of your activities and community updates',
      icon: Mail,
      color: 'text-indigo-600'
    }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate', description: 'Send notifications right away' },
    { value: 'daily', label: 'Daily Digest', description: 'Bundle notifications once per day' },
    { value: 'weekly', label: 'Weekly Summary', description: 'Send a weekly summary' },
    { value: 'never', label: 'Never', description: 'Turn off all email notifications' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Email Notifications</h2>
            <p className="text-gray-600">Manage your email preferences and notification settings</p>
          </div>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg border ${
          saveMessage.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {saveMessage.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{saveMessage.message}</span>
          </div>
        </div>
      )}

      {/* Email Frequency Setting */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Email Frequency</h3>
        </div>
        <p className="text-gray-600 mb-6">Choose how often you want to receive email notifications</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {frequencyOptions.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <div className={`p-4 border-2 rounded-lg transition-all ${
                settings.emailFrequency === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    name="emailFrequency"
                    value={option.value}
                    checked={settings.emailFrequency === option.value}
                    onChange={(e) => handleSettingChange('emailFrequency', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900">{option.label}</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Notification Types */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notification Types</h3>
        </div>
        <p className="text-gray-600 mb-6">Choose which types of emails you want to receive</p>
        
        <div className="space-y-4">
          {notificationTypes.map((type) => {
            const Icon = type.icon;
            const isEnabled = settings[type.key] as boolean;
            
            return (
              <div key={type.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <Icon className={`h-6 w-6 ${type.color} mt-0.5`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{type.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => handleSettingChange(type.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Unsubscribe Information */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 mb-2">Unsubscribe Information</h3>
            <p className="text-sm text-yellow-700 mb-3">
              You can unsubscribe from any email type at any time. Essential emails like payment confirmations 
              and security alerts cannot be disabled for your account security.
            </p>
            <p className="text-xs text-yellow-600">
              To completely stop all emails, you can deactivate your account in Account Settings.
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EmailNotificationSettingsComponent;