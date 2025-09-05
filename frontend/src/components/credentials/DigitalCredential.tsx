import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface CredentialData {
  id: string | number;
  fullName: string;
  role: string;
  state?: string;
  nrtpLevel?: string;
  affiliationStatus: 'active' | 'expired' | 'pending';
  rankingPosition?: number;
  clubName?: string;
  licenseType?: string;
  nationality?: string;
  profilePhoto?: string;
  federationIdNumber?: string;
  validUntil?: string;
}

interface DigitalCredentialProps {
  data: CredentialData;
  onDownload?: () => void;
}

const DigitalCredential: React.FC<DigitalCredentialProps> = ({ data, onDownload }) => {
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Generate QR code pointing to public credential view
    const qrUrl = `${window.location.origin}/credential/${data.id}`;
    
    if (qrCodeRef.current) {
      setIsGeneratingQR(true);
      QRCode.toCanvas(
        qrCodeRef.current,
        qrUrl,
        {
          width: 100,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        },
        (error: any) => {
          if (error) console.error('QR Code generation error:', error);
          setIsGeneratingQR(false);
        }
      );
    }
  }, [data.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'player': 'Player',
      'coach': 'Coach',
      'club': 'Club',
      'partner': 'Partner',
      'state': 'State Committee',
      'admin': 'Federation Admin'
    };
    return roleMap[role] || role;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById('credential-card');
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false
        });
        
        const link = document.createElement('a');
        link.download = `credential-${data.fullName.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        if (onDownload) {
          onDownload();
        }
      }
    } catch (error) {
      console.error('Error downloading credential:', error);
      alert('Failed to download credential. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="credential-container max-w-md mx-auto">
      <div 
        id="credential-card"
        className="bg-white border-2 border-gray-300 rounded-lg shadow-xl overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Header with Federation Logo */}
        <div className="bg-white bg-opacity-95 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏓</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-800 leading-tight">
                  MEXICAN PICKLEBALL
                </h3>
                <h3 className="text-xs font-bold text-gray-800 leading-tight">
                  FEDERATION
                </h3>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(data.affiliationStatus)}`}>
              {data.affiliationStatus.toUpperCase()}
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-start space-x-4">
            <img
              src={data.profilePhoto || '/default-avatar.svg'}
              alt={data.fullName}
              className="w-20 h-20 rounded-full border-3 border-white shadow-md object-cover"
              onError={(e) => {
                e.currentTarget.src = '/default-avatar.svg';
              }}
            />
            
            <div className="flex-1">
              {/* Name */}
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {data.fullName}
              </h2>
              
              {/* Role */}
              <p className="text-sm font-semibold text-primary-600 mb-1">
                {getRoleDisplay(data.role)}
              </p>
              
              {/* State */}
              {data.state && (
                <p className="text-sm text-gray-600">
                  {data.state}
                </p>
              )}
            </div>
          </div>

          {/* Credential Details Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {data.federationIdNumber && (
              <div className="bg-gray-50 rounded px-2 py-1">
                <span className="font-semibold text-gray-600">ID:</span>
                <span className="ml-1 text-gray-800">{data.federationIdNumber}</span>
              </div>
            )}
            
            {data.nrtpLevel && (
              <div className="bg-gray-50 rounded px-2 py-1">
                <span className="font-semibold text-gray-600">NRTP:</span>
                <span className="ml-1 text-gray-800">{data.nrtpLevel}</span>
              </div>
            )}
            
            {data.rankingPosition && (
              <div className="bg-gray-50 rounded px-2 py-1">
                <span className="font-semibold text-gray-600">Ranking:</span>
                <span className="ml-1 text-gray-800">#{data.rankingPosition}</span>
              </div>
            )}
            
            {data.clubName && (
              <div className="bg-gray-50 rounded px-2 py-1">
                <span className="font-semibold text-gray-600">Club:</span>
                <span className="ml-1 text-gray-800">{data.clubName}</span>
              </div>
            )}
            
            {data.licenseType && (
              <div className="bg-gray-50 rounded px-2 py-1">
                <span className="font-semibold text-gray-600">License:</span>
                <span className="ml-1 text-gray-800">{data.licenseType}</span>
              </div>
            )}
            
            {data.validUntil && (
              <div className="bg-gray-50 rounded px-2 py-1">
                <span className="font-semibold text-gray-600">Valid Until:</span>
                <span className="ml-1 text-gray-800">{data.validUntil}</span>
              </div>
            )}
          </div>

          {/* QR Code and Nationality */}
          <div className="flex items-end justify-between mt-4">
            <div className="bg-white p-2 rounded border border-gray-200">
              {isGeneratingQR ? (
                <div className="w-[100px] h-[100px] flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              ) : (
                <canvas ref={qrCodeRef} />
              )}
            </div>
            
            {data.nationality && (
              <div className="text-right">
                <div className="inline-flex items-center space-x-1 bg-gray-50 rounded px-2 py-1">
                  <span className="text-xs text-gray-600">Nationality:</span>
                  <span className="text-xs font-semibold text-gray-800">
                    {data.nationality}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Scan QR code to verify authenticity
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading || isGeneratingQR}
        className="w-full mt-4 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Download Credential</span>
          </>
        )}
      </button>

      {/* Share Options */}
      <div className="mt-3 flex justify-center space-x-4">
        <button className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
          Share
        </button>
        <button className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
          Print
        </button>
        <button className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
          Email
        </button>
      </div>
    </div>
  );
};

export default DigitalCredential;