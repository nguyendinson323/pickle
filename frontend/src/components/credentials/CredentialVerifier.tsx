import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { QRScanner } from './QRScanner';
import { LoadingSpinner } from '../common/LoadingSpinner';

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
    photo?: string;
    nrtpLevel?: string;
    clubName?: string;
    rankingPosition?: number;
  };
  reason?: string;
}

interface BulkVerificationResult {
  id: string;
  valid: boolean;
  credential?: any;
  reason?: string;
}

export const CredentialVerifier: React.FC = () => {
  const [activeTab, setActiveTab] = useState('single');
  const [verificationHistory, setVerificationHistory] = useState<VerificationResult[]>([]);
  const [bulkIds, setBulkIds] = useState('');
  const [bulkResults, setBulkResults] = useState<BulkVerificationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'single', label: 'Verificación Individual', count: verificationHistory.length },
    { id: 'bulk', label: 'Verificación Masiva', count: bulkResults.length },
    { id: 'history', label: 'Historial', count: verificationHistory.length }
  ];

  const handleScanResult = (result: VerificationResult) => {
    setVerificationHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const handleBulkVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkIds.trim()) {
      setError('Por favor ingrese los IDs de credenciales');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Parse IDs from text (support multiple formats)
      const ids = bulkIds
        .split(/[\n,;]/)
        .map(id => id.trim())
        .filter(id => id.length > 0);

      if (ids.length === 0) {
        throw new Error('No se encontraron IDs válidos');
      }

      if (ids.length > 50) {
        throw new Error('Máximo 50 credenciales por verificación masiva');
      }

      const response = await fetch('/api/credentials/verify-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ credentialIds: ids })
      });

      if (!response.ok) {
        throw new Error('Error al verificar credenciales');
      }

      const result = await response.json();
      
      if (result.success) {
        setBulkResults(result.data);
        setActiveTab('bulk');
      } else {
        throw new Error(result.error || 'Error al verificar credenciales');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const exportResults = (results: BulkVerificationResult[], format: 'csv' | 'json') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      const headers = ['ID', 'Válida', 'Nombre', 'Tipo', 'Estado', 'Razón'];
      const rows = results.map(r => [
        r.id,
        r.valid ? 'Sí' : 'No',
        r.credential?.fullName || 'N/A',
        r.credential?.userType || 'N/A',
        r.credential?.status || 'N/A',
        r.reason || 'N/A'
      ]);
      
      content = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      filename = `verificacion-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else {
      content = JSON.stringify(results, null, 2);
      filename = `verificacion-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'expired':
        return 'danger';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verificador de Credenciales</h1>
        <p className="mt-2 text-gray-600">
          Verifique la autenticidad y validez de las credenciales de la federación
        </p>
      </div>

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

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'single' && (
          <QRScanner onScanResult={handleScanResult} />
        )}

        {activeTab === 'bulk' && (
          <div className="space-y-6">
            {/* Bulk Verification Form */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Verificación Masiva</h3>
              
              <form onSubmit={handleBulkVerification} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IDs de Credenciales
                  </label>
                  <textarea
                    value={bulkIds}
                    onChange={(e) => setBulkIds(e.target.value)}
                    placeholder="Ingrese los IDs de credenciales, uno por línea o separados por comas..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Máximo 50 credenciales por verificación
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" disabled={loading || !bulkIds.trim()}>
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Verificando...
                      </>
                    ) : (
                      'Verificar Credenciales'
                    )}
                  </Button>
                  
                  {bulkResults.length > 0 && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => exportResults(bulkResults, 'csv')}
                      >
                        Exportar CSV
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => exportResults(bulkResults, 'json')}
                      >
                        Exportar JSON
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Card>

            {/* Bulk Results */}
            {bulkResults.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Resultados de Verificación ({bulkResults.length})
                  </h3>
                  
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-600">
                      Válidas: {bulkResults.filter(r => r.valid).length}
                    </span>
                    <span className="text-red-600">
                      Inválidas: {bulkResults.filter(r => !r.valid).length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bulkResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg ${
                        result.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${result.valid ? 'bg-green-600' : 'bg-red-600'}
                          `}>
                            {result.valid ? (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          
                          <div>
                            <div className="font-medium text-gray-900">
                              {result.credential?.fullName || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">
                              ID: {result.id}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          {result.credential ? (
                            <div className="space-y-1">
                              <Badge variant={getStatusColor(result.credential.status) as any}>
                                {formatStatus(result.credential.status)}
                              </Badge>
                              <div className="text-xs text-gray-500">
                                {result.credential.userType}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-red-600">
                              {result.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Historial de Verificaciones</h3>
            
            {verificationHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-lg mb-2">Sin historial</div>
                <div className="text-sm">
                  Las verificaciones aparecerán aquí conforme las vaya realizando
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {verificationHistory.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      result.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${result.valid ? 'bg-green-600' : 'bg-red-600'}
                        `}>
                          {result.valid ? (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>

                        {result.credential ? (
                          <div>
                            <div className="font-semibold text-gray-900">
                              {result.credential.fullName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {result.credential.federationIdNumber} - {result.credential.stateName}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-semibold text-red-800">
                              Credencial Inválida
                            </div>
                            <div className="text-sm text-red-600">
                              {result.reason}
                            </div>
                          </div>
                        )}
                      </div>

                      {result.credential && (
                        <div className="text-right">
                          <Badge variant={getStatusColor(result.credential.status) as any}>
                            {formatStatus(result.credential.status)}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            Expira: {new Date(result.credential.expirationDate).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};