import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectUser, getCurrentUser } from '@/store/authSlice';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PhotoUpload from '@/components/profile/PhotoUpload';
import DocumentUpload from '@/components/profile/DocumentUpload';
import DigitalCredential from '@/components/credentials/DigitalCredential';
import PrivacySettings from '@/components/profile/PrivacySettings';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Card from '@/components/ui/Card';
import apiService from '@/services/api';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [isLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Fetch latest user data
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const profile = user.profile as any;
      setProfileData({
        fullName: profile?.fullName || '',
        email: user.email || '',
        username: user.username || '',
        dateOfBirth: profile?.dateOfBirth || '',
        gender: profile?.gender || '',
        nationality: profile?.nationality || 'Mexican',
        curp: profile?.curp || '',
        mobilePhone: profile?.mobilePhone || '',
        nrtpLevel: profile?.nrtpLevel || '',
        profilePhotoUrl: profile?.profilePhotoUrl || '',
        idDocumentUrl: profile?.idDocumentUrl || '',
        canBeFound: profile?.canBeFound ?? true,
        stateId: profile?.stateId || ''
      });
    }
  }, [user]);

  const handlePhotoUpdate = async (photoUrl: string) => {
    setProfileData({ ...profileData, profilePhotoUrl: photoUrl });
    setHasChanges(true);
    
    // Immediately save photo update
    try {
      await apiService.patch('/profile', { profilePhotoUrl: photoUrl });
      dispatch(getCurrentUser());
    } catch (error) {
      console.error('Failed to update profile photo:', error);
    }
  };

  const handleDocumentUpdate = async (documentUrl: string) => {
    setProfileData({ ...profileData, idDocumentUrl: documentUrl });
    setHasChanges(true);
    
    // Immediately save document update
    try {
      await apiService.patch('/profile', { idDocumentUrl: documentUrl });
      dispatch(getCurrentUser());
    } catch (error) {
      console.error('Failed to update document:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setHasChanges(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await apiService.patch('/profile', profileData);
      if ((response as any).success) {
        setHasChanges(false);
        dispatch(getCurrentUser());
        alert('Profile updated successfully!');
      } else {
        throw new Error((response as any).error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getCredentialData = () => {
    if (!user) return null;
    
    return {
      id: user.id || (user as any).userId || '0',
      fullName: profileData.fullName || user.username || 'User',
      role: user.role,
      state: (user.profile as any)?.state?.name || 'Mexico City',
      nrtpLevel: profileData.nrtpLevel,
      affiliationStatus: (user.isActive ? 'active' : 'expired') as 'active' | 'expired' | 'pending',
      rankingPosition: (user.profile as any)?.rankingPosition,
      clubName: (user.profile as any)?.clubName,
      licenseType: (user.profile as any)?.licenseType,
      nationality: profileData.nationality || 'Mexican',
      profilePhoto: profileData.profilePhotoUrl,
      federationIdNumber: (user.profile as any)?.federationIdNumber || `FMP${String(user.id).padStart(6, '0')}`,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: '👤' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'credential', label: 'Digital Credential', icon: '🎫' },
    { id: 'privacy', label: 'Privacy Settings', icon: '🔒' }
  ];

  // Filter tabs based on user role
  const availableTabs = tabs.filter(tab => {
    if (tab.id === 'privacy' && user?.role !== 'player') return false;
    return true;
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  if (!user) {
    return (
      <DashboardLayout tabs={availableTabs} onTabChange={handleTabChange}>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout tabs={availableTabs} onTabChange={handleTabChange}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your personal information and settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Photo Section */}
              <div className="lg:col-span-1">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
                  <PhotoUpload
                    currentPhoto={profileData.profilePhotoUrl}
                    onPhotoUpdate={handlePhotoUpdate}
                    isLoading={isLoading}
                  />
                </Card>
              </div>

              {/* Personal Information Form */}
              <div className="lg:col-span-2">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={profileData.username}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={profileData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nationality
                        </label>
                        <input
                          type="text"
                          name="nationality"
                          value={profileData.nationality}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      {user.role === 'player' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CURP
                            </label>
                            <input
                              type="text"
                              name="curp"
                              value={profileData.curp}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              NRTP Level
                            </label>
                            <select
                              name="nrtpLevel"
                              value={profileData.nrtpLevel}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="">Select Level</option>
                              <option value="2.0">2.0</option>
                              <option value="2.5">2.5</option>
                              <option value="3.0">3.0</option>
                              <option value="3.5">3.5</option>
                              <option value="4.0">4.0</option>
                              <option value="4.5">4.5</option>
                              <option value="5.0">5.0</option>
                              <option value="5.5">5.5</option>
                            </select>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Phone
                        </label>
                        <input
                          type="tel"
                          name="mobilePhone"
                          value={profileData.mobilePhone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    {hasChanges && (
                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="btn-primary flex items-center space-x-2"
                        >
                          {isSaving ? (
                            <>
                              <LoadingSpinner size="sm" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <span>Save Changes</span>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ID Document</h3>
                <DocumentUpload
                  label="Official ID (INE/Passport)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5}
                  currentDocument={profileData.idDocumentUrl}
                  onDocumentUpdate={handleDocumentUpdate}
                  required={true}
                />
              </Card>
              
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Documents</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload any additional documents required for verification
                </p>
                <DocumentUpload
                  label="Proof of Address"
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5}
                  currentDocument=""
                  onDocumentUpdate={() => {}}
                  required={false}
                />
              </Card>
            </div>
          )}

          {activeTab === 'credential' && (
            <div className="max-w-2xl mx-auto">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Your Digital Credential
                </h3>
                {getCredentialData() ? (
                  <DigitalCredential
                    data={getCredentialData()!}
                    onDownload={() => console.log('Credential downloaded')}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Complete your profile to generate your digital credential
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'privacy' && user.role === 'player' && (
            <div className="max-w-3xl mx-auto">
              <PrivacySettings onUpdate={(settings) => setProfileData({ ...profileData, ...settings })} />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;