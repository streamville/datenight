import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return(
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Your best DateNight out</h1>
          <p className="lead">
            This is an Open-Source dating social network. Contribute and use it freely as you'd like.
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">Start Matching</Link>
            <Link to="/login" className="btn btn-light">Login</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Landing 