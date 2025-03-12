import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  
  // Check if user is logged in
  const isLoggedIn = () => {
    return !!localStorage.getItem('token');
  };

  // Fetch favorites on mount if user is logged in
  useEffect(() => {
    if (isLoggedIn()) {
      fetchFavorites();
    }
  }, []);

  // Fetch favorites from server
  const fetchFavorites = async () => {
    if (!isLoggedIn()) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && Array.isArray(response.data.favorites)) {
        setFavorites(response.data.favorites);
      } else {
        console.log('Received favorites data:', response.data);
        if (response.data && response.data.success) {
          const favoritesList = response.data.favorites || [];
          setFavorites(favoritesList);
        }
      }
      setIsApiAvailable(true);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setIsApiAvailable(false);
      
      try {
        const localFavorites = localStorage.getItem('localFavorites');
        if (localFavorites) {
          setFavorites(JSON.parse(localFavorites));
        }
      } catch (localError) {
        console.error('Error loading local favorites:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a parking is in favorites
  const isFavorite = (parkingId) => {
    return favorites.some(fav => fav.parking && fav.parking._id === parkingId);
  };

  // Toggle favorite status of a parking
  const toggleFavorite = async (parkingId) => {
    if (!isLoggedIn()) {
      return { success: false, requiresAuth: true };
    }

    try {
      const token = localStorage.getItem('token');
      const isFav = isFavorite(parkingId);
      
      if (isApiAvailable) {
        try {
          const endpoint = isFav 
            ? `http://localhost:3001/favorites/remove/${parkingId}`
            : `http://localhost:3001/favorites/add/${parkingId}`;
          
          const method = isFav ? 'delete' : 'post';
          
          const response = await axios({
            method,
            url: endpoint,
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            updateFavoritesList(parkingId, !isFav);
            return { success: true };
          }
        } catch (apiError) {
          console.error('Error with endpoint:', apiError);
          throw apiError;
        }
      } else {
        updateFavoritesList(parkingId, !isFav);
        return { success: true };
      }
      
      return { success: false, message: "Unknown response format" };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      if (!isApiAvailable) {
        const isFav = isFavorite(parkingId);
        updateFavoritesList(parkingId, !isFav);
        return { success: true, usingFallback: true };
      }
      
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Favorite feature is not available on the server. Using local storage instead.");
          setIsApiAvailable(false);
          const isFav = isFavorite(parkingId);
          updateFavoritesList(parkingId, !isFav);
          return { success: true, usingFallback: true };
        }
      }
      
      return { 
        success: false, 
        error: error.message,
        details: error.response?.data?.message || "Server error"
      };
    }
  };
  
  // Helper function to update favorites list
  const updateFavoritesList = (parkingId, isAdding) => {
    let newFavorites;
    
    if (isAdding) {
      newFavorites = [...favorites, { parking: { _id: parkingId } }];
    } else {
      newFavorites = favorites.filter(fav => fav.parking._id !== parkingId);
    }
    
    setFavorites(newFavorites);
    
    if (!isApiAvailable) {
      localStorage.setItem('localFavorites', JSON.stringify(newFavorites));
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      isFavorite, 
      toggleFavorite, 
      isLoading, 
      isLoggedIn, 
      isApiAvailable 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
