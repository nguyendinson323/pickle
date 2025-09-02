import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import subscriptionSlice from '../../store/subscriptionSlice';
import authSlice from '../../store/authSlice';

// Extended render function that includes providers
const AllTheProviders = ({ children, store }: { children: React.ReactNode; store?: any }) => {
  const testStore = store || configureStore({
    reducer: {
      subscription: subscriptionSlice,
      auth: authSlice,
    }
  });

  return (
    <Provider store={testStore}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { store?: any }
) => {
  const { store, ...renderOptions } = options || {};
  
  return render(ui, { 
    wrapper: ({ children }) => <AllTheProviders store={store}>{children}</AllTheProviders>,
    ...renderOptions 
  });
};

// Create mock store with default state
export const createMockStore = (preloadedState: any = {}) => {
  return configureStore({
    reducer: {
      subscription: subscriptionSlice,
      auth: authSlice,
    },
    preloadedState
  });
};

// Mock Stripe elements
export const mockStripeElements = {
  create: vi.fn(() => ({
    mount: vi.fn(),
    destroy: vi.fn(),
    on: vi.fn(),
    update: vi.fn(),
  })),
  getElement: vi.fn(),
};

export const mockStripe = {
  elements: vi.fn(() => mockStripeElements),
  createToken: vi.fn(),
  createSource: vi.fn(),
  createPaymentMethod: vi.fn(),
  confirmCardPayment: vi.fn(),
  confirmCardSetup: vi.fn(),
  paymentRequest: vi.fn(),
  redirectToCheckout: vi.fn(),
};

// Fill Stripe test card helper
export const fillStripeTestCard = async (page: any) => {
  // This would be used in E2E tests with Playwright
  const cardNumber = '4242424242424242';
  const expiryDate = '12/25';
  const cvc = '123';
  
  await page.fill('[data-testid="card-number"]', cardNumber);
  await page.fill('[data-testid="card-expiry"]', expiryDate);
  await page.fill('[data-testid="card-cvc"]', cvc);
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };