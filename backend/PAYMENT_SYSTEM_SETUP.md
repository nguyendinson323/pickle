# Payment & Membership System Setup Guide

This guide will help you set up the comprehensive Payment & Membership System for the Mexican Pickleball Federation platform.

## Prerequisites

1. **Stripe Account**: Ensure you have a Stripe account set up for Mexico (MXN currency support)
2. **Environment Variables**: Configure the following in your `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_CURRENCY=MXN
   STRIPE_TAX_RATE=0.16
   ```

## Database Setup

### 1. Run Migrations

Execute the following migrations in order:

```bash
# Create subscription plans table
npx sequelize-cli db:migrate --name 20240301000015-create-subscription-plans.js

# Create subscriptions table  
npx sequelize-cli db:migrate --name 20240301000016-create-subscriptions.js

# Create payment methods table
npx sequelize-cli db:migrate --name 20240301000017-create-payment-methods.js

# Update payment model (if needed)
npx sequelize-cli db:migrate --name 20240301000018-update-payments.js

# Seed subscription plans
npx sequelize-cli db:migrate --name 20240901000003-seed-subscription-plans.js
```

### 2. Set up Stripe Products and Prices

After running migrations, execute the setup script to create corresponding Stripe products:

```bash
npm run setup:stripe-products
```

Or manually run:
```bash
npx tsx src/scripts/setupStripeProducts.ts
```

## API Endpoints

### Subscription Management

- `GET /api/subscriptions/plans` - Get all available subscription plans
- `GET /api/subscriptions/current` - Get user's current subscription
- `POST /api/subscriptions/create` - Create new subscription
- `POST /api/subscriptions/cancel` - Cancel subscription
- `POST /api/subscriptions/change-plan` - Change subscription plan
- `POST /api/subscriptions/reactivate` - Reactivate cancelled subscription

### Payment Methods

- `POST /api/payments/setup-intent` - Create setup intent for adding payment method
- `POST /api/payments/payment-methods` - Save payment method
- `GET /api/payments/payment-methods` - Get user's payment methods
- `DELETE /api/payments/payment-methods/:id` - Remove payment method

### Payments

- `POST /api/payments/payment-intent` - Create payment intent
- `POST /api/payments/tournament-payment` - Create tournament entry payment
- `POST /api/payments/booking-payment` - Create court booking payment
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/refund/:id` - Request refund

### Webhooks

- `POST /api/subscriptions/webhook` - Stripe webhook endpoint (comprehensive)
- `POST /api/payments/webhook` - Legacy webhook endpoint

## Stripe Configuration

### Required Webhooks

Configure the following webhook events in your Stripe dashboard:

```
invoice.payment_succeeded
invoice.payment_failed
customer.subscription.updated
customer.subscription.deleted
payment_intent.succeeded
setup_intent.succeeded
payment_method.attached
```

### Products and Pricing

The system creates the following subscription plans:

1. **Plan Básico** ($199 MXN/month)
   - 2 tournament registrations
   - 4 court bookings
   - 10 player matches
   - Basic messaging

2. **Plan Pro** ($399 MXN/month) - Most Popular
   - Unlimited tournament registrations
   - 12 court bookings
   - Unlimited player matches
   - Advanced filters and analytics
   - Priority support

3. **Plan Elite** ($799 MXN/month)
   - All Pro features
   - Tournament organization tools
   - Custom branding
   - API access
   - Dedicated support

4. **Annual Plans** (20-25% discount)
   - Plan Anual Básico
   - Plan Anual Pro

## Testing

### Test Card Numbers

Use Stripe's test card numbers for testing:

```
4242 4242 4242 4242 - Visa (Success)
4000 0000 0000 0002 - Visa (Declined)
4000 0000 0000 3220 - 3D Secure Required
```

### Test Scenarios

1. **Subscription Creation**
   - Create subscription with valid payment method
   - Test payment failure scenarios
   - Test 3D Secure authentication

2. **Payment Method Management**
   - Add/remove payment methods
   - Set default payment method
   - Test expired card scenarios

3. **Webhooks**
   - Test successful payment webhooks
   - Test failed payment webhooks
   - Test subscription lifecycle events

## Error Handling

The system provides comprehensive error handling:

- **Stripe Errors**: Automatically handled and logged
- **Database Errors**: Rolled back transactions
- **Validation Errors**: Clear user-friendly messages
- **Network Errors**: Retry mechanisms for critical operations

## Logging

All payment operations are logged with appropriate levels:

- **Info**: Successful operations, webhook events
- **Warning**: Retryable errors, user validation errors  
- **Error**: Critical failures, webhook processing errors

## Security Considerations

1. **Webhook Verification**: All webhooks are verified using Stripe signatures
2. **User Authorization**: All endpoints require proper authentication
3. **Data Validation**: Input validation on all payment operations
4. **PCI Compliance**: No sensitive card data stored locally
5. **Rate Limiting**: Implement rate limiting on payment endpoints

## Monitoring

Monitor the following metrics:

- Subscription conversion rates
- Payment success/failure rates
- Churn rates
- Revenue metrics
- Webhook processing times

## Support

For issues or questions:

1. Check logs in `logs/payment.log`
2. Review Stripe dashboard for payment details
3. Check database consistency between local and Stripe data
4. Verify webhook endpoint configuration

## Next Steps

1. **Frontend Integration**: Implement Stripe Elements for payment forms
2. **Mobile Integration**: Add mobile-specific payment handling
3. **Advanced Analytics**: Implement revenue and subscription analytics
4. **Localization**: Add additional payment methods for Mexico
5. **Tax Compliance**: Implement Mexican tax requirements (CFDi)

---

**Important**: Always test thoroughly in Stripe's test mode before going live with real payments.