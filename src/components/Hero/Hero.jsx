import React, { useState, useEffect } from 'react';
import { personalInfo } from '../../data/portfolio';
import { Database, Server, Code, Cpu, Terminal, Layers, Globe, Cloud, Lock, Wifi, Smartphone, Tablet, Monitor } from 'lucide-react';
import './Hero.css';

const TYPING_SPEED = 50;
const DELETING_SPEED = 30;
const PAUSE_DURATION = 2000;

const ROLES = [
    "Student at VIT Pune",
    "Diploma in Computer Science (2024)",
    "B.Tech AI & Data Science (AIDS)",
    "Learning by building real projects"
];

const Hero = () => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(TYPING_SPEED);

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % ROLES.length;
            const fullText = ROLES[i];

            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? DELETING_SPEED : TYPING_SPEED);

            if (!isDeleting && text === fullText) {
                // Finished typing line
                setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
            } else if (isDeleting && text === '') {
                // Finished deleting line
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed]);

    return (
        <section id="home" className="hero">
            {/* Abstract Tech Visual Background */}
            <div className="tech-visual-container">
                <div className="tech-ring ring-1"></div>
                <div className="tech-ring ring-2"></div>
                <div className="tech-ring ring-3"></div>

                {/* Floating Tech Nodes */}
                <Database size={32} className="tech-node node-1" />
                <Server size={24} className="tech-node node-2" />
                <Code size={40} className="tech-node node-3" />
                <Cpu size={28} className="tech-node node-4" />
                <Globe size={36} className="tech-node node-5" />
                <Cloud size={30} className="tech-node node-6" />
                <Lock size={26} className="tech-node node-7" />
                <Wifi size={22} className="tech-node node-8" />
            </div>

            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Hi, I'm <span className="highlight-accent">Nikhil</span> <br />
                        Aspiring Software Engineer <br />
                        exploring modern technologies <br />
                        and real-world projects.
                    </h1>

                    <div className="hero-subtitle-container">
                        <span className="hero-subtitle">
                            {text}
                        </span>
                        <span className="typing-cursor"></span>
                    </div>

                    <div className="hero-badges">
                        <div className="tech-badge">
                            <Terminal size={16} />
                            <span>Full Stack</span>
                        </div>
                        <div className="tech-badge">
                            <Layers size={16} />
                            <span>ML</span>
                        </div>
                        <div className="tech-badge">
                            <Cpu size={16} />
                            <span>AI & Data Science</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
