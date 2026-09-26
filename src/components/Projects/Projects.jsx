import React from 'react';
import { projects } from '../../data/portfolio';
import { Code2, Calendar, Github, ExternalLink, Zap, Radio } from 'lucide-react';
import './Projects.css';

const Projects = () => {
    return (
        <section id="work" className="section projects-section">
            <div className="container-narrow">
                <h2>Projects</h2>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <div key={index} className={`project-card${project.isLatest ? ' project-card--latest' : ''}`}>
                            {/* Header row: badges left, year right */}
                            <div className="project-header">
                                <div className="project-badges">
                                    {project.isLatest && (
                                        <span className="badge badge--latest">
                                            <Zap size={12} />
                                            Latest
                                        </span>
                                    )}
                                    {project.isLive && (
                                        <span className="badge badge--live">
                                            <Radio size={12} />
                                            Live
                                        </span>
                                    )}
                                </div>
                                <span className="project-year">
                                    <Calendar size={14} />
                                    {project.year}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="project-title">{project.title}</h3>

                            {/* Description */}
                            <p className="project-description">{project.description}</p>

                            {/* Tech tags */}
                            <div className="tech-stack">
                                {project.stack.map((tech, i) => (
                                    <span key={i} className="tech-tag">{tech}</span>
                                ))}
                            </div>

                            {/* CTA Links */}
                            {(project.github || project.live) && (
                                <div className="project-links">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link"
                                            aria-label={`${project.title} GitHub repository`}
                                        >
                                            <Github size={16} />
                                            <span>GitHub</span>
                                        </a>
                                    )}
                                    {project.live && (
                                        <a
                                            href={project.live}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link project-link--primary"
                                            aria-label={`${project.title} live demo`}
                                        >
                                            <ExternalLink size={16} />
                                            <span>Live Demo</span>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
