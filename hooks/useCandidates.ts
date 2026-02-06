import { useState, useEffect } from 'react';
import { profileService } from '../services/api';

export const useCandidates = () => {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCandidates = async () => {
        if (!localStorage.getItem('user')) return;
        setLoading(true);
        try {
            const data = await profileService.getAll();
            setCandidates(data.profiles || []);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch candidates');
            console.error('Error fetching candidates:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('user')) {
            fetchCandidates();
        }
    }, []);

    return {
        candidates,
        loading,
        error,
        refresh: fetchCandidates
    };
};
