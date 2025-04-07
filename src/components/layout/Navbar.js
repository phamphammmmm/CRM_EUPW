// D:\crm-frontend\src\components\layout\Navbar.js
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../redux/actions/authActions';
import logo from '../../assets/images/eup.png'; 
import './Navbar.css';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <div className="nav-buttons">
      <Link to="/dashboard" className="nav-link">
        <i className="fas fa-tachometer-alt"></i> Dashboard
      </Link>
      <a onClick={logout} href="#!" className="nav-link logout-link">
        <i className="fas fa-sign-out-alt"></i> Đăng Xuất
      </a>
    </div>
  );

  const guestLinks = (
    <div className="nav-buttons">
      <Link to="/register" className="nav-link register-link">Đăng Ký</Link>
      <Link to="/login" className="nav-link login-link">Đăng Nhập</Link>
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo-link">
            <img src={logo} alt="EUPW Logo" className="logo-image" />
            <h1 className="brand-text">Hệ Thống CRM EUPW</h1>
          </Link>
        </div>
        <div className="navbar-right">
          {!loading && (
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);