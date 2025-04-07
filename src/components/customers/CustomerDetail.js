// File: D:\crm-frontend\src\components\customers\CustomerDetail.js

import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCustomerDetailsAsync,
  deleteCustomerAsync
} from '../../redux/actions/customerActions';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedCustomer, loading, error } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(getCustomerDetailsAsync(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomerAsync(id));
      navigate('/customers');
    }
  };

  if (loading) return <div>Loading customer details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedCustomer) return <div>No customer found</div>;

  return (
    <div className="customer-detail">
      <h2>Customer Details</h2>
      <div className="card">
        <div className="card-header">
          <h3>{selectedCustomer.name}</h3>
        </div>
        <div className="card-body">
          <p><strong>ID:</strong> {selectedCustomer.id}</p>
          <p><strong>Email:</strong> {selectedCustomer.email}</p>
          <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
          {selectedCustomer.address && (
            <p><strong>Address:</strong> {selectedCustomer.address}</p>
          )}
          {selectedCustomer.notes && (
            <div>
              <strong>Notes:</strong>
              <p>{selectedCustomer.notes}</p>
            </div>
          )}
        </div>
        <div className="card-footer">
          <Link to={`/customers/edit/${selectedCustomer.id}`} className="btn btn-warning mr-2">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger mr-2">
            Delete
          </button>
          <Link to="/customers" className="btn btn-secondary">
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;