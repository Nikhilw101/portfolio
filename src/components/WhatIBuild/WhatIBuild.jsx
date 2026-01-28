import React from 'react';
import { whatIBuildNarrative, features } from '../../data/portfolio';
import './WhatIBuild.css';

const WhatIBuild = () => {
    return (
        <section className="section what-i-build-section">
            <div className="container">
                <div className="build-grid">
                    {/* Left: Narrative */}
                    <div className="build-narrative">
                        <h2>What I Build</h2>
                        <p className="narrative-text">{whatIBuildNarrative.primary}</p>
                        <p className="narrative-text secondary">{whatIBuildNarrative.secondary}</p>
                    </div>

                    {/* Right: Feature Cards */}
                    <div className="build-cards">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatIBuild;
