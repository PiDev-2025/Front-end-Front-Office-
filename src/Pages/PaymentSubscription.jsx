import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const PaymentSubscription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, price, name } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (!plan || !price || !name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-4">
            Les informations de l'abonnement sont manquantes.
          </p>
          <button
            onClick={() => navigate('/subscriptions')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Retour aux abonnements
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Simuler un paiement réussi
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer l'abonnement une fois le paiement réussi
      await axios.post(
        'http://localhost:3001/api/subscriptions/subscribe',
        { 
          plan,
          paymentMethod,
          paymentStatus: 'completed'
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Rediriger vers la page de succès
      navigate('/payment-success', { 
        state: { 
          message: 'Votre abonnement a été activé avec succès !',
          returnPath: '/subscriptions'
        }
      });
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.response?.data?.message || 'Une erreur est survenue lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Paiement de l'Abonnement
              </h2>
              <p className="text-lg text-gray-600">
                Vous avez choisi le plan {name}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Résumé de la commande
              </h3>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Durée</span>
                <span className="font-medium">1 mois</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>TND {price}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Mode de paiement
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <span className="block text-center font-medium">
                    Carte bancaire
                  </span>
                </button>
                <button
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'edinar'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => setPaymentMethod('edinar')}
                >
                  <span className="block text-center font-medium">
                    E-Dinar
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-400">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Traitement en cours...
                </div>
              ) : (
                `Payer TND ${price}`
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSubscription;