
import React, { useState } from 'react';
import { FolderOpen, Tag as TagIcon } from 'lucide-react';
import { SearchState } from '../types';
import { EmptyView } from '../components/Common';
import { TalentSearchEngine } from '../components/TalentSearchEngine';

const FoldersView = () => (
  <EmptyView 
    title="Candidate Folders" 
    message="Organize candidates into folders for better management." 
    icon={FolderOpen} 
  />
);

const TagsView = () => (
  <EmptyView 
    title="Tags Management" 
    message="Manage tags to categorize candidates effectively." 
    icon={TagIcon} 
  />
);

export const Profiles = ({ onNavigateToProfile, view }: { onNavigateToProfile: () => void, view: 'SEARCH' | 'FOLDERS' | 'TAGS' }) => {
  const [searchState, setSearchState] = useState<SearchState>({
    view: 'initial',
    inputValue: '',
    activeFilters: [],
    searchKeywords: [],
    advancedParams: {},
    chatMessages: []
  });

  return (
    <div className="flex-1 overflow-hidden h-full flex flex-col">
        {view === 'SEARCH' && <TalentSearchEngine searchState={searchState} setSearchState={setSearchState} onNavigateToProfile={onNavigateToProfile} />}
        {view === 'FOLDERS' && <FoldersView />}
        {view === 'TAGS' && <TagsView />}
    </div>
  );
};
