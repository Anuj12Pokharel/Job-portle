import React, { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const GoogleSignIn: React.FC = () => {
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1043671253832-oe725li125eeda640v08opko1sv0g23i.apps.googleusercontent.com';
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID not set');
      return;
    }

    if ((window as any).google) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            const idToken = response.credential;
            try {
              const res = await axios.post(`${API_BASE_URL}/api/auth/google`, { idToken });
              if (res.data?.token) {
                localStorage.setItem('token', res.data.token);
                if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
                window.dispatchEvent(new Event('storage'));
                window.location.assign('/');
              }
            } catch (err) {
              console.error('Google login failed', err);
            }
          },
        });
        // Optionally render a Google button into div#googleSignInDiv
        (window as any).google.accounts.id.renderButton(document.getElementById('googleSignInDiv'), { theme: 'outline', size: 'large' });
      } catch (e) {
        console.error(e);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            const idToken = response.credential;
            try {
              const res = await axios.post(`${API_BASE_URL}/api/auth/google`, { idToken });
              if (res.data?.token) {
                localStorage.setItem('token', res.data.token);
                if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
                window.dispatchEvent(new Event('storage'));
                window.location.assign('/');
              }
            } catch (err) {
              console.error('Google login failed', err);
            }
          },
        });
        (window as any).google.accounts.id.renderButton(document.getElementById('googleSignInDiv'), { theme: 'outline', size: 'large' });
      } catch (e) {
        console.error(e);
      }
    };
    document.body.appendChild(script);
  }, []);

  return <div id="googleSignInDiv" />;
};

export default GoogleSignIn;
