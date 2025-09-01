import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Loader,
  DollarSign,
  Calendar,
  Shield
} from 'lucide-react';
import Card from '../ui/Card';
import FormField from '../forms/FormField';
import SelectField from '../forms/SelectField';

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  type: 'tournament_entry' | 'membership' | 'coaching' | 'court_rental';
  tournamentId?: string;
  userId: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'oxxo' | 'spei';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

interface PaymentProcessorProps {
  paymentData: PaymentData;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  paymentData,
  onSuccess,
  onError,
  onCancel
}) => {
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success' | 'error'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'oxxo' | 'spei'>('card');
  const [processingError, setProcessingError] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  
  const [cardData, setCardData] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    saveCard: false
  });

  const [billingData, setBillingData] = useState({
    email: '',
    phone: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    rfc: ''
  });

  // Mock saved payment methods
  const [savedMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2', 
      type: 'card',
      last4: '0005',
      brand: 'mastercard',
      expiryMonth: 8,
      expiryYear: 2024,
      isDefault: false
    }
  ]);

  const formatAmount = (amount: number, currency: string = 'MXN') => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleCardDataChange = (field: string, value: string | boolean) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingDataChange = (field: string, value: string) => {
    setBillingData(prev => ({ ...prev, [field]: value }));
  };

  const validateCardData = () => {
    const errors = [];
    
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
      errors.push('Card number is invalid');
    }
    if (!cardData.expiryMonth || !cardData.expiryYear) {
      errors.push('Expiry date is required');
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      errors.push('CVV is invalid');
    }
    if (!cardData.holderName.trim()) {
      errors.push('Cardholder name is required');
    }
    if (!billingData.email || !billingData.email.includes('@')) {
      errors.push('Valid email is required');
    }
    
    return errors;
  };

  const processPayment = async () => {
    setStep('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock success/failure
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        const mockTransactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setTransactionId(mockTransactionId);
        setStep('success');
        
        setTimeout(() => {
          onSuccess(mockTransactionId);
        }, 2000);
      } else {
        throw new Error('Payment was declined by your bank');
      }
    } catch (error) {
      setProcessingError(error instanceof Error ? error.message : 'Payment failed');
      setStep('error');
    }
  };

  const handleSubmit = () => {
    if (selectedMethod === 'card') {
      const errors = validateCardData();
      if (errors.length > 0) {
        setProcessingError(errors[0]);
        return;
      }
    }
    
    processPayment();
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/.{1,4}/g);
    const match = matches && matches.length > 0 ? matches.join(' ') : '';
    if (match.length < value.length) return match;
    return value;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'oxxo':
        return <DollarSign className="h-5 w-5" />;
      case 'spei':
        return <Calendar className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  if (step === 'processing') {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center">
          <Loader className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
          <p className="text-gray-600 mb-4">Please wait while we process your payment securely...</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm text-gray-500">Do not close this window</p>
        </div>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center">
          <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">{paymentData.description}</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">{formatAmount(paymentData.amount)}</p>
            <p className="text-green-600 text-sm">Transaction ID: {transactionId}</p>
          </div>
          <p className="text-sm text-gray-500">A confirmation email has been sent to you.</p>
        </div>
      </Card>
    );
  }

  if (step === 'error') {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-16 w-16 text-red-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h3>
          <p className="text-red-600 mb-6">{processingError}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setStep('method')}
              className="btn-primary"
            >
              Try Again
            </button>
            <button
              onClick={onCancel}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Payment Summary */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Payment Summary</h2>
            <p className="text-gray-600">{paymentData.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatAmount(paymentData.amount)}</p>
            <p className="text-sm text-gray-500">MXN</p>
          </div>
        </div>
      </Card>

      {step === 'method' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
          
          {/* Saved Payment Methods */}
          {savedMethods.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Saved Methods</h4>
              <div className="space-y-3">
                {savedMethods.map((method) => (
                  <div key={method.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            {method.brand?.toUpperCase()} ****{method.last4}
                          </p>
                          <p className="text-sm text-gray-500">
                            Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Default</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Or use a different method:</p>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setSelectedMethod('card')}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center">
                <CreditCard className="h-8 w-8 mb-2 text-gray-600" />
                <span className="text-sm font-medium">Credit/Debit Card</span>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedMethod('oxxo')}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedMethod === 'oxxo'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center">
                <DollarSign className="h-8 w-8 mb-2 text-gray-600" />
                <span className="text-sm font-medium">OXXO</span>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedMethod('spei')}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedMethod === 'spei'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center">
                <Calendar className="h-8 w-8 mb-2 text-gray-600" />
                <span className="text-sm font-medium">SPEI Transfer</span>
              </div>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('details')}
              className="flex-1 btn-primary"
            >
              Continue
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {step === 'details' && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            {getPaymentMethodIcon(selectedMethod)}
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedMethod === 'card' ? 'Card Details' :
               selectedMethod === 'oxxo' ? 'OXXO Payment' : 'SPEI Transfer'}
            </h3>
          </div>

          {selectedMethod === 'card' && (
            <div className="space-y-6">
              {/* Card Information */}
              <div className="space-y-4">
                <FormField
                  name="cardNumber"
                  label="Card Number"
                  type="text"
                  value={cardData.number}
                  onChange={(value) => handleCardDataChange('number', formatCardNumber(value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    name="expiryMonth"
                    label="Expiry Month"
                    value={cardData.expiryMonth}
                    onChange={(value) => handleCardDataChange('expiryMonth', value)}
                    options={Array.from({ length: 12 }, (_, i) => ({
                      value: (i + 1).toString().padStart(2, '0'),
                      label: (i + 1).toString().padStart(2, '0')
                    }))}
                  />
                  
                  <SelectField
                    name="expiryYear"
                    label="Expiry Year"
                    value={cardData.expiryYear}
                    onChange={(value) => handleCardDataChange('expiryYear', value)}
                    options={Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return { value: year.toString(), label: year.toString() };
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="cvv"
                    label="CVV"
                    type="text"
                    value={cardData.cvv}
                    onChange={(value) => handleCardDataChange('cvv', value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="123"
                    maxLength={4}
                  />
                  
                  <FormField
                    name="holderName"
                    label="Cardholder Name"
                    type="text"
                    value={cardData.holderName}
                    onChange={(value) => handleCardDataChange('holderName', value.toUpperCase())}
                    placeholder="JOHN DOE"
                  />
                </div>
              </div>

              {/* Billing Information */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Billing Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    name="email"
                    label="Email"
                    type="email"
                    value={billingData.email}
                    onChange={(value) => handleBillingDataChange('email', value)}
                    placeholder="your@email.com"
                  />
                  
                  <FormField
                    name="phone"
                    label="Phone"
                    type="tel"
                    value={billingData.phone}
                    onChange={(value) => handleBillingDataChange('phone', value)}
                    placeholder="+52 55 1234 5678"
                  />
                  
                  <FormField
                    name="name"
                    label="Full Name"
                    type="text"
                    value={billingData.name}
                    onChange={(value) => handleBillingDataChange('name', value)}
                    placeholder="John Doe"
                  />
                  
                  <FormField
                    name="rfc"
                    label="RFC (Optional)"
                    type="text"
                    value={billingData.rfc}
                    onChange={(value) => handleBillingDataChange('rfc', value.toUpperCase())}
                    placeholder="ABCD123456ABC"
                  />
                </div>
              </div>

              {/* Save Card Option */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={cardData.saveCard}
                  onChange={(e) => handleCardDataChange('saveCard', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="saveCard" className="text-sm text-gray-700">
                  Save this card for future payments
                </label>
              </div>
            </div>
          )}

          {selectedMethod === 'oxxo' && (
            <div className="text-center py-8">
              <DollarSign className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Pay at OXXO</h4>
              <p className="text-gray-600 mb-4">
                You will receive a payment reference to pay at any OXXO store.
              </p>
              <p className="text-sm text-gray-500">
                Payment must be completed within 3 days.
              </p>
            </div>
          )}

          {selectedMethod === 'spei' && (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">SPEI Bank Transfer</h4>
              <p className="text-gray-600 mb-4">
                You will receive bank account details to complete the transfer.
              </p>
              <p className="text-sm text-gray-500">
                Transfers are usually processed within 30 minutes.
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
            <Shield className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800">
              Your payment information is secured with 256-bit SSL encryption
            </p>
          </div>

          {processingError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-800">{processingError}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('method')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Pay {formatAmount(paymentData.amount)}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PaymentProcessor;