import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectUserLocation, getDefaultLocation } from '../agent/LocationDetector';

const UserPreferencesContext = createContext();

const defaultPrefs = {
  locations: ['Delhi', 'Mumbai'],
  tags: ['Traffic', 'Power'],
};

export function UserPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(defaultPrefs);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLocationLoading(true);
        const detectedLocation = await detectUserLocation();
        if (detectedLocation) {
          setUserLocation(detectedLocation);
          console.log('📍 User location detected:', detectedLocation.name);
        } else {
          // Fallback to default location
          const defaultLocation = getDefaultLocation();
          setUserLocation(defaultLocation);
          console.log('📍 Using default location:', defaultLocation.name);
        }
      } catch (error) {
        console.error('Location detection failed:', error);
        const defaultLocation = getDefaultLocation();
        setUserLocation(defaultLocation);
      } finally {
        setLocationLoading(false);
      }
    };

    detectLocation();
  }, []);

  return (
    <UserPreferencesContext.Provider value={{ 
      preferences, 
      setPreferences, 
      userLocation, 
      locationLoading 
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  return useContext(UserPreferencesContext);
} 