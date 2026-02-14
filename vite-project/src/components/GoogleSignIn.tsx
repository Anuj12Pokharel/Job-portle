import React, { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

interface GoogleSignInProps {
  role?: "user" | "admin";
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ role }) => {
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '709633837604-iv4igu24ric1r8lucc326hqrg0n025fs.apps.googleusercontent.com';
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
              const res = await axios.post(`${API_BASE_URL}/api/auth/google`, { idToken, role });
              if (res.data?.token) {
                alert("Logged in successfully!");
                localStorage.setItem('token', res.data.token);

                const userData = res.data.user || res.data.admin;
                if (userData) {
                  localStorage.setItem('user', JSON.stringify(userData));
                }

                window.dispatchEvent(new Event('storage'));

                // Redirect based on role
                if (userData?.role === 'superadmin') {
                  window.location.assign('/super-admin-dashboard');
                } else if (userData?.role === 'admin') {
                  window.location.assign('/admin-dashboard');
                } else {
                  window.location.assign('/');
                }
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
              const res = await axios.post(`${API_BASE_URL}/api/auth/google`, { idToken, role });
              if (res.data?.token) {
                alert("Logged in successfully!");
                localStorage.setItem('token', res.data.token);

                const userData = res.data.user || res.data.admin;
                if (userData) {
                  localStorage.setItem('user', JSON.stringify(userData));
                }

                window.dispatchEvent(new Event('storage'));

                // Redirect based on role
                if (userData?.role === 'superadmin') {
                  window.location.assign('/super-admin-dashboard');
                } else if (userData?.role === 'admin') {
                  window.location.assign('/admin-dashboard');
                } else {
                  window.location.assign('/');
                }
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
