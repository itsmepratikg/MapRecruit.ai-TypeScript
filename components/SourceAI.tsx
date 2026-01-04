import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Plus, X, Sparkles, Send, MapPin, Briefcase, 
  CheckCircle, Clock, ThumbsUp, XCircle, ArrowRight, MessageSquare,
  Users
} from 'lucide-react';
import { MOCK_PROFILES, QUICK_FILTERS } from '../data';
import { FilterPopup, filterProfilesEngine, LandingDashboard } from './TalentSearchEngine';
import { AdvancedSearchModal } from './AdvancedSearchModal';
import { ChatBubble, EmptyView } from './Common';
import { SearchState } from '../types';
import { useToast } from './Toast';

const SourceProfileCard: React.FC<{ profile: any, onAdd: () => void }> = ({ profile, onAdd }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-4 group relative">
    <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
      <Sparkles size={12} />
      {profile.matchScore}% Match
    </div>

    <div className="flex-shrink-0">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl border-2 border-white shadow-sm">
        {profile.avatar}
      </div>
    </div>

    <div className="flex-grow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors cursor-pointer">
            {profile.name}
          </h3>
          <p className="text-gray-600 font-medium">{profile.title}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          {profile.location}
        </div>
        <div className="flex items-center gap-1">
          <Briefcase size={14} />
          {profile.experience}
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle size={14} className={profile.status === 'Active' ? "text-green-500" : "text-yellow-500"} />
          {profile.status}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          {profile.availability}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {profile.skills?.map((skill: string, idx: number) => (
          <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-200">
            {skill}
          </span>
        ))}
      </div>
    </div>

    <div className="flex md:flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0 gap-2">
      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
        <ThumbsUp size={18} />
      </button>
      <button 
        onClick={onAdd}
        className="text-sm bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors w-full md:w-auto shadow-sm shadow-green-200 flex items-center gap-2 whitespace-nowrap"
      >
        <Plus size={16} /> Add to Campaign
      </button>
    </div>
  </div>
);

export const SourceAI = () => {
  const { addToast } = useToast();
  const [searchState, setSearchState] = useState<SearchState>({
    view: 'initial', 
    inputValue: '',
    activeFilters: [],
    searchKeywords: [],
    advancedParams: {},
    chatMessages: []
  });

  const [placeholder, setPlaceholder] = useState("Describe your ideal candidate...");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false); 
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAiEnabled, setIsAiEnabled] = useState(true); 
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filter Logic Reused
  const filteredProfiles = useMemo(() => {
    return filterProfilesEngine(MOCK_PROFILES, searchState.activeFilters, searchState.advancedParams, searchState.searchKeywords);
  }, [searchState.activeFilters, searchState.advancedParams, searchState.searchKeywords]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [searchState.chatMessages]);

  useEffect(() => {
    let examples = [];
    if (isAiEnabled) {
      examples = [
        "Describe your ideal candidate...",
        "Looking for forklift drivers in Atlanta...",
        "Candidates with 5+ years of experience...",
        "Someone who knows SAP and Team Leadership..."
      ];
    } else {
      examples = [
        "Enter keywords...",
        "Search by Job Title...",
        "Search by Skill...",
        "Search by Location..."
      ];
    }
    
    let i = 0;
    setPlaceholder(examples[0]);
    const interval = setInterval(() => {
      i = (i + 1) % examples.length;
      setPlaceholder(examples[i]);
    }, 4000); 
    return () => clearInterval(interval);
  }, [isAiEnabled]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    const term = searchState.inputValue.trim();
    let newKeywords = [...searchState.searchKeywords];
    if (term && !newKeywords.includes(term)) newKeywords.push(term);
    
    setSearchState(prev => {
        let newMessages = [...prev.chatMessages];
        if (isAiEnabled && term) {
            newMessages.push({
                id: Date.now(),
                text: `Searching for "${term}" to add to this campaign. I found ${filteredProfiles.length} matches based on your criteria.`,
                suggestions: [
                  { label: "Show High Match", action: () => toggleFilter("High Match (>90%)") }
                ]
            });
            // Open chat when AI search is performed
            setIsChatOpen(true);
        }
        return { ...prev, view: 'results', inputValue: '', searchKeywords: newKeywords, chatMessages: newMessages };
    });
  };

  const handleAdvancedSearch = (params: any) => {
    let newKeywords = [...searchState.searchKeywords];
    if (params.keywords) {
        const keys = params.keywords.split(' ').filter((k: string) => k.trim() !== '');
        newKeywords = [...new Set([...newKeywords, ...keys])];
    }
    setSearchState(prev => ({ 
        ...prev, 
        view: 'results',
        advancedParams: params, 
        searchKeywords: newKeywords
    }));
  };

  const toggleFilter = (filterName: string) => {
    const isActive = searchState.activeFilters.includes(filterName);
    let newFilters;
    let newMessages = [...searchState.chatMessages];

    if (isActive) {
      newFilters = searchState.activeFilters.filter(f => f !== filterName);
      if (isAiEnabled) newMessages.push({ text: `Removed filter: ${filterName}` });
    } else {
      newFilters = [...searchState.activeFilters, filterName];
      if (isAiEnabled) newMessages.push({ text: `Applying filter: ${filterName}` });
    }
    
    setSearchState(prev => ({ ...prev, activeFilters: newFilters, chatMessages: newMessages }));
  };

  const removeKeyword = (keyword: string) => {
      setSearchState(prev => ({ ...prev, searchKeywords: prev.searchKeywords.filter(k => k !== keyword) }));
  };

  const clearSearch = () => {
    setSearchState({
      view: 'initial',
      inputValue: '',
      activeFilters: [],
      searchKeywords: [],
      advancedParams: {},
      chatMessages: []
    });
  };

  const handleChatInput = (e: any) => {
    e.preventDefault();
    const input = e.target.elements.chatInput.value;
    if (!input.trim()) return;

    setSearchState(prev => ({ ...prev, chatMessages: [...prev.chatMessages, { text: input }] }));
    e.target.reset();

    setTimeout(() => {
      setSearchState(prev => ({
          ...prev,
          chatMessages: [...prev.chatMessages, {
            text: "I'm refining the search results for this campaign based on your request.",
            suggestions: []
          }]
      }));
    }, 1000);
  };

  const handleAddToCampaign = (profileName: string) => {
      addToast(`${profileName} added to campaign successfully!`, 'success');
  };

  const onModifySearch = (keywordsString: string) => {
    if (keywordsString) {
      const newKeys = keywordsString.split(' ').filter(k => k.trim() !== '');
      setSearchState((prev) => ({
          ...prev,
          searchKeywords: [...new Set([...prev.searchKeywords, ...newKeys])]
      }));
    }
    setIsAdvancedOpen(true);
  };

  const onDirectSearch = (keywordsString: string) => {
    if (keywordsString) {
      const newKeys = keywordsString.split(' ').filter(k => k.trim() !== '');
      setSearchState((prev) => ({
          ...prev,
          searchKeywords: [...new Set([...prev.searchKeywords, ...newKeys])],
          view: 'results'
      }));
    } else {
       setSearchState((prev) => ({ ...prev, view: 'results' })); 
    }
  };

  return (
    <div className="flex h-full bg-white relative overflow-hidden">
        <FilterPopup 
            isOpen={isFilterPopupOpen}
            onClose={() => setIsFilterPopupOpen(false)}
            activeFilters={searchState.activeFilters}
            onToggle={toggleFilter}
            onReset={() => setSearchState(prev => ({...prev, activeFilters: []}))}
        />

        <AdvancedSearchModal 
            isOpen={isAdvancedOpen}
            onClose={() => setIsAdvancedOpen(false)}
            initialKeywords={searchState.searchKeywords.join(' ')}
            onSearch={handleAdvancedSearch}
        />

        {/* MAIN CONTENT AREA (Flex Grow) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* SEARCH VIEW (INITIAL) */}
            {searchState.view === 'initial' ? (
                <div className="flex flex-col items-center justify-center h-full p-8 overflow-y-auto bg-slate-50/30">
                    <div className="w-full max-w-2xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    {/* Simplified Initial View without Header */}
                    <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto group">
                        <div className="absolute inset-y-0 left-4 flex items-center gap-2">
                        <button 
                            type="button" 
                            onClick={() => setIsAiEnabled(!isAiEnabled)}
                            className={`p-2 rounded-lg transition-colors z-10 ${isAiEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                            title={isAiEnabled ? "AI Search Enabled" : "Traditional Search"}
                        >
                            <Sparkles size={18} className={isAiEnabled ? "fill-green-600" : ""} />
                        </button>
                        </div>
                        <input 
                        type="text"
                        value={searchState.inputValue}
                        onChange={(e) => setSearchState({...searchState, inputValue: e.target.value})}
                        placeholder={placeholder}
                        className="w-full pl-12 pr-28 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none text-lg shadow-lg shadow-gray-100 transition-all placeholder:text-gray-400 bg-white"
                        />
                        <div className="absolute right-3 top-2.5 flex items-center gap-2">
                        {searchState.inputValue && (
                            <button type="button" onClick={() => setSearchState({...searchState, inputValue: ''})} className="text-gray-400 hover:text-gray-600 p-2">
                            <XCircle size={20} />
                            </button>
                        )}
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl shadow-md transition-transform active:scale-95">
                            <ArrowRight size={20} />
                        </button>
                        </div>
                    </form>

                    {!isAiEnabled && (
                        <div className="flex justify-end w-full max-w-xl mx-auto -mt-6">
                        <button 
                            onClick={() => setIsAdvancedOpen(true)}
                            className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1"
                        >
                            Advanced Search
                        </button>
                        </div>
                    )}

                    <LandingDashboard onSearch={onDirectSearch} onModifySearch={onModifySearch} />
                    </div>
                </div>
            ) : (
                /* RESULTS VIEW */
                <div className="flex flex-col h-full">
                    {/* Top Search Bar */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-white sticky top-0 z-10 shrink-0">
                        <div className="flex items-center gap-2 flex-1 max-w-3xl">
                            <form onSubmit={handleSearch} className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={searchState.inputValue}
                                    onChange={(e) => setSearchState({...searchState, inputValue: e.target.value})}
                                    className="w-full bg-gray-50 text-sm rounded-lg pl-9 pr-20 py-2.5 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none border border-gray-200 focus:border-green-300 transition-all"
                                    placeholder="Search candidates to add..."
                                />
                                <div className="absolute right-2 top-1.5 flex items-center gap-1">
                                    {searchState.inputValue && (
                                        <button type="button" onClick={() => setSearchState({...searchState, inputValue: ''})} className="text-gray-400 hover:text-gray-600 p-1">
                                            <XCircle size={16} />
                                        </button>
                                    )}
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAiEnabled(!isAiEnabled)}
                                        className={`p-1 rounded transition-colors ${isAiEnabled ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-600'}`}
                                        title={isAiEnabled ? "AI Search Enabled" : "Traditional Search"}
                                    >
                                        <Sparkles size={16} className={isAiEnabled ? "fill-green-600" : ""} />
                                    </button>
                                </div>
                            </form>
                            <button 
                                onClick={() => setIsAdvancedOpen(true)}
                                className="text-green-700 font-medium text-sm whitespace-nowrap px-3 py-2 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                            >
                                Advanced
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-2 rounded-lg text-gray-600 hover:bg-gray-100 ${isChatOpen ? 'bg-green-50 text-green-700' : ''}`}>
                                <MessageSquare size={20} />
                            </button>
                        </div>
                    </div>

                    <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth bg-gray-50/30">
                        <div className="max-w-5xl mx-auto">
                            {/* Filters & Count */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-gray-800">Results</h2>
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">{filteredProfiles.length} found</span>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar max-w-full">
                                    <button 
                                        onClick={() => setIsFilterPopupOpen(true)}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-green-700 transition-colors bg-white shadow-sm flex-shrink-0"
                                    >
                                        <Filter size={16} />
                                    </button>
                                    {QUICK_FILTERS.slice(0, 3).map((filter) => {
                                        const isActive = searchState.activeFilters.includes(filter.value);
                                        return (
                                            <button
                                                key={filter.value}
                                                onClick={() => toggleFilter(filter.value)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shadow-sm ${isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}
                                            >
                                                {filter.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Active Filters Display */}
                            {(searchState.searchKeywords.length > 0 || searchState.activeFilters.length > 0) && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {searchState.searchKeywords.map((k, idx) => (
                                        <span key={`key-${idx}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-green-200 text-green-700 text-xs font-medium shadow-sm">
                                            "{k}" <button onClick={() => removeKeyword(k)}><X size={12} /></button>
                                        </span>
                                    ))}
                                    {searchState.activeFilters.map((filter, idx) => (
                                        <span key={`filt-${idx}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-green-200 text-green-700 text-xs font-medium shadow-sm">
                                            {filter} <button onClick={() => toggleFilter(filter)}><X size={12} /></button>
                                        </span>
                                    ))}
                                    <button onClick={clearSearch} className="text-xs text-gray-500 underline hover:text-green-600 ml-2">Clear all</button>
                                </div>
                            )}

                            {/* Cards */}
                            <div className="space-y-4">
                                {filteredProfiles.map(profile => (
                                    <SourceProfileCard key={profile.id} profile={profile} onAdd={() => handleAddToCampaign(profile.name)} />
                                ))}
                                {filteredProfiles.length === 0 && (
                                    <div className="text-center py-20">
                                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><Search size={32} /></div>
                                        <h3 className="text-lg font-medium text-gray-900">No candidates found</h3>
                                        <p className="text-gray-500 text-sm mt-2">Modify your filters to see more results.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </div>

        {/* Chat Sidebar (Relative Sibling) */}
        <aside 
            className={`${isChatOpen ? 'w-[400px] border-l' : 'w-0 border-l-0'} bg-white border-gray-200 transition-all duration-300 ease-in-out flex flex-col shrink-0 overflow-hidden shadow-xl z-20`}
        >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white shadow-sm"><Sparkles size={16} /></div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">Source Assistant</h3>
                        <p className="text-[10px] text-green-600 font-medium">Helping you find matches</p>
                    </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {searchState.chatMessages.length === 0 && (
                    <div className="text-center mt-10 opacity-60 px-4">
                        <p className="text-sm text-gray-500">I can help you find candidates for this campaign. Try searching for specific skills or experience.</p>
                    </div>
                )}
                {searchState.chatMessages.map((msg: any, idx: number) => (
                    <ChatBubble key={idx} message={msg} isBot={!msg.text.includes("Searching") && !msg.text.includes("Remove filter") && idx % 2 === 0} />
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleChatInput} className="relative">
                    <input name="chatInput" type="text" placeholder="Ask the assistant..." className="w-full bg-gray-100 text-sm rounded-xl pl-4 pr-12 py-3 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all" />
                    <button type="submit" className="absolute right-2 top-2 p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Send size={16} /></button>
                </form>
            </div>
        </aside>
    </div>
  );
};