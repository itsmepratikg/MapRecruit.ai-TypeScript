
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { ToastProvider } from './components/Toast';
import clarity from '@microsoft/clarity';

// Initialize Microsoft Clarity
const CLARITY_PROJECT_ID = "v0ogrd44yt";
if (clarity && clarity.init) {
  clarity.init(CLARITY_PROJECT_ID);
}

// Suppress Recharts deprecation warnings
const error = console.error;
console.error = (...args: any) => {
  if (typeof args[0] === 'string' && args[0].includes('Support for defaultProps will be removed from function components')) {
    return;
  }
  error(...args);
};

// IMPORTANT: Replace with your actual Client IDs
const GOOGLE_CLIENT_ID = "INSERT_GOOGLE_CLIENT_ID_HERE";
const MS_CLIENT_ID = "INSERT_MICROSOFT_CLIENT_ID_HERE";

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: MS_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Initialize MSAL before rendering
msalInstance.initialize().then(() => {
  root.render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ToastProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ToastProvider>
        </GoogleOAuthProvider>
      </MsalProvider>
    </React.StrictMode>
  );
});
