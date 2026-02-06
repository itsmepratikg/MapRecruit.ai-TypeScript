import { useState, useEffect } from 'react';
import { campaignService } from '../services/api';

export const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [stats, setStats] = useState({ active: 0, closed: 0, archived: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCampaigns = async () => {
        if (!localStorage.getItem('user')) return;
        setLoading(true);
        try {
            const data = await campaignService.getAll();
            const statsData = await campaignService.getStats();
            setCampaigns(data);
            setStats(statsData);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch campaigns');
            console.error('Error fetching campaigns:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('user')) {
            fetchCampaigns();
        }
    }, []);

    return {
        campaigns,
        stats,
        loading,
        error,
        refresh: fetchCampaigns
    };
};
