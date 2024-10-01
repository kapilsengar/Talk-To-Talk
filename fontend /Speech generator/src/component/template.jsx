import React from 'react';
import './NewsletterBasic.css';

const Newsletter1 = ({ title, introText, sections, footerText }) => {
  return (
    <div className="newsletter-basic">
      <header className="newsletter-header">
        <h1>{title}</h1>
      </header>
      <section className="newsletter-intro">
        <p>{introText}</p>
      </section>
      <section className="newsletter-body">
        {sections.map((section, index) => (
          <div key={index} className="newsletter-section">
            <h2>{section.heading}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </section>
      <footer className="newsletter-footer">
        <p>{footerText}</p>
      </footer>
    </div>
  );
};

export default Newsletter1;
