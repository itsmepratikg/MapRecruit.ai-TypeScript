import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Role {
    _id: string;
    roleName: string;
}

interface HierarchyItem {
    roleID: string | Role;
    rank: number;
}

export const useRoleHierarchy = (userRoleID: string | undefined, companyID: string | undefined) => {
    const [hierarchy, setHierarchy] = useState<Map<string, number>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userRoleID || !companyID) return;

        const fetchHierarchy = async () => {
            try {
                const { default: api } = await import('../../services/api');
                const res = await api.get('/auth/roles/hierarchy');

                if (res.data && res.data.hierarchy) {
                    const map = new Map<string, number>();
                    res.data.hierarchy.forEach((h: any) => {
                        const rId = typeof h.roleID === 'object' ? h.roleID._id : h.roleID;
                        map.set(rId, h.rank);
                    });
                    setHierarchy(map);
                }
            } catch (error) {
                console.error("Failed to load role hierarchy", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHierarchy();
    }, [userRoleID, companyID]);

    // Check if the current user (myRoleID) is senior to the target role
    // Lower Rank Number = More Senior (1 is top)
    const isSeniorTo = (targetRoleID: string) => {
        if (!userRoleID) return false; // Safety fallback
        // If system has no hierarchy defined, allow everything (or block? safer to allow until configured)
        if (hierarchy.size === 0) return true;

        const myRank = hierarchy.get(userRoleID) ?? Infinity;
        const targetRank = hierarchy.get(targetRoleID) ?? Infinity;

        // If I am Senior (myRank < targetRank) -> Allow
        // If I am Peer (myRank === targetRank) -> Deny (Policy choice)
        return myRank < targetRank;
    };

    return { isSeniorTo, loading };
};
