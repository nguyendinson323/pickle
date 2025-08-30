# Step 4: Membership Management and Payment Integration

## Overview
This step implements the complete membership management system with Stripe payment integration, handles annual membership fees, premium plan upgrades, automatic renewals, and invoice generation. It includes membership status tracking, payment history, and renewal notifications for all user types.
Don't use any mockup data for frontend.
Do use only database data from backend.
Before rendering a page, all required data for the page should be prepared from backend through API endpoint to store on Redux.
For each page, you must accurately determine whether the functionalities of all dynamic elements, including buttons, are correctly integrated with the backend and accurately reflected in Redux to ensure real-time updates.
There are already data seeded to test in database .
You need to test with only this database seeded data from backend.
Don't use any mockup, simulation or random data for frontend.

## Objectives
- Integrate Stripe payment gateway for all transactions
- Implement membership plan management and subscriptions
- Create payment processing for registration and renewals
- Build invoice generation and management system
- Add payment history and financial reporting
- Implement automatic renewal and reminder systems
- Create premium feature access control

## Payment Types in System
1. **Annual Membership Fees** - Required for all users
2. **Premium Plan Upgrades** - Enhanced features for players/coaches
3. **Tournament Registration Fees** - Per tournament entry
4. **Court Rental Payments** - Hourly court bookings
5. **Certification Course Fees** - Coach training programs

## Backend Development Tasks

### 1. Stripe Integration Setup
**Files to Create:**
- `src/services/stripeService.ts` - Stripe API integration
- `src/config/stripe.ts` - Stripe configuration
- `src/middleware/stripeWebhook.ts` - Webhook handling

**Stripe Service Methods:**
```typescript
// Core payment methods
createPaymentIntent(amount: number, currency: string, metadata: any): Promise<PaymentIntent>
confirmPayment(paymentIntentId: string): Promise<PaymentIntent>
refundPayment(paymentIntentId: string, amount?: number): Promise<Refund>

// Customer management
createStripeCustomer(user: User): Promise<Customer>
updateStripeCustomer(customerId: string, data: any): Promise<Customer>
getCustomer(customerId: string): Promise<Customer>

// Subscription management
createSubscription(customerId: string, priceId: string): Promise<Subscription>
updateSubscription(subscriptionId: string, data: any): Promise<Subscription>
cancelSubscription(subscriptionId: string): Promise<Subscription>
```

### 2. Payment Controllers
**Files to Create:**
- `src/controllers/paymentController.ts` - Payment processing endpoints
- `src/controllers/membershipController.ts` - Membership management
- `src/controllers/invoiceController.ts` - Invoice management
- `src/services/paymentService.ts` - Payment business logic
- `src/services/membershipService.ts` - Membership logic
- `src/services/invoiceService.ts` - Invoice generation

**Payment Methods:**
- `createPayment()` - Initialize payment process
- `processPayment()` - Handle payment completion
- `handleWebhook()` - Process Stripe webhooks
- `getPaymentHistory()` - User payment history
- `refundPayment()` - Process refunds

### 3. Membership Management
**Files to Create:**
- `src/services/membershipService.ts` - Membership business logic
- `src/jobs/membershipRenewal.ts` - Automated renewal tasks
- `src/jobs/expirationNotifications.ts` - Reminder notifications

**Membership Methods:**
- `assignMembership()` - Assign membership after payment
- `upgradeMembership()` - Upgrade to premium plan
- `renewMembership()` - Handle membership renewal
- `checkExpiringMemberships()` - Find expiring memberships
- `sendRenewalNotifications()` - Send renewal reminders

### 4. Invoice System
**Files to Create:**
- `src/services/invoiceService.ts` - Invoice generation
- `src/templates/invoiceTemplate.ts` - PDF invoice template
- `src/utils/pdfGenerator.ts` - PDF generation utilities

**Invoice Methods:**
- `generateInvoice()` - Create invoice for payment
- `downloadInvoice()` - Get invoice PDF
- `sendInvoiceEmail()` - Email invoice to user
- `getInvoiceHistory()` - User invoice history

### 5. API Endpoints
```
Payment Endpoints:
POST /api/payments/create-intent
POST /api/payments/confirm
GET /api/payments/history
POST /api/payments/refund/:id
POST /api/stripe/webhook

Membership Endpoints:
GET /api/membership/plans
GET /api/membership/my-membership
POST /api/membership/purchase
POST /api/membership/upgrade
POST /api/membership/renew
GET /api/membership/expiring

Invoice Endpoints:
GET /api/invoices
GET /api/invoices/:id
GET /api/invoices/:id/pdf
POST /api/invoices/:id/email
```

### 6. Webhook Handling
**Stripe Webhook Events:**
- `payment_intent.succeeded` - Payment completed
- `payment_intent.payment_failed` - Payment failed
- `invoice.payment_succeeded` - Subscription payment
- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Subscription cancelled

## Frontend Development Tasks

### 1. Payment Components
**Files to Create:**
- `src/components/payments/PaymentForm.tsx` - Stripe Elements form
- `src/components/payments/PaymentMethod.tsx` - Payment method selector
- `src/components/payments/PaymentHistory.tsx` - Payment history display
- `src/components/payments/InvoiceList.tsx` - Invoice management
- `src/components/payments/RefundRequest.tsx` - Refund request form

### 2. Membership Components
**Files to Create:**
- `src/components/membership/MembershipPlans.tsx` - Plan selection
- `src/components/membership/MembershipStatus.tsx` - Status display
- `src/components/membership/UpgradePrompt.tsx` - Premium upgrade
- `src/components/membership/RenewalNotice.tsx` - Renewal reminder
- `src/components/membership/PlanComparison.tsx` - Feature comparison

### 3. Checkout Components
**Files to Create:**
- `src/components/checkout/CheckoutFlow.tsx` - Multi-step checkout
- `src/components/checkout/OrderSummary.tsx` - Order details
- `src/components/checkout/PaymentSuccess.tsx` - Success confirmation
- `src/components/checkout/PaymentError.tsx` - Error handling

### 4. Pages
**Files to Create:**
- `src/pages/membership/MembershipPage.tsx` - Membership management
- `src/pages/membership/UpgradePage.tsx` - Premium upgrade
- `src/pages/payments/PaymentHistoryPage.tsx` - Payment history
- `src/pages/invoices/InvoicesPage.tsx` - Invoice management
- `src/pages/checkout/CheckoutPage.tsx` - Payment checkout

### 5. Redux State Management
**Files to Create:**
- `src/store/paymentSlice.ts` - Payment state
- `src/store/membershipSlice.ts` - Membership state
- `src/store/invoiceSlice.ts` - Invoice state

### 6. Services
**Files to Create:**
- `src/services/paymentService.ts` - Payment API calls
- `src/services/membershipService.ts` - Membership API calls
- `src/services/stripeClientService.ts` - Stripe client integration

## Type Definitions

### Backend Types
```typescript
// types/payment.ts
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  referenceId: number;
  referenceType: string;
  userId: number;
  status: PaymentStatus;
  stripePaymentIntentId: string;
  metadata: any;
}

export interface MembershipPlan {
  id: number;
  name: string;
  role: UserRole;
  planType: PlanType;
  annualFee: number;
  features: string[];
  stripePriceId: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  userId: number;
  paymentId: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  pdfUrl?: string;
  issueDate: string;
  dueDate: string;
}
```

### Frontend Types
```typescript
// types/payment.ts
export interface PaymentState {
  paymentMethods: PaymentMethod[];
  paymentHistory: Payment[];
  currentPayment: PaymentIntent | null;
  isProcessing: boolean;
  error: string | null;
}

export interface MembershipState {
  plans: MembershipPlan[];
  currentMembership: Membership | null;
  expirationDate: string | null;
  isExpiring: boolean;
  canUpgrade: boolean;
}

export interface CheckoutState {
  selectedPlan: MembershipPlan | null;
  paymentMethod: string | null;
  step: CheckoutStep;
  isProcessing: boolean;
  error: string | null;
}
```

## Stripe Integration Details

### 1. Client-Side Integration
```typescript
// Stripe Elements Setup
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (event) => {
    // Handle payment confirmation
  };
};
```

### 2. Server-Side Integration
```typescript
// Create Payment Intent
const createPaymentIntent = async (req, res) => {
  const { amount, paymentType, referenceId } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'mxn',
    metadata: {
      userId: req.user.id,
      paymentType,
      referenceId
    }
  });
  
  res.json({
    clientSecret: paymentIntent.client_secret
  });
};
```

## Membership Plan Structure

### Player Plans
```javascript
{
  basic: {
    name: "Jugador Básico",
    price: 500.00, // MXN annually
    features: [
      "Registro en federación",
      "Credencial digital",
      "Participación en torneos",
      "Acceso a rankings",
      "Soporte básico"
    ]
  },
  premium: {
    name: "Jugador Premium",
    price: 1200.00, // MXN annually  
    features: [
      "Todo lo del plan básico",
      "Buscador de jugadores",
      "Reservas prioritarias",
      "Estadísticas avanzadas",
      "Soporte prioritario"
    ]
  }
}
```

### Club Plans
```javascript
{
  basic: {
    name: "Club Básico",
    price: 2000.00, // MXN annually
    features: [
      "Afiliación a federación",
      "Gestión de miembros",
      "Micrositio básico",
      "Comunicaciones",
      "Reportes básicos"
    ]
  },
  premium: {
    name: "Club Premium",
    price: 5000.00, // MXN annually
    features: [
      "Todo lo del plan básico",
      "Gestión de canchas",
      "Creación de torneos",
      "Sistema de reservas",
      "Analytics avanzados",
      "Micrositio premium"
    ]
  }
}
```

## Payment Flow Specifications

### 1. Registration Payment Flow
```
User Registration → Plan Selection → Payment Form → 
Payment Processing → Account Activation → Welcome Email
```

### 2. Renewal Payment Flow
```
Expiration Reminder → Renewal Notice → Payment Form → 
Payment Processing → Membership Extension → Confirmation
```

### 3. Premium Upgrade Flow
```
Current Plan → Upgrade Options → Price Calculation → 
Payment Form → Plan Upgrade → Feature Activation
```

## Invoice Generation

### Invoice Template Structure
```
┌─────────────────────────────────────────────────┐
│ FEDERACIÓN MEXICANA DE PICKLEBALL              │
│ Logo                                Invoice #123 │
│                                                 │
│ Bill To:                           Issue Date:   │
│ [User Name]                        [Date]       │
│ [Address]                          Due Date:     │
│                                   [Date]        │
│                                                 │
│ Description              Qty    Price   Amount  │
│ ─────────────────────────────────────────────── │
│ Membresía Anual Jugador   1     $500    $500   │
│                                                 │
│                           Subtotal:     $500    │
│                           Tax (16%):    $80     │
│                           Total:        $580    │
│                                                 │
│ Payment Method: Credit Card ending in 4242      │
│ Transaction ID: pi_1234567890                   │
└─────────────────────────────────────────────────┘
```

## Email Notification Templates

### Payment Confirmation Email
```html
<h2>Pago Confirmado - Federación Mexicana de Pickleball</h2>
<p>Estimado/a [User Name],</p>
<p>Su pago ha sido procesado exitosamente.</p>

<div class="payment-details">
  <h3>Detalles del Pago</h3>
  <p><strong>Concepto:</strong> [Payment Description]</p>
  <p><strong>Monto:</strong> $[Amount] MXN</p>
  <p><strong>Fecha:</strong> [Date]</p>
  <p><strong>Método:</strong> [Payment Method]</p>
</div>

<p>Su membresía está activa hasta: [Expiration Date]</p>
<p><a href="[Invoice URL]" class="button">Descargar Factura</a></p>
```

### Renewal Reminder Email
```html
<h2>Renovación de Membresía - Federación Mexicana de Pickleball</h2>
<p>Estimado/a [User Name],</p>
<p>Su membresía vence el [Expiration Date]. Renuévela ahora para seguir disfrutando de todos los beneficios.</p>

<div class="renewal-details">
  <h3>Su Plan Actual</h3>
  <p><strong>Plan:</strong> [Plan Name]</p>
  <p><strong>Costo de Renovación:</strong> $[Amount] MXN</p>
</div>

<p><a href="[Renewal URL]" class="button">Renovar Ahora</a></p>
```

## Testing Requirements

### Backend Testing
```bash
# Test payment creation
curl -X POST http://localhost:5000/api/payments/create-intent \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 500, "paymentType": "membership", "planId": 1}'

# Test membership assignment
curl -X GET http://localhost:5000/api/membership/my-membership \
  -H "Authorization: Bearer <token>"

# Test invoice generation
curl -X GET http://localhost:5000/api/invoices/1/pdf \
  -H "Authorization: Bearer <token>"
```

### Frontend Testing
- Test payment form with Stripe test cards
- Verify membership plan selection
- Test payment success/error flows
- Verify invoice download
- Test premium feature access

### Stripe Test Cards
```
Success: 4242424242424242
Decline: 4000000000000002
Insufficient Funds: 4000000000009995
```

## Security Considerations

### Payment Security
- Never store sensitive payment data
- Use Stripe Elements for PCI compliance
- Validate all payments server-side
- Implement proper webhook validation
- Log all payment activities

### Access Control
- Premium features require active premium membership
- Expired memberships have limited access
- Payment history requires authentication
- Invoice access restricted to owners

## Error Handling

### Payment Errors
- Insufficient funds
- Card declined
- Network errors
- Stripe service issues
- Webhook validation failures

### Membership Errors
- Expired membership access
- Plan upgrade conflicts
- Renewal processing failures
- Feature access denials

## Environment Variables

### Backend
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
INVOICE_STORAGE_PATH=/app/invoices
PDF_GENERATOR_SERVICE=puppeteer
EMAIL_FROM=noreply@pickleballfed.mx
```

### Frontend
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Success Criteria
✅ Stripe payment integration works correctly
✅ Membership plans can be purchased
✅ Premium upgrades function properly
✅ Payment history displays accurately
✅ Invoices generate and download
✅ Renewal notifications are sent
✅ Webhook handling processes events
✅ Payment failures are handled gracefully
✅ Refunds can be processed
✅ Premium features are access-controlled
✅ Email notifications are sent
✅ Mobile payment flow works

## Commands to Test
```bash
# Start with Stripe CLI for webhook testing
stripe listen --forward-to localhost:5000/api/stripe/webhook

# Test payment flow
npm run test:payments

# Generate test invoice
npm run generate-invoice 1

# Send test renewal reminder
npm run send-renewal-reminders

# Check membership status
curl -X GET http://localhost:5000/api/membership/my-membership
```

## Next Steps
After completing this step, you should have:
- Complete payment processing system
- Membership management with renewals
- Invoice generation and management
- Premium feature access control
- Email notification system
- Financial reporting capabilities

The next step will focus on court management and reservation systems for clubs and partners.