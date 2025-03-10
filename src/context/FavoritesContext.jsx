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
      // Try to use the correct endpoint - fix #1: changed endpoint path
      const response = await axios.get('http://localhost:3001/User/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && Array.isArray(response.data.favorites)) {
        setFavorites(response.data.favorites);
      } else {
        // Handle the case where data structure is different than expected
        console.log('Received favorites data:', response.data);
        if (response.data && response.data.success) {
          // Try to extract favorites from different response structure
          const favoritesList = response.data.data || [];
          setFavorites(favoritesList);
        }
      }
      setIsApiAvailable(true);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // If API endpoint doesn't exist, fallback to local storage
      setIsApiAvailable(false);
      
      // Try to load favorites from localStorage as fallback
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
    return favorites.some(fav => fav === parkingId || fav._id === parkingId);
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
        // Try both possible API endpoint formats
        try {
          // Fix #2: Use the proper endpoint URL format
          const endpoint = isFav 
            ? `http://localhost:3001/User/favorites/remove/${parkingId}`
            : `http://localhost:3001/User/favorites/add/${parkingId}`;
          
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
          console.error('Error with first endpoint format:', apiError);
          
          // Try alternative endpoint format as fallback
          const altEndpoint = `http://localhost:3001/User/favorites/${parkingId}`;
          const method = isFav ? 'delete' : 'post';
          
          try {
            const response = await axios({
              method,
              url: altEndpoint,
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
              updateFavoritesList(parkingId, !isFav);
              return { success: true };
            }
          } catch (altApiError) {
            console.error('Error with alternative endpoint format:', altApiError);
            throw altApiError;
          }
        }
      } else {
        // Fallback to local storage if API is not available
        updateFavoritesList(parkingId, !isFav);
        return { success: true };
      }
      
      return { success: false, message: "Unknown response format" };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // If all API attempts fail, use localStorage as fallback
      if (!isApiAvailable) {
        const isFav = isFavorite(parkingId);
        updateFavoritesList(parkingId, !isFav);
        return { success: true, usingFallback: true };
      }
      
      // Show toast message with specific error
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Favorite feature is not available on the server. Using local storage instead.");
          setIsApiAvailable(false);
          // Use fallback localStorage method
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
      newFavorites = [...favorites, parkingId];
    } else {
      newFavorites = favorites.filter(id => 
        id !== parkingId && (typeof id === 'object' ? id._id !== parkingId : true)
      );
    }
    
    setFavorites(newFavorites);
    
    // If API is not available, save to localStorage as fallback
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
