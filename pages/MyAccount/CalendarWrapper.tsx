import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { CalendarSettings } from './CalendarSettings';

export const CalendarWrapper = () => {
    return (
        <Routes>
            <Route path="/" element={<CalendarSettings mode="page" view="settings" />} />
            <Route path="myevents" element={<CalendarSettings mode="page" view="events" />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
