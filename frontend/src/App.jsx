import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceCards from './components/ServiceCards';
import HowItWorks from './components/HowItWorks';
import AssuranceSection from './components/AssuranceSection';
import { Testimonials, FaqSection } from './components/Testimonials';
import Footer from './components/Footer';
import AuthScreen from './components/AuthScreen';
import MoveWizard from './components/MoveWizard';
import CustomerDashboard from './components/CustomerDashboard';
import CoordinatorPortal from './components/coordinator/CoordinatorPortal';
import AdminPanel from './components/admin/AdminPanel';
import ServiceDetailModal from './components/ServiceDetailModal';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'auth' | 'wizard' | 'dashboard' | 'coordinator' | 'admin'
  const [authTab, setAuthTab] = useState('signin'); // 'signin' | 'signup'
  const [dashboardTab, setDashboardTab] = useState('overview'); // 'overview' | 'quote' | 'progress' | 'additional_request' | 'delivery_checklist' | 'settings'
  const [coordScreen, setCoordScreen] = useState('coord_overview'); // 'coord_overview' | 'job_brief' | 'execution' | 'report_issue' | 'admin_requests'
  const [activeCity, setActiveCity] = useState('Pune');
  const [selectedService, setSelectedService] = useState(null);
  
  // Logged-in user state (null = not signed in)
  const [user, setUser] = useState(null);

  const handleOpenAuth = (tab = 'signin') => {
    setAuthTab(tab);
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWizard = () => {
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDashboard = (tab = 'overview') => {
    setDashboardTab(tab);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCoordinator = (screen = 'coord_overview') => {
    setCoordScreen(screen);
    setCurrentView('coordinator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    // Route based on role after login
    if (authenticatedUser.role === 'admin') {
      setCurrentView('admin');
    } else if (authenticatedUser.role === 'coordinator') {
      setCoordScreen('coord_overview');
      setCurrentView('coordinator');
    } else {
      // Customer role (default)
      setDashboardTab('overview');
      setCurrentView('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitRequest = (requestData) => {
    // Transition from Move Wizard Step 4 directly into Customer Overview Screen 07
    setDashboardTab('overview');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="movemate-app">
      {/* 1. AUTH SCREEN VIEW (Sign In / Create Account Mockup) */}
      {currentView === 'auth' && (
        <AuthScreen 
          isOpen={true}
          initialTab={authTab}
          onClose={handleNavigateHome}
          onNavigateHome={handleNavigateHome}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* 2. MOVE WIZARD VIEW (Details, Inventory, Review AI Plan, Request Summary) */}
      {currentView === 'wizard' && (
        <MoveWizard 
          isOpen={true}
          onClose={handleNavigateHome}
          onNavigateHome={handleNavigateHome}
          onSubmitRequest={handleSubmitRequest}
          userProfile={user}
        />
      )}

      {/* 3. CUSTOMER DASHBOARD / PORTAL (Screens 07 - 12) */}
      {currentView === 'dashboard' && (
        <CustomerDashboard 
          onNavigateHome={handleNavigateHome}
          onNavigateWizard={handleOpenWizard}
          onNavigateCoordinator={handleOpenCoordinator}
          onSignOut={() => {
            setUser(null);
            handleNavigateHome();
          }}
          initialTab={dashboardTab}
          user={user}
        />
      )}

      {/* 4. COORDINATOR PORTAL (Screens 13 - 17) */}
      {currentView === 'coordinator' && (
        <CoordinatorPortal 
          onNavigateHome={handleNavigateHome}
          onNavigateCustomerPortal={() => handleOpenDashboard('overview')}
          onNavigateAdmin={handleOpenAdmin}
          initialScreen={coordScreen}
          user={user}
          onSignOut={() => {
            setUser(null);
            handleNavigateHome();
          }}
        />
      )}

      {/* 5. MOVEMATE ADMIN PANEL (Screens 01 - 04) */}
      {currentView === 'admin' && (
        <AdminPanel 
          onNavigateHome={handleNavigateHome}
          onNavigateCustomerPortal={() => handleOpenDashboard('overview')}
          onNavigateCoordinatorPortal={() => handleOpenCoordinator('coord_overview')}
          onSignOut={() => {
            setUser(null);
            handleNavigateHome();
          }}
        />
      )}

      {/* 6. MAIN HOMEPAGE VIEW */}
      {currentView === 'home' && (
        <>
          {/* Header Navigation */}
          <Navbar 
            onPlanMoveClick={handleOpenWizard}
            onSignInClick={() => handleOpenAuth('signin')}
            onAdminClick={handleOpenAdmin}
            onProfileClick={() => {
              if (user?.role === 'admin') {
                handleOpenAdmin();
              } else if (user?.role === 'coordinator') {
                handleOpenCoordinator('coord_overview');
              } else {
                handleOpenDashboard('settings');
              }
            }}
            onDashboardClick={() => {
              if (user?.role === 'admin') {
                handleOpenAdmin();
              } else if (user?.role === 'coordinator') {
                handleOpenCoordinator('coord_overview');
              } else {
                handleOpenDashboard('overview');
              }
            }}
            onSignOut={() => setUser(null)}
            onNavigateSection={handleNavigateSection}
            activeCity={activeCity}
            onCityChange={(newCity) => setActiveCity(newCity)}
            user={user}
          />

          {/* Hero Section */}
          <Hero 
            onPlanMoveClick={handleOpenWizard}
            activeCity={activeCity}
            onCitySelectClick={() => {
              const cities = ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad'];
              const nextIdx = (cities.indexOf(activeCity) + 1) % cities.length;
              setActiveCity(cities[nextIdx]);
            }}
          />

          {/* Three Service Cards */}
          <ServiceCards 
            onSelectService={(service) => setSelectedService(service)}
          />

          {/* How It Works Section */}
          <HowItWorks 
            onPlanMoveClick={handleOpenWizard}
          />

          {/* The MoveMate Assurance */}
          <AssuranceSection 
            onPlanMoveClick={handleOpenWizard}
          />

          {/* Customer Testimonials */}
          <Testimonials activeCity={activeCity} />

          {/* FAQ Accordion */}
          <FaqSection />

          {/* Footer */}
          <Footer 
            onPlanMoveClick={handleOpenWizard}
            onSelectService={(service) => setSelectedService(service)}
            onCityChange={(newCity) => setActiveCity(newCity)}
            activeCity={activeCity}
          />

          {/* Service Detail Modal */}
          <ServiceDetailModal 
            isOpen={!!selectedService}
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onBookService={() => {
              setSelectedService(null);
              handleOpenWizard();
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
