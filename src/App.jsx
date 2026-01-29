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
import './styles/global.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

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
        <Hero />

        <ScrollReveal>
          <About />
        </ScrollReveal>

        <ScrollReveal>
          <Projects />
        </ScrollReveal>

        <ScrollReveal>
          <Publications />
        </ScrollReveal>

        <ScrollReveal>
          <Experience />
        </ScrollReveal>

        <ScrollReveal>
          <Skills />
        </ScrollReveal>

        <ScrollReveal>
          <Achievements />
        </ScrollReveal>

        <ScrollReveal>
          <CTA />
        </ScrollReveal>

        <ScrollReveal>
          <Contact />
        </ScrollReveal>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
