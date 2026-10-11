/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { MenuSection } from './components/MenuSection';
import { ReservationSection } from './components/ReservationSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationsSection } from './components/LocationsSection';
import { ContactSection } from './components/ContactSection';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { api, AdminUser, getAuthToken } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')
        ? 'admin'
        : 'public';
    }
    return 'public';
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // Check auth session if token exists
  useEffect(() => {
    const checkSession = async () => {
      const token = getAuthToken();
      if (!token) return;

      setCheckingAuth(true);
      try {
        const res = await api.getMe();
        setCurrentUser(res.user);
      } catch {
        api.logout();
        setCurrentUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, []);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '' && currentView === 'admin') {
        // stay unless clicked
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.location.hash = 'admin';
  };

  const handleBackToSite = () => {
    setCurrentView('public');
    window.location.hash = '';
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setCurrentView('public');
    window.location.hash = '';
  };

  return (
    <LanguageProvider>
      <CartProvider>
        {currentView === 'admin' ? (
          currentUser ? (
            <AdminDashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              onViewSite={handleBackToSite}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={(user) => setCurrentUser(user)}
              onBackToSite={handleBackToSite}
            />
          )
        ) : (
          <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-500 selection:text-white">
            <Navbar onOpenAdmin={handleOpenAdmin} />
            <main>
              <HeroSection />
              <StorySection />
              <MenuSection />
              <ReservationSection />
              <ReviewsSection />
              <LocationsSection />
              <ContactSection />
            </main>
            <Footer />
            <CartDrawer />
          </div>
        )}
      </CartProvider>
    </LanguageProvider>
  );
}
