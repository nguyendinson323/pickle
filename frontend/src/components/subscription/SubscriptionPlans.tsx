import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchSubscriptionPlans, 
  createSubscription, 
  fetchCurrentSubscription 
} from '../../store/subscriptionSlice';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import { CheckIcon } from '@heroicons/react/24/solid';
import type { SubscriptionPlan } from '../../store/subscriptionSlice';

interface SubscriptionPlansProps {
  onPlanSelected?: (plan: SubscriptionPlan) => void;
  showCurrentPlan?: boolean;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  onPlanSelected, 
  showCurrentPlan = true 
}) => {
  const dispatch = useAppDispatch();
  const { 
    plans, 
    currentSubscription, 
    loading, 
    error 
  } = useAppSelector(state => state.subscription);
  const { user } = useAppSelector(state => state.auth);
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
    if (user) {
      dispatch(fetchCurrentSubscription());
    }
  }, [dispatch, user]);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (!user) return;
    
    setSelectedPlan(plan.id);
    try {
      await dispatch(createSubscription({
        planId: plan.id
      })).unwrap();
      
      if (onPlanSelected) {
        onPlanSelected(plan);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      setSelectedPlan(null);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const getFilteredPlans = () => {
    return plans
      .filter(plan => 
        plan.isActive && 
        plan.interval === (billingType === 'yearly' ? 'year' : 'month')
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const calculateSavings = (yearlyPlan: SubscriptionPlan) => {
    const monthlyEquivalent = plans.find(p => 
      p.name.includes('Básico') === yearlyPlan.name.includes('Básico') &&
      p.name.includes('Pro') === yearlyPlan.name.includes('Pro') &&
      p.name.includes('Elite') === yearlyPlan.name.includes('Elite') &&
      p.interval === 'month'
    );
    
    if (!monthlyEquivalent) return 0;
    
    const yearlyTotal = yearlyPlan.amount;
    const monthlyTotal = monthlyEquivalent.amount * 12;
    return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
  };

  if (loading && plans.length === 0) {
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
          variant="secondary" 
          size="sm" 
          className="mt-3"
          onClick={() => dispatch(fetchSubscriptionPlans())}
        >
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  const filteredPlans = getFilteredPlans();

  return (
    <div className="space-y-8">
      {/* Current subscription status */}
      {showCurrentPlan && currentSubscription && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Plan Actual</h4>
              <p className="text-blue-700 text-sm">
                {currentSubscription.plan?.name} - 
                {formatPrice(currentSubscription.amount, currentSubscription.currency)} / 
                {currentSubscription.interval === 'month' ? 'mes' : 'año'}
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Próxima facturación: {new Date(currentSubscription.nextBillingDate).toLocaleDateString('es-MX')}
              </p>
            </div>
            <Badge variant={currentSubscription.status === 'active' ? 'success' : 'warning'}>
              {currentSubscription.status === 'active' ? 'Activo' : 'Pendiente'}
            </Badge>
          </div>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Planes de Membresía
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades. Todos los planes incluyen IVA.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center">
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
            onClick={() => setBillingType('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingType === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Anual
            <Badge variant="success" className="ml-2">
              Ahorra hasta 25%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlans.map((plan) => {
          const isCurrentPlan = currentSubscription?.planId === plan.id;
          const savings = billingType === 'yearly' ? calculateSavings(plan) : 0;
          
          return (
            <div 
              key={plan.id} 
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                plan.isPopular 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200'
              } ${
                isCurrentPlan ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    Más Popular
                  </Badge>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <Badge variant="success">
                    Plan Actual
                  </Badge>
                </div>
              )}
              
              <div className="p-8">
                {/* Plan header */}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(plan.amount, plan.currency)}
                    </span>
                    <span className="text-gray-500 ml-2 text-lg">
                      /{plan.interval === 'month' ? 'mes' : 'año'}
                    </span>
                  </div>
                  {billingType === 'yearly' && savings > 0 && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      Ahorras {savings}% vs. mensual
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 text-sm font-medium">
                          {feature.name}
                        </span>
                        {feature.limit && (
                          <span className="text-gray-500 text-sm ml-1">
                            ({feature.limit})
                          </span>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Limits display */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Torneos:</span>
                    <span className="font-medium">
                      {plan.maxTournamentRegistrations || 'Ilimitados'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reservas:</span>
                    <span className="font-medium">
                      {plan.maxCourtBookings || 'Ilimitadas'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Búsquedas:</span>
                    <span className="font-medium">
                      {plan.maxPlayerMatches || 'Ilimitadas'}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={selectedPlan === plan.id || loading || isCurrentPlan}
                  variant={plan.isPopular ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {isCurrentPlan ? (
                    'Plan Actual'
                  ) : selectedPlan === plan.id ? (
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
            </div>
          );
        })}
      </div>

      {filteredPlans.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-gray-500 text-lg font-medium">
            No hay planes disponibles
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            Actualmente no hay planes de membresía disponibles.
          </p>
        </div>
      )}
    </div>
  );
};