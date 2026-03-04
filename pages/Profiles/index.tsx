import React, { useState } from 'react';
import { SearchProfile } from './SearchProfile';
import { FolderMetricsView } from './FoldersMetrics';
import { TagsView } from './Tags';
import { SharedProfiles } from './SharedProfiles';
import { FavoriteProfiles } from './FavoriteProfiles';
import { DuplicateProfiles } from './DuplicateProfiles';
import { LocalProfiles } from './LocalProfiles';
import { NewApplies } from './NewApplies';
import { OpenApplies } from './OpenApplies';
import { NewLocalProfiles } from './NewLocalProfiles';
import { InterviewStatus } from './InterviewStatus';
import { ViewMode } from '../../types';
import { Routes, Route, Navigate } from 'react-router-dom';

export const Profiles = ({ onNavigateToProfile }: { onNavigateToProfile: () => void }) => {

  const getPath = (id: string) => {
    const map: Record<string, string> = {
      'SEARCH': 'search',
      'FOLDERS': 'folders',
      'TAGS': 'tags',
      'SHARED': 'shared',
      'FAVORITES': 'favourites',
      'DUPLICATES': 'duplicates',
      'LOCAL': 'local',
      'NEW_APPLIES': 'newapplies',
      'OPEN_APPLIES': 'openapplies',
      'NEW_LOCAL': 'newlocal',
      'INTERVIEW_STATUS': 'interviewstatus',
    };
    return map[id] || id;
  };

  return (
    <div className="flex-1 overflow-hidden h-full flex flex-col">
      <Routes>
        <Route path="/" element={<Navigate to={getPath('SEARCH')} replace />} />
        <Route path="search" element={<SearchProfile onNavigateToProfile={onNavigateToProfile} />} />
        <Route path={getPath('NEW_APPLIES')} element={<NewApplies />} />
        <Route path={getPath('OPEN_APPLIES')} element={<OpenApplies />} />
        <Route path={getPath('NEW_LOCAL')} element={<NewLocalProfiles />} />
        <Route path={getPath('INTERVIEW_STATUS')} element={<InterviewStatus />} />
        <Route path={getPath('FOLDERS')} element={<FolderMetricsView />} />
        <Route path={getPath('TAGS')} element={<TagsView />} />
        <Route path={getPath('SHARED')} element={<SharedProfiles />} />
        <Route path={getPath('FAVORITES')} element={<FavoriteProfiles />} />
        <Route path={getPath('DUPLICATES')} element={<DuplicateProfiles />} />
        <Route path={getPath('LOCAL')} element={<LocalProfiles />} />
        <Route path="*" element={<Navigate to={getPath('SEARCH')} replace />} />
      </Routes>
    </div>
  );
};
