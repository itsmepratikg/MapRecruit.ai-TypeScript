
import { useState, useEffect } from 'react';
import { INITIAL_PROFILE_DATA, PROFILE_CLIENTS, UserProfileData } from '../data/profile';

const STORAGE_KEY = 'user_profile_v1';
const EVENT_KEY = 'profile-updated';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    if (typeof window === 'undefined') return INITIAL_PROFILE_DATA;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_PROFILE_DATA;
    } catch (e) {
        return INITIAL_PROFILE_DATA;
    }
  });

  // Listen for updates from other components (e.g. BasicDetails updating App sidebar)
  useEffect(() => {
    const handleProfileUpdate = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setUserProfile(JSON.parse(stored));
        }
    };

    window.addEventListener(EVENT_KEY, handleProfileUpdate);
    return () => window.removeEventListener(EVENT_KEY, handleProfileUpdate);
  }, []);

  const saveProfile = (data: UserProfileData) => {
      setUserProfile(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Dispatch event to notify other components
      window.dispatchEvent(new Event(EVENT_KEY));
  };

  const updateAvatar = async (file: File): Promise<void> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
              const base64 = reader.result as string;
              saveProfile({ ...userProfile, avatar: base64 });
              resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
      });
  };

  return {
      userProfile,
      clients: PROFILE_CLIENTS,
      saveProfile,
      updateAvatar
  };
};
