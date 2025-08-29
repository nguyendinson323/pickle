import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface CredentialCardProps {
  credential: {
    id: string;
    userType: string;
    fullName: string;
    federationIdNumber: string;
    stateName: string;
    nrtpLevel?: string;
    affiliationStatus: string;
    rankingPosition?: number;
    clubName?: string;
    photo?: string;
    issuedDate: string;
    expirationDate: string;
    status: string;
    qrCode?: string;
    verificationCount: number;
    lastVerified?: string;
  };
  showActions?: boolean;
  onDownloadPDF?: () => void;
  onDownloadImage?: () => void;
  onStatusUpdate?: (status: string) => void;
  onRenew?: () => void;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  showActions = false,
  onDownloadPDF,
  onDownloadImage,
  onStatusUpdate,
  onRenew
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'revoked':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAffiliationStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVO':
        return 'success';
      case 'INACTIVO':
        return 'secondary';
      case 'SUSPENDIDO':
        return 'warning';
      case 'PENDIENTE':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getUserTypeLabel = (userType: string) => {
    const labels: Record<string, string> = {
      'player': 'Jugador',
      'coach': 'Entrenador',
      'referee': 'Árbitro',
      'club_admin': 'Administrador de Club'
    };
    return labels[userType] || userType;
  };

  const formatStatus = (status: string) => {
    const labels: Record<string, string> = {
      'active': 'Activa',
      'expired': 'Expirada',
      'suspended': 'Suspendida',
      'revoked': 'Revocada',
      'pending': 'Pendiente'
    };
    return labels[status] || status;
  };

  const isExpiringSoon = () => {
    const expirationDate = new Date(credential.expirationDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expirationDate <= thirtyDaysFromNow;
  };

  const isExpired = () => {
    return new Date(credential.expirationDate) < new Date();
  };

  return (
    <>
      <Card className="p-6 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Photo placeholder */}
            <div className="w-16 h-20 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500">
              {credential.photo ? (
                <img 
                  src={credential.photo} 
                  alt="Foto"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                'FOTO'
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {credential.fullName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="primary" size="sm">
                  {getUserTypeLabel(credential.userType)}
                </Badge>
                <Badge 
                  variant={getAffiliationStatusColor(credential.affiliationStatus) as any}
                  size="sm"
                >
                  {credential.affiliationStatus}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                ID: {credential.federationIdNumber}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-right">
            <div className={`
              inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
              ${getStatusColor(credential.status)}
            `}>
              {formatStatus(credential.status)}
            </div>
            {(isExpiringSoon() || isExpired()) && (
              <div className="text-xs text-red-600 mt-1">
                {isExpired() ? 'Expirada' : 'Expira pronto'}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Estado:</span>
            <div className="text-gray-900">{credential.stateName}</div>
          </div>

          {credential.nrtpLevel && (
            <div>
              <span className="font-medium text-gray-700">Nivel NRTP:</span>
              <div className="text-gray-900">{credential.nrtpLevel}</div>
            </div>
          )}

          {credential.rankingPosition && (
            <div>
              <span className="font-medium text-gray-700">Ranking:</span>
              <div className="text-gray-900">#{credential.rankingPosition}</div>
            </div>
          )}

          {credential.clubName && (
            <div>
              <span className="font-medium text-gray-700">Club:</span>
              <div className="text-gray-900">{credential.clubName}</div>
            </div>
          )}

          <div>
            <span className="font-medium text-gray-700">Emisión:</span>
            <div className="text-gray-900">
              {new Date(credential.issuedDate).toLocaleDateString()}
            </div>
          </div>

          <div>
            <span className="font-medium text-gray-700">Vigencia:</span>
            <div className={`${isExpired() ? 'text-red-600' : isExpiringSoon() ? 'text-yellow-600' : 'text-gray-900'}`}>
              {new Date(credential.expirationDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Verification Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Verificaciones: {credential.verificationCount}
            </div>
            {credential.lastVerified && (
              <div>
                Última verificación: {new Date(credential.lastVerified).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            {credential.qrCode && (
              <Button
                onClick={() => setShowQRModal(true)}
                variant="outline"
                size="sm"
              >
                Ver QR
              </Button>
            )}
            
            {onDownloadPDF && (
              <Button
                onClick={onDownloadPDF}
                variant="outline"
                size="sm"
              >
                PDF
              </Button>
            )}

            {onDownloadImage && (
              <Button
                onClick={onDownloadImage}
                variant="outline"
                size="sm"
              >
                Imagen
              </Button>
            )}
          </div>

          {showActions && (
            <Button
              onClick={() => setShowActionsModal(true)}
              variant="primary"
              size="sm"
            >
              Acciones
            </Button>
          )}
        </div>
      </Card>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Código QR de Credencial"
      >
        <div className="text-center p-6">
          {credential.qrCode ? (
            <div>
              <img 
                src={credential.qrCode}
                alt="QR Code"
                className="mx-auto mb-4 w-48 h-48 border rounded"
              />
              <p className="text-sm text-gray-600">
                Escanea este código para verificar la credencial
              </p>
              <div className="mt-2 text-xs text-gray-500 font-mono">
                ID: {credential.id}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              Código QR no disponible
            </div>
          )}
        </div>
      </Modal>

      {/* Actions Modal */}
      <Modal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        title="Acciones de Credencial"
      >
        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Credencial: {credential.fullName} ({credential.federationIdNumber})
          </div>

          {onStatusUpdate && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cambiar Estado:
              </label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    onStatusUpdate('active');
                    setShowActionsModal(false);
                  }}
                  variant={credential.status === 'active' ? 'primary' : 'outline'}
                  size="sm"
                >
                  Activar
                </Button>
                <Button
                  onClick={() => {
                    onStatusUpdate('suspended');
                    setShowActionsModal(false);
                  }}
                  variant={credential.status === 'suspended' ? 'primary' : 'outline'}
                  size="sm"
                >
                  Suspender
                </Button>
                <Button
                  onClick={() => {
                    onStatusUpdate('revoked');
                    setShowActionsModal(false);
                  }}
                  variant={credential.status === 'revoked' ? 'primary' : 'outline'}
                  size="sm"
                >
                  Revocar
                </Button>
              </div>
            </div>
          )}

          {onRenew && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => {
                  onRenew();
                  setShowActionsModal(false);
                }}
                variant="primary"
                className="w-full"
              >
                Renovar Credencial
              </Button>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              onClick={() => setShowActionsModal(false)}
              variant="outline"
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};