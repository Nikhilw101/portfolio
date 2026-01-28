import React from 'react';
import { skills } from '../../data/portfolio';
import { Code2, Layout, Server, Database, Wrench, BookOpen } from 'lucide-react';
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
        <section className="section skills-section">
            <div className="content-width">
                <h2>Skills & Expertise</h2>

                <div className="skills-grid">
                    {skills.categories.map((category, index) => {
                        const IconComponent = iconMap[category.icon];

                        return (
                            <div key={index} className="skill-category-card">
                                <div className="category-header">
                                    {IconComponent && <IconComponent size={24} className="category-icon" />}
                                    <h3>{category.name}</h3>
                                </div>
                                <div className="skill-tags">
                                    {category.items.map((item, i) => (
                                        <span key={i} className="skill-tag">{item}</span>
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
