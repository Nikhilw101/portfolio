import React from 'react';
import { aboutText, education } from '../../data/portfolio';
import { GraduationCap } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <section id="about" className="section about-section">
            <div className="content-width">
                <h2>About</h2>

                <div className="about-content">
                    <p className="about-intro">{aboutText.intro}</p>
                </div>

                {/* Education Cards */}
                <div className="education-section">
                    <h3><GraduationCap size={24} /> Education</h3>
                    <div className="education-list">
                        {education.map((edu, index) => (
                            <div key={index} className="education-card">
                                <div className="edu-header">
                                    <h4>{edu.institution}</h4>
                                    <span className="edu-duration">{edu.duration}</span>
                                </div>
                                <p className="edu-degree">{edu.degree}</p>
                                <div className="edu-footer">
                                    <span className="edu-score">{edu.score}</span>
                                    <span className="edu-location">{edu.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
