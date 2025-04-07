// File: D:\crm-frontend\src\components\customers\CustomerList.js

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomersAsync, deleteCustomerAsync } from '../../redux/actions/customerActions';

const CustomerList = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(fetchCustomersAsync());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomerAsync(id));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="customer-list">
      <h2>Customers</h2>
      <Link to="/customers/add" className="btn btn-primary mb-3">
        Add New Customer
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  <Link
                    to={`/customers/${customer.id}`}
                    className="btn btn-info btn-sm mr-2"
                  >
                    View
                  </Link>
                  <Link
                    to={`/customers/edit/${customer.id}`}
                    className="btn btn-warning btn-sm mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;