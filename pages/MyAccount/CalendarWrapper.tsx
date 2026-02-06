import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CalendarView } from './CalendarView';
import { CalendarSettings } from './CalendarSettings';

export const CalendarWrapper = () => {
    return (
        <Routes>
            <Route path="/" element={<CalendarSettings mode="page" />} />
            <Route path="myevents" element={<CalendarView />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
