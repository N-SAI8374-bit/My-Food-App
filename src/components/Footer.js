import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top-grid">
          {/* Brand info */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="logo-emoji">🍔</span>
              <span className="logo-text">Flavor<span className="brand-accent">Fleet</span></span>
            </div>
            <p className="footer-tagline">
              Bringing artisanal dining experiences and comfort cravings right to your doorstep in lightning-fast time.
            </p>
            <div className="footer-badges">
              <span className="safety-badge">🌿 100% Fresh Ingredients</span>
              <span className="safety-badge">⚡ 30-Min Delivery</span>
              <span className="safety-badge">🛡️ Contactless & Safe</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Explore Menu</h4>
            <ul className="footer-links-list">
              <li><a href="#pizzas">Artisan Pizzas</a></li>
              <li><a href="#burgers">Gourmet Burgers</a></li>
              <li><a href="#biryani">Hyderabadi Dum Biryani</a></li>
              <li><a href="#asian">Tokyo Ramen & Noodles</a></li>
              <li><a href="#desserts">Decadent Desserts</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-links-list">
              <li><a href="#help">Help & FAQs</a></li>
              <li><a href="#safety">Hygiene Standards</a></li>
              <li><a href="#delivery">Delivery Areas</a></li>
              <li><a href="#partner">Partner With Us</a></li>
              <li><a href="#terms">Terms & Privacy</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="footer-contact-col">
            <h4 className="footer-heading">Get Secret Deals 🎁</h4>
            <p className="footer-subtext">Join 50,000+ food lovers and get weekly discount coupons directly.</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
            <div className="contact-meta">
              <span>📞 24/7 Helpline: 1800-FLAVOR</span>
              <span>✉️ support@flavorfleet.com</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} FlavorFleet Technologies Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#refund">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
