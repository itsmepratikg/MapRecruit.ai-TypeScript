
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { CampaignHeader } from './index';
import { Intelligence } from './Intelligence';
import { SourceAIWrapper } from './SourceAI';
import { MatchAI } from './MatchAI';
import { EngageAIWrapper } from './EngageAI';
import { CampaignSettings } from './Settings';
import { campaignService } from '../../services/api'; // Using generic api proxy or CampaignService?
import { CampaignService as NewCampaignService } from '../../services/CampaignService'; // The one we refactored

import { Campaign } from '../../types';
import { Recommendations } from './Recommendations';
import { Navigate } from 'react-router-dom';
import { AdditionalDetails } from '../Profile/AdditionalDetails';
import { useWebSocket } from '../../context/WebSocketContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { mapCampaignToUI } from '../Campaigns';
import { ConfirmClientSwitchModal } from '../../components/ConfirmClientSwitchModal';

// Wrapper to fetch campaign and render content with Header
const ExternalRouteWrapper = ({
    component: Component,
    activeTab,
    subProps = {}
}: {
    component: React.ComponentType<any>,
    activeTab: any,
    subProps?: any
}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { joinRoom, leaveRoom } = useWebSocket();
    const { userProfile, clients } = useUserProfile();

    // Add missing state for client switch confirmation
    const [showClientSwitchModal, setShowClientSwitchModal] = useState(false);
    const [targetClientName, setTargetClientName] = useState('');

    useEffect(() => {
        const loadCampaign = async () => {


            // 2. API Fetch
            try {
                // Using the unified getAll for now, ideally getById
                const campaigns = await NewCampaignService.saveCampaign ? [] : []; // access check 
                // For now, assume global or fetch
                // reusing logic from App.tsx wrapper roughly
                // reusing logic from App.tsx wrapper roughly
                let found;
                try {
                    console.log(`[CampaignExternalRoutes] Attempting getById for: ${id}`);
                    found = await campaignService.getById(id);
                    console.log(`[CampaignExternalRoutes] getById result:`, found ? 'Found' : 'Not Found');
                } catch (e) {
                    console.warn(`[CampaignExternalRoutes] getById failed or 404:`, e);

                    // Fallback 1: Try getAll for current client
                    try {
                        console.log(`[CampaignExternalRoutes] Fallback 1: getAll for current client`);
                        const all = await campaignService.getAll();
                        found = all.find((c: any) => (c._id?.$oid || c._id)?.toString() === id);
                        console.log(`[CampaignExternalRoutes] getAll result:`, found ? 'Found' : 'Not Found');
                    } catch (err) { console.error(err); }

                    // Fallback 2: If still not found, scan other accessible clients
                    if (!found && clients && clients.length > 0) {
                        console.log(`[CampaignExternalRoutes] Fallback 2: Scanning ${clients.length} other clients`);
                        try {
                            const results = await Promise.all(clients.map(async (client) => {
                                // Skip current active client to avoid redundant call
                                if (client._id === userProfile.activeClientID || client.id === userProfile.activeClientID) return null;

                                try {
                                    console.log(`[CampaignExternalRoutes] Scanning client: ${client.clientName} (${client._id || client.id})`);
                                    // Try fetching campaigns for this client
                                    // We assume the API supports filtering by clientID param even if user context is different
                                    // effectively "peeking" into other clients user has access to
                                    const clientCampaigns = await campaignService.getAll({ clientID: client._id || client.id });
                                    const match = clientCampaigns.find((c: any) => (c._id?.$oid || c._id)?.toString() === id);
                                    if (match) console.log(`[CampaignExternalRoutes] Found match in client: ${client.clientName}`);
                                    return match ? { campaign: match, client: client } : null;
                                } catch (err) {
                                    return null;
                                }
                            }));

                            const validResult = results.find(r => r !== null);
                            if (validResult) {
                                found = validResult.campaign;
                                console.log(`[CampaignExternalRoutes] Campaign resolved via scan`);
                                // We explicitly set the found campaign's clientID to the one where we found it
                                // This ensures the mismatch logic downstream catches it correctly
                                if (validResult.client) {
                                    // Ensure we have the client object structure expected
                                    // Sometimes api returns just string ID, sometimes object
                                    // We'll trust the scanner's result
                                    // We might need to inject the clientID if missing on the campaign object from this specific fetch
                                    if (!found.clientID) found.clientID = validResult.client._id || validResult.client.id;
                                }
                            } else {
                                console.log(`[CampaignExternalRoutes] Scan returned no results`);
                            }
                        } catch (err) {
                            console.error("Error scanning clients for campaign", err);
                        }
                    } else {
                        console.log(`[CampaignExternalRoutes] Skipping scan. Found: ${!!found}, Clients: ${clients?.length}`);
                    }
                }

                if (found) {
                    const uiCampaign = mapCampaignToUI(found);
                    // Check for Client Context Mismatch
                    // We check if campaign.clientID matches userProfile.activeClientID
                    // Note: campaign.clientID might be an object in some API responses, so safely access string
                    // Ensure we handle both ObjectIds and strings, and potential missing fields
                    let campaignClientID = uiCampaign.clientID;
                    if (typeof campaignClientID === 'object' && campaignClientID) {
                        campaignClientID = (campaignClientID as any)._id || (campaignClientID as any).id;
                    }

                    // Fallback: If campaignClientID not found in UI object, try to find it in the raw object if structure differs
                    if (!campaignClientID && found.clientID) {
                        const rawID = found.clientID;
                        campaignClientID = typeof rawID === 'object' ? (rawID._id || rawID.id) : rawID;
                    }

                    // User active client ID
                    const userActiveClientID = userProfile.activeClientID;

                    // Comparison Logic
                    // We only enforce switch if BOTH IDs are present and different
                    if (userActiveClientID && campaignClientID && userActiveClientID.toString() !== campaignClientID.toString()) {
                        // Mismatch detected!
                        // Find target client name for display
                        const targetClient = clients.find(c =>
                            (c._id?.toString() === campaignClientID.toString()) ||
                            (c.id?.toString() === campaignClientID.toString())
                        );

                        // Fallback name if client not in list (e.g. user doesn't have access, or potential data issue)
                        // If user doesn't have access, we might want to fail gracefully or still show modal to let them try to switch (api will fail if unauthorized)
                        const targetName = targetClient?.clientName || 'Target Client'; // Could also use campaign.clientID.clientName if available

                        setTargetClientName(targetName);
                        setCampaign(uiCampaign); // Set it so we have the name, but block render (via modal overlay)
                        setShowClientSwitchModal(true);
                    } else {
                        setCampaign(uiCampaign);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCampaign();
    }, [id, userProfile, clients]); // Added userProfile to dependencies for client ID check

    // Join Room
    useEffect(() => {
        if (id && userProfile) {
            const userId = userProfile?._id || userProfile?.id || 'visitor';
            joinRoom(id, {
                id: userId,
                firstName: userProfile.firstName || 'Visitor',
                lastName: userProfile.lastName || '',
                email: userProfile.email || '',
                color: userProfile.color || 'blue',
                avatar: userProfile.avatar
            }, activeTab);

            return () => {
                leaveRoom(id, userId);
            };
        }
    }, [id, userProfile, joinRoom, leaveRoom, activeTab]);


    const handleSwitchConfirm = async () => {
        if (!campaign || !campaign.clientID) return;

        try {
            const { authService } = await import('../../services/api');
            // We need the companyID as well. 
            // Usually campaign has companyID. If not, we might assume current company or find it from client list.
            // But switchCompany takes (companyId, clientId). 
            // Let's try to find the client object to get companyID if needed, or use campaign.companyID

            // Find client object from scan/list to get robust IDs
            let targetClientID = campaign.clientID;
            if (typeof targetClientID === 'object') targetClientID = (targetClientID as any)._id || (targetClientID as any).id;

            const clientObj = clients.find(c => (c._id || c.id) === targetClientID);
            const targetCompanyID = campaign.companyID || clientObj?.companyID || userProfile.companyID; // Fallback to current company if same

            await authService.switchCompany(targetCompanyID, targetClientID);

            // Reload to apply new token/context
            window.location.reload();
        } catch (error) {
            console.error("Failed to switch client:", error);
            // Optionally show error toast
        }
    };

    const handleSwitchCancel = () => {
        navigate('/dashboard'); // Or back to campaigns list
    };

    if (loading) return <div className="p-12 text-center animate-pulse">Loading...</div>;
    // Keep the debug view for now if campaign strictly not found even after scan
    if (!campaign) return (
        <div className="p-12 text-center">
            <h2 className="text-xl text-red-500 font-semibold mb-4">Campaign Not Found</h2>
            <div className="max-w-lg mx-auto bg-slate-100 dark:bg-slate-800 p-4 rounded-md text-left text-xs font-mono text-slate-600 dark:text-slate-400 overflow-auto">
                <p><strong>Debug Info:</strong></p>
                <p>Route ID: {id}</p>
                <p>Active Client ID: {userProfile?.activeClientID}</p>
                <p>Clients Loaded: {clients?.length || 0}</p>
                <p>User ID: {userProfile?._id || userProfile?.id}</p>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
                Retry Logic
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900 transition-colors overflow-hidden relative">
            <div className={`flex flex-col h-full transition-all duration-300 ${showClientSwitchModal ? 'blur-sm pointer-events-none' : ''}`}>
                <CampaignHeader campaign={campaign} isScrolled={isScrolled} onBack={() => navigate('/campaigns')} currentUserId={userProfile?._id || userProfile?.id} />
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
                    <Component campaign={campaign} activeView={activeTab} {...subProps} />
                </div>
            </div>

            <ConfirmClientSwitchModal
                isOpen={showClientSwitchModal}
                campaignName={campaign.name || campaign.title}
                targetClientName={targetClientName}
                onConfirm={handleSwitchConfirm}
                onCancel={handleSwitchCancel}
            />
        </div>
    );
};

export const CampaignExternalRoutes = () => {
    return (
        <Routes>
            {/* --- INTELLIGENCE --- */}
            <Route path="intelligence/:id" element={
                <ExternalRouteWrapper component={Intelligence} activeTab="INTELLIGENCE" />
            } />

            {/* --- SOURCE AI --- */}
            <Route path="sourceai/attachpeople/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="ATTACH" />
            } />
            <Route path="sourceai/profiles/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="PROFILES" />
            } />
            <Route path="sourceai/portalsourcing/:id/emailtemplates" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="TEMPLATES" />
            } />
            <Route path="sourceai/portalsourcing/:id/analytics" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="ANALYTICS" />
            } />
            <Route path="sourceai/integrations/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="INTEGRATIONS" />
            } />
            <Route path="sourceai/jobdescription/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="JD" />
            } />

            {/* --- MATCH AI --- */}
            <Route path="matchai/:id" element={
                <ExternalRouteWrapper component={MatchAI} activeTab="MATCH" />
            } />

            {/* --- ENGAGE AI --- */}
            {/* Default Builder View */}
            <Route path="engageai/:id" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="BUILDER" />
            } />

            {/* Specific Round Routes */}
            <Route path="engageai/:id/:roundId/dashboard" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="TRACKING" />
            } />
            <Route path="engageai/:id/:roundId/questionnaire" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="QUESTIONNAIRE" />
            } />
            <Route path="engageai/:id/:roundId/autoschedule" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="AUTOSCHEDULE" />
            } />
            <Route path="engageai/:id/:roundId/reachouttemplates/:channel" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="TEMPLATES" />
            } />
            <Route path="engageai/:id/:roundId/automation" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="AUTOMATION" />
            } />
            <Route path="engageai/:id/:roundId/room" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="ROOM" />
            } />

            {/* --- RECOMMENDATIONS --- */}
            <Route path="recommendedprofiles/:id" element={
                <ExternalRouteWrapper component={Recommendations} activeTab="PROFILES" />
            } />

            {/* --- SETTINGS --- */}
            <Route path="settings/:id" element={
                <ExternalRouteWrapper component={CampaignSettings} activeTab="SETTINGS" />
            } />
            <Route path="settings/additionaldetails/:id" element={
                <ExternalRouteWrapper component={AdditionalDetails} activeTab="ADDITIONAL_DETAILS" subProps={{ collection: 'campaigns' }} />
            } />

            {/* --- FALLBACKS --- */}
            {/* Handle /showcampaign/:id by redirecting to intelligence */}
            <Route path=":id" element={<NavigateWithId />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const NavigateWithId = () => {
    const { id } = useParams();
    return <Navigate to={`/showcampaign/intelligence/${id}`} replace />;
};
