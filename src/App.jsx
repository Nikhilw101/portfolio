import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { getActiveSection } from './utils/scroll';
import ScrollReveal from './components/utils/ScrollReveal';
import Navigation from './components/Navigation/Navigation';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Publications from './components/Publications/Publications';
import Experience from './components/Experience/Experience';
import Achievements from './components/Achievements/Achievements';
import Skills from './components/Skills/Skills';
import CTA from './components/CTA/CTA';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import SecretAdmin from './components/Admin/SecretAdmin';
import { useAnalytics } from './hooks/useAnalytics';
import './styles/global.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminView, setIsAdminView] = useState(
    window.location.pathname === '/secret-admin' || 
    window.location.pathname === '/admin' || 
    window.location.hash === '#secret-admin'
  );

  // Initialize background analytics tracking
  useAnalytics();

  // Route & Hash change listener for secret admin page access
  useEffect(() => {
    const handleRouteCheck = () => {
      const isSecret = 
        window.location.pathname === '/secret-admin' || 
        window.location.pathname === '/admin' || 
        window.location.hash === '#secret-admin';
      setIsAdminView(isSecret);
    };

    window.addEventListener('popstate', handleRouteCheck);
    window.addEventListener('hashchange', handleRouteCheck);
    return () => {
      window.removeEventListener('popstate', handleRouteCheck);
      window.removeEventListener('hashchange', handleRouteCheck);
    };
  }, []);

  // Page load fade-in
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sections = ['home', 'about', 'work', 'contact'];

    const handleScroll = () => {
      const active = getActiveSection(sections);
      setActiveSection(active);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If secret admin route triggered, render Secret Admin Dashboard
  if (isAdminView) {
    return (
      <SecretAdmin 
        onBackToSite={() => {
          window.history.pushState({}, '', '/');
          window.location.hash = '';
          setIsAdminView(false);
        }} 
      />
    );
  }

  return (
    <ThemeProvider>
      <div className={`app ${isLoading ? '' : 'fade-in'}`} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {/* Loading fade overlay */}
        {isLoading && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'var(--bg-primary)',
              zIndex: 50,
              transition: 'opacity 1s ease-in-out',
              opacity: 0,
              pointerEvents: 'none'
            }}
          />
        )}

        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div id="home">
          <Hero />
        </div>

        <ScrollReveal>
          <div id="about">
            <About />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div id="projects">
            <Projects />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div id="publications">
            <Publications />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div id="experience">
            <Experience />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div id="skills">
            <Skills />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div id="achievements">
            <Achievements />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <CTA />
        </ScrollReveal>

        <ScrollReveal>
          <div id="contact">
            <Contact />
          </div>
        </ScrollReveal>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;

