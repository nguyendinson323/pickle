import apiService from './api';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'oxxo' | 'spei';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  type: 'tournament_entry' | 'membership' | 'coaching' | 'court_rental';
  userId: string;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
}

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'completed' | 'pending' | 'failed';
  message?: string;
  paymentUrl?: string; // For OXXO or SPEI
}

class PaymentService {
  private baseUrl = '/api/payments';

  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Create payment intent using your real backend API
      const intentData = await apiService.post('/payments/payment-intent', {
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        description: paymentRequest.description,
        type: paymentRequest.type,
        metadata: paymentRequest.metadata
      });
      
      if (!intentData.success) {
        throw new Error(intentData.error || 'Failed to create payment intent');
      }

      // Confirm payment using your real backend API
      const confirmData = await apiService.post(`/payments/confirm/${intentData.paymentIntentId}`, {
        paymentMethodId: paymentRequest.paymentMethodId
      });
      
      return {
        success: confirmData.success,
        transactionId: confirmData.transactionId || intentData.paymentIntentId,
        status: confirmData.status || (confirmData.success ? 'completed' : 'failed'),
        message: confirmData.message || (confirmData.success ? 'Payment processed successfully' : 'Payment failed')
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Payment processing failed');
    }
  }

  async processOXXOPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const referenceNumber = `OXXO${Date.now().toString().slice(-8)}`;
      
      return {
        success: true,
        transactionId: referenceNumber,
        status: 'pending',
        message: 'OXXO payment reference generated',
        paymentUrl: `/oxxo-payment/${referenceNumber}`
      };
    } catch (error) {
      throw new Error('OXXO payment generation failed');
    }
  }

  async processSPEIPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const clapNumber = `SPEI${Date.now().toString().slice(-10)}`;
      
      return {
        success: true,
        transactionId: clapNumber,
        status: 'pending',
        message: 'SPEI transfer details generated',
        paymentUrl: `/spei-payment/${clapNumber}`
      };
    } catch (error) {
      throw new Error('SPEI payment generation failed');
    }
  }

  async savePaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    try {
      // Mock saving payment method
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMethod: PaymentMethod = {
        id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...paymentMethod
      };
      
      return newMethod;
    } catch (error) {
      throw new Error('Failed to save payment method');
    }
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      // Mock getting saved payment methods
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        {
          id: 'pm_1',
          type: 'card',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        },
        {
          id: 'pm_2',
          type: 'card',
          last4: '0005',
          brand: 'mastercard',
          expiryMonth: 8,
          expiryYear: 2024,
          isDefault: false
        }
      ];
    } catch (error) {
      throw new Error('Failed to load payment methods');
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      // Mock deleting payment method
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      throw new Error('Failed to delete payment method');
    }
  }

  async refundPayment(transactionId: string, reason?: string): Promise<PaymentResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        transactionId: `rf_${transactionId}`,
        status: 'completed',
        message: 'Refund processed successfully'
      };
    } catch (error) {
      throw new Error('Refund processing failed');
    }
  }

  async getPaymentHistory(userId: string, options?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }): Promise<{
    payments: any[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const data = await apiService.get('/payments/history', {
        page: options?.page,
        limit: options?.limit,
        status: options?.status,
        type: options?.type
      });
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load payment history');
      }

      return {
        payments: data.payments || [],
        total: data.total || 0,
        hasMore: data.hasMore || false
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to load payment history');
    }
  }

  async generateInvoice(paymentId: string): Promise<Blob> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock PDF generation - in real implementation, would generate actual PDF
      const mockPdfContent = `Invoice for Payment ID: ${paymentId}`;
      const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
      
      return blob;
    } catch (error) {
      throw new Error('Failed to generate invoice');
    }
  }

  // Utility methods for formatting
  formatAmount(amount: number, currency: string = 'MXN'): string {
    const finalAmount = amount > 1000 && amount % 1 === 0 ? amount / 100 : amount;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency
    }).format(finalAmount);
  }

  validateCardNumber(cardNumber: string): boolean {
    // Basic Luhn algorithm implementation
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }
    
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  }

  getCardBrand(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6/.test(cleaned)) return 'discover';
    
    return 'unknown';
  }
}

export const paymentService = new PaymentService();
export default paymentService;

export type {
  PaymentMethod,
  PaymentRequest,
  PaymentResponse
};