import React, { useState } from 'react';
import { useAppSelector } from '../store';
import Layout from '../components/common/Layout';
import Tabs from '../components/ui/Tabs';
import { MembershipPlans } from '../components/payment/MembershipPlans';
import { MembershipStatus } from '../components/payment/MembershipStatus';
import { PaymentHistory } from '../components/payment/PaymentHistory';
import { PaymentForm } from '../components/payment/PaymentForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

export const MembershipPage: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  // const { currentPaymentIntent } = useAppSelector(state => state.payment);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('status');

  // Show payment modal when payment intent is created
  // React.useEffect(() => {
  //   if (currentPaymentIntent) {
  //     setShowPaymentModal(true);
  //   }
  // }, [currentPaymentIntent]);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setActiveTab('status'); // Switch to status tab to see updated membership
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const tabs = [
    {
      id: 'status',
      label: 'My Membership',
      content: <MembershipStatus />
    },
    {
      id: 'plans',
      label: 'Available Plans',
      content: <MembershipPlans userRole={user?.role} />
    },
    {
      id: 'history',
      label: 'Payment History',
      content: <PaymentHistory />
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Membership Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your subscription, review your payment history and explore available plans.
            </p>
          </div>

          {/* Welcome Message for New Users */}
          {user && !(user as any).stripeCustomerId && (
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex">
                <svg className="h-6 w-6 text-blue-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-blue-900 font-semibold text-lg">
                    Welcome to the Mexican Pickleball Federation!
                  </h3>
                  <p className="text-blue-800 mt-1">
                    To access all platform functionalities, you need an active membership. 
                    Explore our plans and choose the one that best fits your needs.
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      onClick={() => setActiveTab('plans')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      View Available Plans
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow">
            <Tabs
              items={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              className="p-6"
            />
          </div>

          {/* Payment Modal */}
          <Modal
            isOpen={showPaymentModal}
            onClose={handlePaymentCancel}
            title="Process Payment"
            size="lg"
          >
            <div className="p-4">
              <PaymentForm
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </div>
          </Modal>

          {/* Footer Information */}
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Secure Payment
                </h4>
                <p className="text-gray-600 text-sm">
                  All payments are processed securely through Stripe. 
                  We do not store your credit card information.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Support
                </h4>
                <p className="text-gray-600 text-sm">
                  Need help? Contact our support team at 
                  <span className="text-blue-600"> support@pickleballfederation.mx</span>
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Refund Policy
                </h4>
                <p className="text-gray-600 text-sm">
                  You can request a full refund within the first 30 days 
                  from the purchase date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};