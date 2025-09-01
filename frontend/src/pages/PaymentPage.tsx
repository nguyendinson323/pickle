import React, { useState } from 'react';
import { CreditCard, History, DollarSign, Shield, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import PaymentProcessor from '../components/payment/PaymentProcessor';
import { PaymentHistory } from '../components/payment/PaymentHistory';
import { useAppSelector } from '../store';

type PaymentView = 'processor' | 'history';

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  type: 'tournament_entry' | 'membership' | 'coaching' | 'court_rental';
  tournamentId?: string;
  userId: string;
}

const PaymentPage: React.FC = () => {
  const [activeView, setActiveView] = useState<PaymentView>('processor');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 500,
    currency: 'MXN',
    description: 'Tournament Entry - Copa Nacional 2024',
    type: 'tournament_entry',
    tournamentId: '1',
    userId: '1'
  });
  
  const { user } = useAppSelector(state => state.auth);

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId);
    // Show success message, redirect, or refresh data
    setActiveView('history');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // Show error message
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
    // Handle cancellation
  };

  const navigationItems = [
    {
      key: 'processor' as const,
      label: 'Make Payment',
      icon: CreditCard,
      description: 'Process new payments'
    },
    {
      key: 'history' as const,
      label: 'Payment History',
      icon: History,
      description: 'View past transactions'
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'processor':
        return (
          <PaymentProcessor
            paymentData={paymentData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        );
      case 'history':
        return <PaymentHistory userId={user?.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto mobile-container">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payments</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-full sm:w-fit">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === item.key
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.key === 'processor' ? 'Pay' : 'History'}</span>
              </button>
            );
          })}
        </div>

        {/* Payment Security Notice */}
        <Card className="p-4 mb-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <h3 className="font-medium text-green-800">Secure Payment Processing</h3>
              <p className="text-sm text-green-700 mt-1">
                Your payment information is protected with bank-level security and 256-bit SSL encryption.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Payment Options */}
        {activeView === 'processor' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-green-200"
              onClick={() => setPaymentData({
                amount: 500,
                currency: 'MXN',
                description: 'Tournament Entry - Copa Nacional 2024',
                type: 'tournament_entry',
                tournamentId: '1',
                userId: user?.id || '1'
              })}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zM6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tournament Entry</h3>
                  <p className="text-sm text-gray-600">$500 MXN</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Register for Copa Nacional 2024</p>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-green-200"
              onClick={() => setPaymentData({
                amount: 1200,
                currency: 'MXN',
                description: 'Premium Membership 2024',
                type: 'membership',
                userId: user?.id || '1'
              })}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Premium Membership</h3>
                  <p className="text-sm text-gray-600">$1,200 MXN</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Annual premium membership</p>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-green-200"
              onClick={() => setPaymentData({
                amount: 200,
                currency: 'MXN',
                description: 'Court Rental - Club Roma Court 1',
                type: 'court_rental',
                userId: user?.id || '1'
              })}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Court Rental</h3>
                  <p className="text-sm text-gray-600">$200 MXN</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">2 hours at Club Roma</p>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {renderContent()}
        </div>

        {/* Payment Methods Info */}
        {activeView === 'processor' && (
          <Card className="p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted Payment Methods</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Credit & Debit Cards</p>
                  <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">OXXO</p>
                  <p className="text-sm text-gray-600">Pay in cash at any OXXO store</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">SPEI Transfer</p>
                  <p className="text-sm text-gray-600">Direct bank transfer</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;