import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container text-center" style={{ marginTop: 120 }}>
      <h1 className="display-3">GiftLink</h1>
      <p className="lead">Give away what you no longer need. Find what you do, for free.</p>
      <Link to="/app" className="btn btn-primary btn-lg">Get Started</Link>
    </div>
  );
}

export default HomePage;
