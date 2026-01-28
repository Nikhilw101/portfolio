import React from 'react';
import { experience } from '../../data/portfolio';
import './Experience.css';

const Experience = () => {
    return (
        <section className="section experience-section">
            <div className="content-width">
                <h2>Experience</h2>

                <div className="experience-item">
                    <h3>{experience.role}</h3>
                    <p className="company-name">{experience.company}</p>
                    <ul className="responsibilities">
                        {experience.responsibilities.map((item, index) => (
                            <li key={index}>• {item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Experience;
