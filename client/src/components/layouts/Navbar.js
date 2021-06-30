import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return(
    <nav className="navbar bg-dark">
      <h1>
        <Link to='/'>
          <i className="fas fa-user-tie"></i> DATENIGHT</Link>
      </h1>
      <ul>
        <li>
          <a href="#">Profiles</a>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Sign In</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar