import React from 'react';
import { Mail, Github, Linkedin, ExternalLink, Code } from 'lucide-react';
import { personalInfo, contactText } from '../../data/portfolio';
import './Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="section contact-section">
            <div className="contact-content">
                <h2>Contact</h2>

                <p className="contact-message">{contactText.message}</p>

                <div className="contact-grid">
                    <a href={`mailto:${personalInfo.email}`} className="contact-card">
                        <Mail size={24} />
                        <div>
                            <h4>Email</h4>
                            <p>{personalInfo.email}</p>
                        </div>
                        <ExternalLink size={18} className="external-icon" />
                    </a>

                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-card">
                        <Github size={24} />
                        <div>
                            <h4>GitHub</h4>
                            <p>View my projects</p>
                        </div>
                        <ExternalLink size={18} className="external-icon" />
                    </a>

                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card">
                        <Linkedin size={24} />
                        <div>
                            <h4>LinkedIn</h4>
                            <p>Let's connect</p>
                        </div>
                        <ExternalLink size={18} className="external-icon" />
                    </a>
                </div>

                {/* LeetCode - Subtle link */}
                <div className="secondary-links">
                    <a href={personalInfo.leetcode} target="_blank" rel="noopener noreferrer" className="secondary-link">
                        <Code size={14} />
                        <span>LeetCode Profile</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Contact;
