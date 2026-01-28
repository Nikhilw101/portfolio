import React from 'react';
import { achievements } from '../../data/portfolio';
import { Trophy, MapPin, Calendar } from 'lucide-react';
import './Achievements.css';

const Achievements = () => {
    return (
        <section className="section achievements-section">
            <div className="content-width">
                <h2>Achievements</h2>

                <div className="achievements-grid">
                    {achievements.map((achievement, index) => (
                        <div key={index} className="achievement-card">
                            <div className="achievement-icon">
                                <Trophy size={28} />
                            </div>

                            <div className="achievement-content">
                                <div className="achievement-header">
                                    <h3>{achievement.title}</h3>
                                    <span className="achievement-position">{achievement.position}</span>
                                </div>

                                <p className="achievement-details">{achievement.details}</p>

                                <div className="achievement-meta">
                                    <span className="meta-item">
                                        <Calendar size={14} />
                                        {achievement.date}
                                    </span>
                                    <span className="meta-item">
                                        <MapPin size={14} />
                                        {achievement.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
