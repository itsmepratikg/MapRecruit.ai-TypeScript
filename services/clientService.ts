// Mock Data matching the user's provided context and schema analysis (MapRecruit, TRC, Peachtree, Google, Diversified)
import { ClientData } from '../Schema/ClientSchema';

const MOCK_CLIENTS: ClientData[] = [
    // 1. MapRecruit Demo (Simple structure)
    {
        _id: '69678733d29171da0766d0ae',
        clientName: 'MapRecruit Demo',
        clientNameAlias: 'MapRecruit',
        clientCode: 'MR-DEMO',
        clientType: 'Client',
        country: 'India',
        status: 'Active',
        description: 'Demo account for MapRecruit features.',
        // Missing Logo, Language (defaults apply), TimeZone (defaults apply)
        createdAt: '2022-01-01T10:00:00Z',
        updatedAt: '2025-01-20T10:00:00Z'
    },
    // 2. TRC Talent Solutions (Rich data)
    {
        _id: '6112806bc9147f673d28c6ec',
        companyID: '6112806bc9147f673d28c6eb',
        clientName: 'TRC Talent Solutions',
        clientNameAlias: '',
        clientURL: 'trctalent.com',
        clientCode: 'TRC-HQ', // Inferred
        clientType: 'Client',
        clientLogo: '/images/trcstaffingUS/logos/6112806bc9147f673d28c6eb_6112806bc9147f673d28c6ec_UAI_Logo_White__United_Alloy_.png',
        language: 'English',
        country: 'United States',
        countryCode: 'US',
        status: 'Active',
        enable: true,
        settings: {
            defaultTimeZoneName: "India Standard Time",
            defaultLanguageCode: "en-us",
            // Other settings hidden from table
        },
        locations: [{ text: "United States" }], // Hidden
        ClientUsersList: [{ _id: "6112806bc9147f673d28c6f0", name: "Vinay Kashyap" }] // Hidden
    },
    // 3. 113 - PEACHTREE CORNERS (Branch)
    {
        _id: '62d1049a074e604a7ab72180',
        companyID: '6112806bc9147f673d28c6eb',
        clientName: '113 - PEACHTREE CORNERS',
        clientCode: '113-PTC', // Inferred
        clientType: 'Branch',
        clientLogo: '/images/trcstaffingUS/logos/6112806bc9147f673d28c6eb_62d1049a074e604a7ab72180_UAI_Logo_White__United_Alloy_.png',
        language: 'English',
        country: 'United States',
        status: 'Active',
        enable: true,
        settings: {
            defaultTimeZoneName: "Eastern Standard Time",
            // Note: Different timezone than TRC HQ
        },
        locations: [] // Empty
    },
    // 4. 2001 - Google LLC (Complex Settings)
    {
        _id: '67af4ee99b90afd53f253011',
        companyID: '6112806bc9147f673d28c6eb',
        clientName: '2001 - Google LLC',
        clientCode: 'GOOG-01', // Inferred
        clientType: 'Client',
        clientURL: 'trctalent.com',
        clientLogo: '/images/trcstaffingUS/logos/6112806bc9147f673d28c6eb_67af4ee99b90afd53f253011_UAI_Logo_White__United_Alloy_.png',
        language: 'English',
        country: 'United States',
        countryCode: 'US',
        status: 'Active',
        enable: true,
        settings: {
            defaultTimeZoneName: "Eastern Daylight Time",
            defaultDateFormat: "en-in",
            jdCompletenessCriteria: {
                enabled: true,
                jobTitleWeightage: "10"
                // ... other complex fields
            }
        },
        locations: [{ text: "United States", url: "https://maps.google.com/..." }]
    },
    // 5. Diversified Sourcing Solutions (Vendor, Empty Logo)
    {
        _id: '6914ef6923c06504df0c8f8a',
        companyID: '6112806bc9147f673d28c6eb',
        clientName: 'Diversified Sourcing Solutions',
        clientNameAlias: 'Diversified Sourcing Solutions',
        clientCode: 'DSS-VEN', // Inferred
        clientType: 'Vendor',
        clientLogo: '', // Empty string, should trigger placeholder or fallback
        language: 'English',
        country: 'United States',
        countryCode: 'us',
        status: 'Active', // Inferred from enable: true
        enable: true,
        settings: {
            defaultTimeZoneName: "Eastern Daylight Time",
            defaultResumeSource: "MVP - Diversified Sourcing Solutions"
        },
        ClientUsersList: [{ _id: "6112806bc9147f673d28c6f0", name: "Vinay Kashyap" }] // Shared user
    }
];

// Interface simulation for API response
interface ClientListResponse {
    status: boolean;
    clientlistdata: ClientData[];
}

export const clientService = {
    getAll: async (): Promise<ClientData[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate the API wrapper structure
        const response: ClientListResponse = {
            status: true,
            clientlistdata: MOCK_CLIENTS
        };

        // Unwrap and return the array
        if (response.status && Array.isArray(response.clientlistdata)) {
            return response.clientlistdata;
        }
        return [];
    },

    getById: async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_CLIENTS.find(c => c._id === id);
    },

    // Methods for future implementation (placeholders)
    create: async (data: any) => {
        console.log("Mock create client:", data);
        return { ...data, _id: Date.now().toString() };
    },

    update: async (id: string, data: any) => {
        console.log("Mock update client:", id, data);
        return { ...data, _id: id };
    },

    delete: async (id: string) => {
        console.log("Mock delete client:", id);
        return true;
    }
};
