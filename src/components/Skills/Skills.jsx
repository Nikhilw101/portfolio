import React from 'react';
import { skills } from '../../data/portfolio';
import {
    Code2, Layout, Server, Database, Wrench, BookOpen,
    Smartphone, Terminal, Cpu, Globe, Cloud, Shield
} from 'lucide-react';
import './Skills.css';

// Icon mapping
const iconMap = {
    'Code2': Code2,
    'Layout': Layout,
    'Server': Server,
    'Database': Database,
    'Wrench': Wrench,
    'BookOpen': BookOpen
};

const Skills = () => {
    return (
        <section id="work" className="section skills-section">
            <div className="content-width">
                <h2 className="section-title">Tech Arsenal</h2>

                <div className="skills-grid">
                    {skills.categories.map((category, index) => {
                        const IconComponent = iconMap[category.icon];

                        return (
                            <div key={index} className="skill-card">
                                <div className="card-glow"></div>
                                <div className="card-header">
                                    <div className="icon-box">
                                        {IconComponent && <IconComponent size={24} />}
                                    </div>
                                    <h3>{category.name}</h3>
                                </div>
                                <div className="skill-tags">
                                    {category.items.map((item, i) => (
                                        <span key={i} className="tech-tag">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Skills;
