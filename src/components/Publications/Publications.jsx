import React from 'react';
import { publications } from '../../data/portfolio';
import { FileText, Award, Calendar, ExternalLink, Users, Hash, Cpu } from 'lucide-react';
import './Publications.css';

const typeConfig = {
    'Journal Paper': { icon: FileText, color: 'blue' },
    'Conference Paper': { icon: FileText, color: 'purple' },
    'Patent': { icon: Award, color: 'amber' }
};

const Publications = () => {
    return (
        <section className="section publications-section">
            <div className="content-width">
                <h2>Publications &amp; Patents</h2>

                <div className="publications-list">
                    {publications.map((pub, index) => {
                        const config = typeConfig[pub.type] || { icon: FileText, color: 'blue' };
                        const IconComponent = config.icon;

                        return (
                            <div key={index} className={`publication-card publication-card--${config.color}`}>
                                {/* Left accent strip */}
                                <div className="pub-accent" />

                                <div className="pub-icon-col">
                                    <div className="pub-icon-wrap">
                                        <IconComponent size={26} />
                                    </div>
                                </div>

                                <div className="pub-body">
                                    {/* Top meta row */}
                                    <div className="pub-meta-row">
                                        <span className={`pub-type-badge pub-type-badge--${config.color}`}>
                                            {pub.type}
                                        </span>
                                        <span className="pub-year">
                                            <Calendar size={13} />
                                            {pub.year}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="pub-title">{pub.title}</h3>

                                    {/* Venue */}
                                    <p className="pub-venue">{pub.venue}</p>

                                    {/* Description */}
                                    {pub.description && (
                                        <p className="pub-description">{pub.description}</p>
                                    )}

                                    {/* Patent-specific metadata */}
                                    {pub.type === 'Patent' && (
                                        <div className="pub-patent-meta">
                                            {pub.applicationNumber && (
                                                <span className="pub-meta-chip">
                                                    <Hash size={12} />
                                                    App. No. {pub.applicationNumber}
                                                </span>
                                            )}
                                            {pub.filingDate && (
                                                <span className="pub-meta-chip">
                                                    <Calendar size={12} />
                                                    Filed {pub.filingDate}
                                                </span>
                                            )}
                                            {pub.fieldOfInvention && (
                                                <span className="pub-meta-chip">
                                                    <Cpu size={12} />
                                                    {pub.fieldOfInvention}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Authors */}
                                    {pub.authors && (
                                        <div className="pub-authors">
                                            <Users size={13} />
                                            <span>{pub.authors}</span>
                                        </div>
                                    )}

                                    {/* View link */}
                                    <a
                                        href={pub.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pub-link"
                                    >
                                        <ExternalLink size={15} />
                                        <span>View {pub.type}</span>
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
