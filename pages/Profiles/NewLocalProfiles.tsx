
import React from 'react';
import { MapPin } from '../../components/Icons';
import { GenericProfileList } from './components/GenericProfileList';

export const NewLocalProfiles = () => {
  return <GenericProfileList title="New Local Profiles" icon={MapPin} />;
};
