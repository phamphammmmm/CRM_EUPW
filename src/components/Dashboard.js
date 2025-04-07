// File: D:\crm-frontend\src\components\Dashboard.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCustomersAsync } from '../redux/actions/customerActions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(fetchCustomersAsync());
  }, [dispatch]);

  if (loading) return <div>Loading dashboard data...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  // Calculate some simple statistics
  const totalCustomers = customers.length;

  return (
    <div className="dashboard">
      <h1>CRM Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p className="stat-number">{totalCustomers}</p>
          <Link to="/customers" className="btn btn-primary">View All Customers</Link>
        </div>
      </div>

      <div className="dashboard-recent">
        <h2>Recent Customers</h2>
        {customers.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 5).map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>
                    <Link to={`/customers/${customer.id}`} className="btn btn-info btn-sm">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No customers found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;