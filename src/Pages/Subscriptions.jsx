import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const SubscriptionCard = ({ plan, isPopular, onSelect, currentSubscription }) => {
  const isCurrentPlan = currentSubscription?.plan === plan.id;

  const features = plan.features.map((feature, index) => (
    <li key={index} className="flex items-start mb-3">
      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
      <span>{feature}</span>
    </li>
  ));

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
        isPopular ? 'border-2 border-blue-500' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
          Plus Populaire
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 bg-green-500 text-white px-4 py-1 rounded-br-lg text-sm font-medium">
          Plan Actuel
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold text-gray-900">TND {plan.price}</span>
          <span className="text-gray-600 ml-2">/mois</span>
        </div>
        <button
          onClick={() => onSelect(plan)}
          disabled={isCurrentPlan}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            isCurrentPlan
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : isPopular
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          {isCurrentPlan ? 'Plan Actuel' : 'Choisir ce Plan'}
        </button>
      </div>
      <div className="px-6 pb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Caractéristiques :</h4>
        <ul className="text-gray-600">{features}</ul>
      </div>
    </motion.div>
  );
};

const Subscriptions = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('warning');
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setShowAlert(true);
          setAlertMessage('Veuillez vous connecter pour accéder aux abonnements');
          setAlertType('warning');
          return;
        }

        // Récupérer les plans disponibles
        const plansResponse = await axios.get('http://localhost:3001/api/subscriptions/plans');
        setPlans(plansResponse.data);

        // Récupérer l'abonnement actuel
        const subscriptionResponse = await axios.get('http://localhost:3001/api/subscriptions/my-subscription', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentSubscription(subscriptionResponse.data);
      } catch (error) {
        console.error('Erreur:', error);
        if (error.response?.status === 404) {
          // Pas d'abonnement actif, c'est normal
        } else {
          setShowAlert(true);
          setAlertMessage('Erreur lors de la récupération des données');
          setAlertType('error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectPlan = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Si c'est un plan gratuit, on peut le prendre directement
      if (plan.price === 0) {
        await axios.post('http://localhost:3001/api/subscriptions/subscribe', 
          { plan: plan.id },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        setShowAlert(true);
        setAlertMessage('Abonnement gratuit activé avec succès');
        setAlertType('success');
        window.location.reload();
      } else {
        // Pour les plans payants, rediriger vers la page de paiement
        navigate(`/payment`, { 
          state: { 
            plan: plan.id, 
            price: plan.price,
            name: plan.name 
          } 
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setShowAlert(true);
      setAlertMessage(error.response?.data?.message || 'Erreur lors de la souscription');
      setAlertType('error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {showAlert && (
        <div className={`mb-8 p-4 rounded-lg ${
          alertType === 'warning' ? 'bg-yellow-50 border-yellow-400' :
          alertType === 'error' ? 'bg-red-50 border-red-400' :
          'bg-green-50 border-green-400'
        } border-l-4`}>
          <div className="flex items-center">
            <AlertCircle className={`w-6 h-6 ${
              alertType === 'warning' ? 'text-yellow-400' :
              alertType === 'error' ? 'text-red-400' :
              'text-green-400'
            } mr-3`} />
            <p className={`${
              alertType === 'warning' ? 'text-yellow-700' :
              alertType === 'error' ? 'text-red-700' :
              'text-green-700'
            }`}>{alertMessage}</p>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choisissez Votre Abonnement
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Profitez d'avantages exclusifs et de réductions sur vos réservations avec nos plans d'abonnement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans && Object.entries(plans).map(([id, plan]) => (
          <SubscriptionCard
            key={id}
            plan={{
              ...plan,
              id,
              features: [
                `${plan.features.maxReservationHours}h max par réservation`,
                `${plan.features.maxActiveReservations} réservation${plan.features.maxActiveReservations > 1 ? 's' : ''} active${plan.features.maxActiveReservations > 1 ? 's' : ''}`,
                `Annulation gratuite jusqu'à ${plan.features.cancellationHours}h avant`,
                `${plan.features.priceDiscount}% de réduction sur les tarifs`,
                `${plan.features.hasAds ? 'Avec publicités' : 'Sans publicités'}`,
                `${plan.features.carWashPerMonth} lavage${plan.features.carWashPerMonth > 1 ? 's' : ''} auto gratuit${plan.features.carWashPerMonth > 1 ? 's' : ''} par mois`,
                `Support ${plan.features.supportPriority}`
              ]
            }}
            isPopular={id === 'Standard'}
            onSelect={handleSelectPlan}
            currentSubscription={currentSubscription}
          />
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Pourquoi Choisir un Abonnement ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Économies</h3>
            <p className="text-gray-600">
              Réalisez jusqu'à 15% d'économies sur vos réservations
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Flexibilité</h3>
            <p className="text-gray-600">
              Profitez de réservations plus longues et d'annulations gratuites
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Services Premium</h3>
            <p className="text-gray-600">
              Accédez à des services exclusifs comme le lavage auto gratuit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
