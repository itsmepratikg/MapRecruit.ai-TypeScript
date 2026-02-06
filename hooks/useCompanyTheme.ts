import { useState, useEffect } from 'react';
import { companyService } from '../services/api';
import { generatePalette, DEFAULT_THEME_COLOR } from '../utils/colorUtils';

export const useCompanyTheme = (userProfile: any) => {
    const [themeColor, setThemeColor] = useState<string>(DEFAULT_THEME_COLOR);
    const [companyName, setCompanyName] = useState<string>('');
    const [logos, setLogos] = useState<{ logo?: string, minifiedLogo?: string }>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchAndApplyTheme = async () => {
            // Wait until user is logged in before fetching company data
            if (!userProfile || !localStorage.getItem('user')) {
                // console.log('useCompanyTheme: No user logged in, using default.');
                applyTheme(DEFAULT_THEME_COLOR);
                return;
            }

            setLoading(true);
            // console.log('useCompanyTheme: Fetching company data for user ID:', userProfile._id || userProfile.id);
            try {
                // Fetch current company details
                // Note: The backend's /company endpoint should resolve the company based on the user's currentCompanyID
                const companyData = await companyService.get();
                // console.log('useCompanyTheme: Fetched companyData:', companyData);

                // Extract main color from themesdata
                // themesdata is an array in some company documents
                const themes = companyData?.themesdata;
                const mainColor = Array.isArray(themes)
                    ? themes[0]?.themeVariables?.mainColor
                    : themes?.themeVariables?.mainColor;

                // console.log('useCompanyTheme: Extracted mainColor:', mainColor);

                if (mainColor) {
                    setThemeColor(mainColor);
                    applyTheme(mainColor);
                } else {
                    // console.warn('useCompanyTheme: No mainColor found, using blue fallback.');
                    setThemeColor(DEFAULT_THEME_COLOR);
                    applyTheme(DEFAULT_THEME_COLOR);
                }

                // Extract branding data (standard DB paths)
                setCompanyName(companyData?.companyProfile?.companyName || '');
                setLogos({
                    logo: companyData?.companyProfile?.companyLogo,
                    minifiedLogo: companyData?.companyProfile?.companyMinifiedLogo
                });

            } catch (error) {
                console.error("Failed to fetch company theme:", error);
                // Fallback on error
                setThemeColor(DEFAULT_THEME_COLOR);
                applyTheme(DEFAULT_THEME_COLOR);
            } finally {
                setLoading(false);
            }
        };

        fetchAndApplyTheme();
    }, [userProfile]); // Re-run if user profile changes (e.g. login/logout/update)

    // Helper to generate palette and set CSS variables
    const applyTheme = (color: string) => {
        const palette = generatePalette(color);
        const root = document.documentElement;

        Object.entries(palette).forEach(([shade, hexValue]) => {
            root.style.setProperty(`--color-primary-${shade}`, hexValue);
        });
    };

    return { themeColor, companyName, logos, loading };
};
