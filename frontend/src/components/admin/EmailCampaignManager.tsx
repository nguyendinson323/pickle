import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Calendar, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play
} from 'lucide-react';
import Card from '../ui/Card';
import FormField from '../forms/FormField';
import SelectField from '../forms/SelectField';
import { emailService, EmailCampaign, EmailTemplate } from '../../services/emailService';

const EmailCampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    templateId: '',
    recipients: [] as string[],
    recipientType: 'all_users', // all_users, tournament_participants, active_players, etc.
    scheduledAt: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campaignsData, templatesData] = await Promise.all([
        emailService.getEmailCampaigns(),
        emailService.getEmailTemplates()
      ]);
      setCampaigns(campaignsData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      // Mock recipient selection based on type
      const mockRecipients = generateMockRecipients(newCampaign.recipientType);
      
      const campaign = await emailService.createEmailCampaign({
        name: newCampaign.name,
        templateId: newCampaign.templateId,
        recipients: mockRecipients,
        scheduledAt: newCampaign.scheduledAt ? new Date(newCampaign.scheduledAt) : undefined
      });
      
      setCampaigns(prev => [campaign, ...prev]);
      setShowCreateModal(false);
      resetNewCampaign();
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const generateMockRecipients = (type: string): string[] => {
    // Mock recipient generation based on type
    const mockEmails = [
      'player1@example.com', 'player2@example.com', 'coach1@example.com',
      'admin@example.com', 'club@example.com', 'player3@example.com'
    ];
    
    switch (type) {
      case 'all_users':
        return mockEmails;
      case 'tournament_participants':
        return mockEmails.slice(0, 4);
      case 'active_players':
        return mockEmails.slice(0, 3);
      case 'coaches':
        return ['coach1@example.com'];
      default:
        return mockEmails.slice(0, 2);
    }
  };

  const resetNewCampaign = () => {
    setNewCampaign({
      name: '',
      templateId: '',
      recipients: [],
      recipientType: 'all_users',
      scheduledAt: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'sending':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4" />;
      case 'sending':
        return <Play className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const recipientTypeOptions = [
    { value: 'all_users', label: 'All Users' },
    { value: 'tournament_participants', label: 'Tournament Participants' },
    { value: 'active_players', label: 'Active Players' },
    { value: 'coaches', label: 'Coaches' },
    { value: 'clubs', label: 'Clubs' },
    { value: 'custom', label: 'Custom List' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Email Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage and send email campaigns to users</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sent This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {campaigns.filter(c => c.status === 'sent').length}
              </p>
            </div>
            <Send className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Open Rate</p>
              <p className="text-2xl font-bold text-purple-600">65.2%</p>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-yellow-600">
                {campaigns.filter(c => c.status === 'scheduled').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(campaign.status)}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{campaign.recipientCount} recipients</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {campaign.sentAt 
                        ? `Sent ${formatDate(campaign.sentAt)}`
                        : campaign.scheduledAt 
                        ? `Scheduled ${formatDate(campaign.scheduledAt)}`
                        : `Created ${formatDate(campaign.createdAt)}`
                      }
                    </span>
                  </div>
                  
                  {campaign.openRate && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{campaign.openRate}% open rate</span>
                    </div>
                  )}
                  
                  {campaign.clickRate && (
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>{campaign.clickRate}% click rate</span>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  Template: {templates.find(t => t.id === campaign.templateId)?.name || 'Unknown'}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
        
        {campaigns.length === 0 && (
          <Card className="p-12 text-center">
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-4">Create your first email campaign to get started.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Campaign
            </button>
          </Card>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Email Campaign</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <FormField
                name="name"
                label="Campaign Name"
                type="text"
                value={newCampaign.name}
                onChange={(value) => setNewCampaign(prev => ({ ...prev, name: value }))}
                placeholder="Enter campaign name"
              />
              
              <SelectField
                name="templateId"
                label="Email Template"
                value={newCampaign.templateId}
                onChange={(value) => setNewCampaign(prev => ({ ...prev, templateId: value }))}
                options={templates.map(template => ({
                  value: template.id,
                  label: template.name
                }))}
                placeholder="Select email template"
              />
              
              <SelectField
                name="recipientType"
                label="Recipients"
                value={newCampaign.recipientType}
                onChange={(value) => setNewCampaign(prev => ({ ...prev, recipientType: value }))}
                options={recipientTypeOptions}
              />
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Estimated Recipients:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {generateMockRecipients(newCampaign.recipientType).length} users
                </p>
              </div>
              
              <FormField
                name="scheduledAt"
                label="Schedule Send Time (Optional)"
                type="datetime-local"
                value={newCampaign.scheduledAt}
                onChange={(value) => setNewCampaign(prev => ({ ...prev, scheduledAt: value }))}
              />
              
              {newCampaign.scheduledAt && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <p className="text-yellow-800 font-medium">Scheduled Campaign</p>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    This campaign will be sent automatically at the scheduled time.
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetNewCampaign();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                disabled={!newCampaign.name || !newCampaign.templateId}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {newCampaign.scheduledAt ? 'Schedule Campaign' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailCampaignManager;