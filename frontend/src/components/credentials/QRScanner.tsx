import React, { useState, useRef, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';

interface QRScannerProps {
  onScanResult?: (result: VerificationResult) => void;
  onClose?: () => void;
}

interface VerificationResult {
  valid: boolean;
  credential?: {
    id: string;
    fullName: string;
    userType: string;
    federationIdNumber: string;
    stateName: string;
    status: string;
    affiliationStatus: string;
    expirationDate: string;
    verificationCount: number;
  };
  reason?: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScanResult,
  onClose
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualId, setManualId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera when component mounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // Use back camera on mobile
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsScanning(true);
      setError(null);
      
      // Start scanning loop
      scanQRCode();
    } catch (err) {
      setHasCamera(false);
      setError('Could not access camera. Please use manual verification.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        // In a real implementation, you would use a QR code library like jsQR
        // For now, we'll simulate QR detection
        // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // const qrResult = jsQR(imageData.data, imageData.width, imageData.height);
        
        // if (qrResult) {
        //   const qrData = JSON.parse(qrResult.data);
        //   if (qrData.id) {
        //     await verifyCredential(qrData.id);
        //     return;
        //   }
        // }
      } catch (err) {
        // Continue scanning
      }
    }

    // Continue scanning
    if (isScanning) {
      setTimeout(scanQRCode, 500); // Scan every 500ms
    }
  };

  const verifyCredential = async (credentialId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/credentials/verify/${credentialId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error verifying credential');
      }

      const result = await response.json();
      
      if (result.success) {
        setVerificationResult(result.data);
        if (onScanResult) {
          onScanResult(result.data);
        }
        stopCamera();
      } else {
        throw new Error(result.error || 'Error verifying credential');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) {
      setError('Please enter a valid credential ID');
      return;
    }

    await verifyCredential(manualId.trim());
  };

  const resetScanner = () => {
    setVerificationResult(null);
    setError(null);
    setManualId('');
  };

  const formatStatus = (status: string) => {
    const labels: Record<string, string> = {
      'active': 'Active',
      'expired': 'Expired',
      'suspended': 'Suspended',
      'revoked': 'Revoked',
      'pending': 'Pending'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'suspended':
        return 'warning';
      case 'revoked':
        return 'secondary';
      case 'pending':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Credential Verification</h2>
        {onClose && (
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        )}
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <Card className="p-6">
          <div className="text-center mb-4">
            <div className={`
              inline-flex items-center justify-center w-16 h-16 rounded-full mb-4
              ${verificationResult.valid ? 'bg-green-100' : 'bg-red-100'}
            `}>
              {verificationResult.valid ? (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            
            <h3 className={`text-xl font-semibold mb-2 ${
              verificationResult.valid ? 'text-green-800' : 'text-red-800'
            }`}>
              {verificationResult.valid ? 'Valid Credential' : 'Invalid Credential'}
            </h3>
            
            {!verificationResult.valid && verificationResult.reason && (
              <p className="text-red-600 text-sm">
                {verificationResult.reason}
              </p>
            )}
          </div>

          {verificationResult.credential && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <div className="text-gray-900">{verificationResult.credential.fullName}</div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Federation ID:</span>
                  <div className="text-gray-900">{verificationResult.credential.federationIdNumber}</div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <div className="text-gray-900">
                    {verificationResult.credential.userType === 'player' ? 'Player' :
                     verificationResult.credential.userType === 'coach' ? 'Coach' :
                     verificationResult.credential.userType === 'referee' ? 'Referee' :
                     'Club Administrator'}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">State:</span>
                  <div className="text-gray-900">{verificationResult.credential.stateName}</div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Credential Status:</span>
                  <div>
                    <Badge variant={getStatusColor(verificationResult.credential.status) as any}>
                      {formatStatus(verificationResult.credential.status)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Affiliation:</span>
                  <div>
                    <Badge variant="secondary">
                      {verificationResult.credential.affiliationStatus}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Valid until:</span>
                  <div className="text-gray-900">
                    {new Date(verificationResult.credential.expirationDate).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Verifications:</span>
                  <div className="text-gray-900">{verificationResult.credential.verificationCount}</div>
                </div>
              </div>

              <div className="pt-4 border-t text-center text-xs text-gray-500">
                Credential ID: {verificationResult.credential.id}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Button onClick={resetScanner} variant="secondary">
              Verify Another Credential
            </Button>
          </div>
        </Card>
      )}

      {/* Scanner Interface */}
      {!verificationResult && (
        <>
          {/* QR Scanner */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
            
            {hasCamera && (
              <div className="text-center">
                {!isScanning ? (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Click "Start Scanner" to verify credentials using QR code
                    </p>
                    <Button onClick={startCamera} variant="primary">
                      Start Scanner
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="relative inline-block">
                      <video
                        ref={videoRef}
                        className="w-full max-w-md h-64 bg-black rounded-lg"
                        autoPlay
                        muted
                        playsInline
                      />
                      <canvas
                        ref={canvasRef}
                        className="hidden"
                      />
                      
                      {loading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <LoadingSpinner size="lg" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 mb-4">
                      Position the QR code within the camera frame
                    </p>
                    
                    <Button onClick={stopCamera} variant="secondary">
                      Stop Scanner
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!hasCamera && (
              <div className="text-center text-gray-500">
                <p className="mb-2">Camera not available</p>
                <p className="text-sm">Please use manual verification below</p>
              </div>
            )}
          </Card>

          {/* Manual Verification */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Manual Verification</h3>
            
            <form onSubmit={handleManualVerification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="Enter the credential ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <Button type="submit" disabled={loading || !manualId.trim()}>
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify Credential'
                )}
              </Button>
            </form>
          </Card>
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
    </div>
  );
};