import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMembershipPlans, createPaymentIntent } from '../../store/paymentSlice';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface MembershipPlansProps {
  userRole?: string;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({ userRole }) => {
  const dispatch = useAppDispatch();
  const { membershipPlans, loading, error } = useAppSelector(state => state.payment);
  const { user } = useAppSelector(state => state.auth);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [billingType, setBillingType] = useState<'monthly' | 'annual'>('annual');

  useEffect(() => {
    dispatch(fetchMembershipPlans({ role: userRole || user?.role }));
  }, [dispatch, userRole, user?.role]);

  const handleSelectPlan = async (planId: number) => {
    if (!user) return;
    
    setSelectedPlan(planId);
    try {
      await dispatch(createPaymentIntent({
        membershipPlanId: planId,
        billingType,
        currency: 'mxn'
      })).unwrap();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setSelectedPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const calculateDiscount = (annual: number, monthly: number) => {
    const annualTotal = annual;
    const monthlyTotal = monthly * 12;
    const discount = ((monthlyTotal - annualTotal) / monthlyTotal) * 100;
    return Math.round(discount);
  };

  if (loading && membershipPlans.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error al cargar los planes</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3"
          onClick={() => dispatch(fetchMembershipPlans({ role: userRole || user?.role }))}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  const filteredPlans = membershipPlans.filter(plan => 
    plan.isActive && (!userRole || plan.role === userRole || plan.role === user?.role)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Planes de Membresía
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades. Todos los planes incluyen IVA.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingType('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingType === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingType('annual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingType === 'annual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Anual
            <Badge variant="success" className="ml-2">
              Ahorra hasta 20%
            </Badge>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const price = billingType === 'annual' ? plan.annualFee : plan.monthlyFee;
          const discount = billingType === 'annual' 
            ? calculateDiscount(plan.annualFee, plan.monthlyFee)
            : 0;
          const isPremium = plan.planType === 'premium';
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${
                isPremium 
                  ? 'border-blue-200 shadow-lg scale-105' 
                  : 'border-gray-200'
              }`}
            >
              {isPremium && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="primary" className="bg-blue-500">
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(price)}
                    </span>
                    <span className="text-gray-500 ml-2">
                      /{billingType === 'annual' ? 'año' : 'mes'}
                    </span>
                  </div>
                  {billingType === 'annual' && discount > 0 && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      Ahorras {discount}% vs. mensual
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.description && (
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                )}

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={selectedPlan === plan.id || loading}
                  variant={isPremium ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {selectedPlan === plan.id ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      Procesando...
                    </>
                  ) : (
                    'Seleccionar Plan'
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  IVA (16%) incluido • Pago seguro con Stripe
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredPlans.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-gray-500 text-lg font-medium">
            No hay planes disponibles
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            Por el momento no hay planes de membresía disponibles para tu rol.
          </p>
        </div>
      )}
    </div>
  );
};