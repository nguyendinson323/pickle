import stripeService from '../services/stripeService';
import SubscriptionPlan from '../models/SubscriptionPlan';
import logger from '../utils/logger';

/**
 * Script to create Stripe products and prices for our subscription plans
 * This should be run after seeding the subscription plans to ensure
 * Stripe products and prices are created and linked properly
 */
async function setupStripeProducts() {
  try {
    logger.info('Starting Stripe products setup...');

    const plans = await SubscriptionPlan.findAll({ where: { isActive: true } });

    for (const plan of plans) {
      logger.info(`Processing plan: ${plan.name}`);

      // Check if product already exists in Stripe
      let stripeProduct;
      try {
        stripeProduct = await stripeService.stripe.products.retrieve(plan.stripeProductId);
        logger.info(`Product ${plan.stripeProductId} already exists`);
      } catch (error: any) {
        if (error.code === 'resource_missing') {
          // Create product if it doesn't exist
          stripeProduct = await stripeService.createProduct(
            plan.name,
            plan.description
          );
          
          // Update the plan with the new product ID
          await plan.update({ stripeProductId: stripeProduct.id });
          logger.info(`Created new product: ${stripeProduct.id}`);
        } else {
          throw error;
        }
      }

      // Check if price already exists
      let stripePrice;
      try {
        stripePrice = await stripeService.stripe.prices.retrieve(plan.stripePriceId);
        logger.info(`Price ${plan.stripePriceId} already exists`);
      } catch (error: any) {
        if (error.code === 'resource_missing') {
          // Create price if it doesn't exist
          stripePrice = await stripeService.createPrice(
            stripeProduct.id,
            plan.amount,
            plan.currency.toLowerCase(),
            plan.interval as 'month' | 'year'
          );
          
          // Update the plan with the new price ID
          await plan.update({ stripePriceId: stripePrice.id });
          logger.info(`Created new price: ${stripePrice.id}`);
        } else {
          throw error;
        }
      }

      logger.info(`✅ Completed setup for plan: ${plan.name}`);
    }

    logger.info('🎉 All Stripe products and prices have been set up successfully!');
  } catch (error) {
    logger.error('Error setting up Stripe products:', error);
    throw error;
  }
}

// Run the script if called directly
if (require.main === module) {
  setupStripeProducts()
    .then(() => {
      logger.info('Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Setup failed:', error);
      process.exit(1);
    });
}

export default setupStripeProducts;