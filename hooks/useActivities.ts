import { useState, useEffect, useCallback } from 'react';
import { activityService } from '../services/activityService';
import { Activity } from '../types/Activity';

interface UseActivitiesParams {
    candidateID?: string;
    campaignID?: string;
    activityOf?: string; // 'common', 'user', etc.
    limit?: number;
    skip?: number;
    activityType?: string;
    activityGroup?: string;
}

export const useActivities = (params: UseActivitiesParams) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActivities = useCallback(async () => {
        // Wait until user is logged in
        if (!localStorage.getItem('user')) return;

        // If specific IDs are required but missing, don't fetch (unless fetching global 'common' activities)
        if (!params.candidateID && !params.campaignID && !params.activityOf) return;

        try {
            setLoading(true);
            const response = await activityService.getAll(params);
            setActivities(response.activities);
            setTotal(response.total);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching activities:", err);
            setError(err.message || 'Failed to load activities');
        } finally {
            setLoading(false);
        }
    }, [
        params.candidateID,
        params.campaignID,
        params.activityOf,
        params.limit,
        params.skip,
        params.activityType,
        params.activityGroup
    ]);

    const logActivity = async (data: any) => {
        try {
            const newActivity = await activityService.log({
                ...data,
                candidateID: params.candidateID,
                campaignID: params.campaignID
            });
            // Optimistic update or refetch
            setActivities(prev => [newActivity, ...prev]);
            return newActivity;
        } catch (err: any) {
            console.error("Error logging activity:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return { activities, total, loading, error, refetch: fetchActivities, logActivity };
};
