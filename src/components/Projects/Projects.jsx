import React from 'react';
import { projects } from '../../data/portfolio';
import { Code2, Calendar, Github, ExternalLink } from 'lucide-react';
import './Projects.css';

const Projects = () => {
    return (
        <section id="work" className="section projects-section">
            <div className="container-narrow">
                <h2>Projects</h2>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <div className="project-header">
                                <Code2 size={24} className="project-icon" />
                                <span className="project-year">
                                    <Calendar size={16} />
                                    {project.year}
                                </span>
                            </div>

                            <h3>{project.title}</h3>
                            <p className="project-description">{project.description}</p>
                            <p className="project-tech">{project.tech}</p>

                            <div className="tech-stack">
                                {project.stack.map((tech, i) => (
                                    <span key={i} className="tech-tag">{tech}</span>
                                ))}
                            </div>

                            {/* Project Links */}
                            {(project.github || project.live) && (
                                <div className="project-links">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link"
                                        >
                                            <Github size={18} />
                                            <span>Code</span>
                                        </a>
                                    )}
                                    {project.live && (
                                        <a
                                            href={project.live}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link"
                                        >
                                            <ExternalLink size={18} />
                                            <span>Live</span>
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
