import React, { useState, useRef } from 'react';
import { personalInfo } from '../../data/portfolio';
import { MapPin } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);
    const heroRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setMousePos({ x: 50, y: 50 });
    };

    return (
        <section
            id="home"
            ref={heroRef}
            className="hero"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Orbs for Animation */}
            <div className="hero-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            {/* Blurred Background Layer */}
            <div
                className="hero-bg-blurred"
                style={{ backgroundImage: 'url(/portrait.png)' }}
            />

            {/* Sharp Layer - Spotlight Reveal */}
            <div
                className={`hero-bg-sharp ${isHovering ? 'active' : ''}`}
                style={{
                    backgroundImage: 'url(/portrait.png)',
                    WebkitMaskImage: `radial-gradient(circle 200px at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 100%)`,
                    maskImage: `radial-gradient(circle 200px at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 100%)`
                }}
            />

            <div className="hero-grain" />
            <div className="hero-vignette" />

            {/* Content in Glass Card */}
            <div className="hero-content">
                <h1>Hi, I'm <span className="highlight-name">{personalInfo.name}</span></h1>
                <p className="hero-subtitle">{personalInfo.title}</p>
                <p className="hero-location">
                    <MapPin size={16} />
                    {personalInfo.location}
                </p>
            </div>
        </section>
    );
};

export default Hero;
