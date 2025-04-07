// File: D:\crm-frontend\src\components\customers\CustomerForm.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCustomerAsync,
  updateCustomerAsync,
  getCustomerDetailsAsync
} from '../../redux/actions/customerActions';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedCustomer, loading, error } = useSelector((state) => state.customer);
  
  const isEditMode = !!id;
  
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    if (isEditMode) {
      dispatch(getCustomerDetailsAsync(id));
    }
  }, [dispatch, id, isEditMode]);
  
  useEffect(() => {
    // Populate form with customer data when in edit mode and data is loaded
    if (isEditMode && selectedCustomer) {
      setFormData({
        name: selectedCustomer.name || '',
        email: selectedCustomer.email || '',
        phone: selectedCustomer.phone || '',
        address: selectedCustomer.address || '',
        notes: selectedCustomer.notes || ''
      });
    }
  }, [selectedCustomer, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditMode) {
      dispatch(updateCustomerAsync(id, formData));
    } else {
      dispatch(addCustomerAsync(formData));
    }
    
    // Navigate back to customer list after successful submission
    navigate('/customers');
  };
  
  if (isEditMode && loading) {
    return <div>Loading customer data...</div>;
  }
  
  return (
    <div className="customer-form">
      <h2>{isEditMode ? 'Edit Customer' : 'Add Customer'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            className="form-control"
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Update Customer' : 'Add Customer'}
        </button>
        
        <button
          type="button"
          className="btn btn-secondary ml-2"
          onClick={() => navigate('/customers')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;