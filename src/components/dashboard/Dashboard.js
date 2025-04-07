// D:\crm-frontend\src\components\dashboard\Dashboard.js
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadUser } from '../../redux/actions/authActions';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

const Dashboard = ({ auth: { user, loading }, loadUser }) => {
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return loading || user === null ? (
    <LoadingSpinner />
  ) : (
    <div className="dashboard-container">
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      <div className="dashboard-content">
        <div className="dashboard-summary">
          <h2>Account Summary</h2>
          <p>Here you can view and manage your CRM data.</p>
          <div className="dashboard-actions">
            <button className="btn btn-primary">View Contacts</button>
            <button className="btn btn-light">View Deals</button>
            <button className="btn btn-light">View Tasks</button>
          </div>
        </div>
        <div className="dashboard-recent-activity">
          <h2>Recent Activity</h2>
          <p>No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { loadUser })(Dashboard);