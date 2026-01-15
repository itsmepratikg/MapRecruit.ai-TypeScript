import React, { useEffect, useState } from 'react';
import { TourProvider, useTour } from '@reactour/tour';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { DASHBOARD_STEPS, PROFILES_STEPS, CAMPAIGNS_STEPS, TALENT_CHAT_STEPS, SETTINGS_STEPS } from './steps';

type TourPhase = 'DASHBOARD' | 'PROFILES' | 'CAMPAIGNS' | 'TALENT_CHAT' | 'SETTINGS' | 'COMPLETED';

// Inner component to handle logic inside the Provider
const TourLogic = () => {
    const { setIsOpen, setSteps, setCurrentStep, currentStep, steps, isOpen } = useTour();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Persist current phase
    const [phase, setPhase] = useState<TourPhase>(() => {
        return (localStorage.getItem('quickTourPhase') as TourPhase) || 'DASHBOARD';
    });

    const isQuickTour = searchParams.get('quicktour') === 'true';

    // Start tour if param is present
    useEffect(() => {
        if (isQuickTour && !isOpen) {
            // Determine phase based on URL or default to saved phase
            const path = location.pathname;
            let targetPhase: TourPhase = phase;

            if (path.includes('/dashboard')) targetPhase = 'DASHBOARD';
            else if (path.includes('/profiles')) targetPhase = 'PROFILES';
            else if (path.includes('/campaigns')) targetPhase = 'CAMPAIGNS';
            else if (path.includes('/talent-chat')) targetPhase = 'TALENT_CHAT';
            else if (path.includes('/settings')) targetPhase = 'SETTINGS';

            if (targetPhase !== phase) {
                setPhase(targetPhase);
            }

            loadPhaseSteps(targetPhase);
            setIsOpen(true);
        }
    }, [isQuickTour, location.pathname]);


    const loadPhaseSteps = (currentPhase: TourPhase) => {
        switch (currentPhase) {
            case 'DASHBOARD':
                setSteps(DASHBOARD_STEPS);
                break;
            case 'PROFILES':
                setSteps(PROFILES_STEPS);
                break;
            case 'CAMPAIGNS':
                setSteps(CAMPAIGNS_STEPS);
                break;
            case 'TALENT_CHAT':
                setSteps(TALENT_CHAT_STEPS);
                break;
            case 'SETTINGS':
                setSteps(SETTINGS_STEPS);
                break;
        }
        setCurrentStep(0);
    };

    // Handle step changes or completion
    // We need to listen to tour events. @reactour doesn't have a simple "onStepChange" prop on the provider generally, 
    // but we can pass callbacks to the provider. 
    // However, we are inside the context here. 
    // Actually, handling next phase logic is best done via the 'nextButton' or custom navigation?
    // Or we handle close/finish.

    // We will pass the handler to the Provider in the parent component.
    return null;
};

export const QuickTourManager = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // We can't use useTour here because we are outside.
    // So logic must be split or we define the handlers here that manipulate some state passed down?
    // 'TourProvider' accepts props like 'beforeClose', 'onAfterOpen', etc.

    // Let's create a custom logic to handle Phase Transitions *after* the current tour closes.

    // But we need access to the current phase to know where to go next.
    // Let's use localStorage to track 'nextPhase' intention.

    const handleTourClose = () => {
        // When tour closes, check if we should proceed to next phase?
        // Actually, let's keep it simple:
        // We will add a "Next Phase" button as the LAST content of the step, 
        // OR we just use standard close.

        // If we want to prompt users: "Continue to Profiles?"
        // We can do that by making the LAST step of Dashboard have a custom Action.
    };

    // Custom styles
    const radius = 10;
    const styles = {
        popover: (base: any) => ({
            ...base,
            '--reactour-accent': '#059669', // Emerald 600
            borderRadius: radius,
            color: '#1e293b', // Slate 800
            fontSize: '14px',
        }),
        maskArea: (base: any) => ({ ...base, rx: radius }),
        badge: (base: any) => ({ ...base, backgroundColor: '#059669' }),
    };

    // We need to access navigation logic from within the steps? 
    // Or we can define a wrapper that checks "currentStep === steps.length - 1"

    // Let's use a wrapper component for the logic that has access to 'useTour'
    // But 'TourProvider' must wrap 'App'.

    return (
        <TourProvider
            steps={DASHBOARD_STEPS} // Initial steps, will be overridden
            styles={styles}
            onClickMask={() => { }} // Disable close on mask click?
            showBadge={true}
        >
            <TourPhaser />
            {children}
        </TourProvider>
    );
};

const TourPhaser = () => {
    const { setIsOpen, setSteps, currentStep, steps, setIsLocked } = useTour();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentPhase, setCurrentPhase] = useState<TourPhase>('DASHBOARD');

    const isQuickTour = searchParams.get('quicktour') === 'true';

    useEffect(() => {
        if (!isQuickTour) return;

        // Auto-detect phase from URL
        const path = window.location.pathname;
        let phase: TourPhase = 'DASHBOARD';
        if (path.includes('/dashboard')) phase = 'DASHBOARD';
        if (path.includes('/profiles')) phase = 'PROFILES';
        if (path.includes('/campaigns')) phase = 'CAMPAIGNS';
        if (path.includes('/talent-chat')) phase = 'TALENT_CHAT';
        if (path.includes('/settings')) phase = 'SETTINGS';

        console.log('QuickTour: Phase detected', phase);

        setCurrentPhase(phase);

        // Load steps for phase
        let phaseSteps = DASHBOARD_STEPS;
        if (phase === 'PROFILES') phaseSteps = PROFILES_STEPS;
        if (phase === 'CAMPAIGNS') phaseSteps = CAMPAIGNS_STEPS;
        if (phase === 'TALENT_CHAT') phaseSteps = TALENT_CHAT_STEPS;
        if (phase === 'SETTINGS') phaseSteps = SETTINGS_STEPS;

        // Add "Next Module" logic to the last step of this phase?
        // We can modify the last step content to include a button.
        // But steps are defined statically.

        // Let's just set them for now.
        setSteps(phaseSteps);

        // Open only if not open
        setIsOpen(true);

    }, [isQuickTour, window.location.pathname]); // Listen to pathname changes

    // Monitor for end of tour to trigger next phase?
    // @reactour doesn't easily support "onFinish" global callback that knows WHICH tour finished 
    // unless we track it.

    // We can use the 'currentStep' to see if we act on the last step.
    useEffect(() => {
        if (currentStep === steps.length - 1) {
            // Last step reached.
            // We can maybe inject a custom 'Next' button into the DOM or just rely on user clicking 'Next' 
            // which usually closes the tour if it's the last step.
        }
    }, [currentStep, steps]);

    return null;
}
