import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { scrollToSection } from '../../utils/scroll';
import './Navigation.css';

const Navigation = ({ activeSection, setActiveSection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const menuItems = ['Home', 'About', 'Work', 'Contact'];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const handleClick = (item) => {
        const sectionId = item.toLowerCase();
        scrollToSection(sectionId);
        setActiveSection(sectionId);
        setIsOpen(false);
    };

    return (
        <>
            <nav className={`navigation ${scrolled ? 'scrolled' : ''}`}>
                <button
                    className="nav-brand"
                    onClick={() => {
                        scrollToSection('home');
                        setActiveSection('home');
                    }}
                >
                    NW
                </button>

                {/* Desktop Menu */}
                <div className="nav-menu-desktop">
                    {menuItems.map((item) => (
                        <button
                            key={item}
                            className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
                            onClick={() => handleClick(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-controls">
                    <button
                        className="nav-menu-toggle"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Full-Screen Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}>
                <div className="mobile-menu-content">
                    <div className="mobile-menu-header">
                        <span className="mobile-brand">Nikhil Wagh</span>
                    </div>

                    <nav className="mobile-menu-nav">
                        {menuItems.map((item, index) => (
                            <button
                                key={item}
                                className={`mobile-nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
                                onClick={() => handleClick(item)}
                                style={{ '--delay': `${index * 0.1}s` }}
                            >
                                <span className="link-number">0{index + 1}</span>
                                <span className="link-text">{item}</span>
                                <span className="link-arrow">→</span>
                            </button>
                        ))}
                    </nav>

                    <div className="mobile-menu-footer">
                        <p>Let's build something great</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navigation;
