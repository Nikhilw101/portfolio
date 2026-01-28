import React from 'react';
import { footer } from '../../data/portfolio';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>{footer.copyright}</p>
        </footer>
    );
};

export default Footer;
