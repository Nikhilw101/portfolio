import React from 'react';
import { ctaText, personalInfo } from '../../data/portfolio';
import { Mail, FileText } from 'lucide-react';
import './CTA.css';

const CTA = () => {
    return (
        <section className="section cta-section">
            <div className="cta-content">
                <h2>{ctaText.message}</h2>

                <div className="cta-buttons">
                    <a
                        href={`mailto:${personalInfo.email}`}
                        className="btn btn-primary"
                    >
                        <Mail size={20} />
                        {ctaText.primaryButton}
                    </a>

                    <a
                        href={personalInfo.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                    >
                        <FileText size={20} />
                        {ctaText.secondaryButton}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CTA;
