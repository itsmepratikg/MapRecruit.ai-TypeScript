import { MapPin, User, Sparkles } from '../../components/Icons';
import { TalentAssistantSidePanel } from './components/TalentAssistantSidePanel';
import { SchemaProfileList } from './components/SchemaProfileList';
import { useUserProfile } from '../../hooks/useUserProfile';

export const LocalProfiles = () => {
    const [isChatOpen, setIsChatOpen] = useState(true);
    const { userProfile } = useUserProfile();

    // The user suggested location.text field, falling back to location string or placeholder
    const userLocation = typeof userProfile?.location === 'object'
        ? (userProfile.location as any).text
        : (userProfile?.location || 'Hyderabad, India');

    return (
        <div className="flex h-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <MapPin size={20} className="text-red-500" />
                        Local Profiles
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded hidden sm:inline-block">
                            Location: <strong>{userLocation}</strong>
                        </span>
                        <button
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isChatOpen ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        >
                            <Sparkles size={16} />
                            <span className="hidden sm:inline">Assistant</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* Schema Driven Profile List */}
                    <div className="h-full">
                        <SchemaProfileList
                            filterType="Local"
                            onNavigateToProfile={(profile: any) => console.log('Navigate to profile:', profile._id)}
                        />
                    </div>
                </div>
            </div>

            {/* Talent Assistant Sidebar */}
            <TalentAssistantSidePanel
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                initialMessage="I can help you find candidates near your registered location. What specifically are you looking for?"
            />
        </div>
    );
};
