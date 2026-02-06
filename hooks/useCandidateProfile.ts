import { useState, useEffect } from 'react';
import { profileService } from '../services/api';

export const useCandidateProfile = (id: string | null) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        if (!id || !localStorage.getItem('user')) return;
        setLoading(true);
        try {
            const data = await profileService.getById(id);
            setProfile(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch profile');
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (updateData: any) => {
        if (!id) return;
        try {
            const updated = await profileService.update(id, updateData);
            setProfile(updated);
            return updated;
        } catch (err: any) {
            console.error('Error updating profile:', err);
            throw err;
        }
    };

    useEffect(() => {
        if (id) {
            fetchProfile();
        }
    }, [id]);

    return {
        profile,
        loading,
        error,
        refresh: fetchProfile,
        updateProfile
    };
};
