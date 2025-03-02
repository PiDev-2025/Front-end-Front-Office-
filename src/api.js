import axios from "axios";

// Définir l'URL du backend avec une variable d'environnement
const API_URL = "http://localhost:3001/";


// Créer une instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ➤ Intercepteur pour ajouter automatiquement le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Récupérer le token du localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



// ➤ Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response, // Retourner la réponse directement si elle est OK
  (error) => {
    console.error("Erreur API:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      alert("Session expirée, veuillez vous reconnecter.");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Rediriger l'utilisateur vers la page de connexion
    }

    return Promise.reject(error);
  }
);

export default api;
