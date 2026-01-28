import React from 'react';
import { publications } from '../../data/portfolio';
import { FileText, Award, Calendar, ExternalLink } from 'lucide-react';
import './Publications.css';

const Publications = () => {
    const getIcon = (type) => {
        if (type === 'Patent') return Award;
        return FileText;
    };

    return (
        <section className="section publications-section">
            <div className="content-width">
                <h2>Publications & Patents</h2>

                <div className="publications-list">
                    {publications.map((publication, index) => {
                        const IconComponent = getIcon(publication.type);

                        return (
                            <div key={index} className="publication-card">
                                <div className="publication-icon-wrapper">
                                    <IconComponent size={28} className="publication-icon" />
                                </div>

                                <div className="publication-content">
                                    <div className="publication-header">
                                        <span className="publication-type">{publication.type}</span>
                                        <span className="publication-year">
                                            <Calendar size={14} />
                                            {publication.year}
                                        </span>
                                    </div>

                                    <h3>{publication.title}</h3>
                                    <p className="publication-venue">{publication.venue}</p>

                                    <a
                                        href={publication.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="publication-link"
                                    >
                                        <ExternalLink size={16} />
                                        <span>View {publication.type}</span>
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Publications;
