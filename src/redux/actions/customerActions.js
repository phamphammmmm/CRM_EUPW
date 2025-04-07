// File: D:\crm-frontend\src\redux\actions\customerActions.js

// Action Types
export const FETCH_CUSTOMERS_REQUEST = 'FETCH_CUSTOMERS_REQUEST';
export const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS';
export const FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMERS_FAILURE';

export const ADD_CUSTOMER_REQUEST = 'ADD_CUSTOMER_REQUEST';
export const ADD_CUSTOMER_SUCCESS = 'ADD_CUSTOMER_SUCCESS';
export const ADD_CUSTOMER_FAILURE = 'ADD_CUSTOMER_FAILURE';

export const UPDATE_CUSTOMER_REQUEST = 'UPDATE_CUSTOMER_REQUEST';
export const UPDATE_CUSTOMER_SUCCESS = 'UPDATE_CUSTOMER_SUCCESS';
export const UPDATE_CUSTOMER_FAILURE = 'UPDATE_CUSTOMER_FAILURE';

export const DELETE_CUSTOMER_REQUEST = 'DELETE_CUSTOMER_REQUEST';
export const DELETE_CUSTOMER_SUCCESS = 'DELETE_CUSTOMER_SUCCESS';
export const DELETE_CUSTOMER_FAILURE = 'DELETE_CUSTOMER_FAILURE';

export const GET_CUSTOMER_DETAILS_REQUEST = 'GET_CUSTOMER_DETAILS_REQUEST';
export const GET_CUSTOMER_DETAILS_SUCCESS = 'GET_CUSTOMER_DETAILS_SUCCESS';
export const GET_CUSTOMER_DETAILS_FAILURE = 'GET_CUSTOMER_DETAILS_FAILURE';

// Action Creators
export const fetchCustomers = () => ({
  type: FETCH_CUSTOMERS_REQUEST,
});

export const fetchCustomersSuccess = (customers) => ({
  type: FETCH_CUSTOMERS_SUCCESS,
  payload: customers,
});

export const fetchCustomersFailure = (error) => ({
  type: FETCH_CUSTOMERS_FAILURE,
  payload: error,
});

export const addCustomer = (customerData) => ({
  type: ADD_CUSTOMER_REQUEST,
  payload: customerData,
});

export const addCustomerSuccess = (customer) => ({
  type: ADD_CUSTOMER_SUCCESS,
  payload: customer,
});

export const addCustomerFailure = (error) => ({
  type: ADD_CUSTOMER_FAILURE,
  payload: error,
});

export const updateCustomer = (id, customerData) => ({
  type: UPDATE_CUSTOMER_REQUEST,
  payload: { id, customerData },
});

export const updateCustomerSuccess = (customer) => ({
  type: UPDATE_CUSTOMER_SUCCESS,
  payload: customer,
});

export const updateCustomerFailure = (error) => ({
  type: UPDATE_CUSTOMER_FAILURE,
  payload: error,
});

export const deleteCustomer = (id) => ({
  type: DELETE_CUSTOMER_REQUEST,
  payload: id,
});

export const deleteCustomerSuccess = (id) => ({
  type: DELETE_CUSTOMER_SUCCESS,
  payload: id,
});

export const deleteCustomerFailure = (error) => ({
  type: DELETE_CUSTOMER_FAILURE,
  payload: error,
});

export const getCustomerDetails = (id) => ({
  type: GET_CUSTOMER_DETAILS_REQUEST,
  payload: id,
});

export const getCustomerDetailsSuccess = (customer) => ({
  type: GET_CUSTOMER_DETAILS_SUCCESS,
  payload: customer,
});

export const getCustomerDetailsFailure = (error) => ({
  type: GET_CUSTOMER_DETAILS_FAILURE,
  payload: error,
});

// Thunk action creators if you're using redux-thunk
export const fetchCustomersAsync = () => {
  return async (dispatch) => {
    dispatch(fetchCustomers());
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      dispatch(fetchCustomersSuccess(data));
    } catch (error) {
      dispatch(fetchCustomersFailure(error.message));
    }
  };
};

export const addCustomerAsync = (customerData) => {
  return async (dispatch) => {
    dispatch(addCustomer(customerData));
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      const data = await response.json();
      dispatch(addCustomerSuccess(data));
    } catch (error) {
      dispatch(addCustomerFailure(error.message));
    }
  };
};

export const updateCustomerAsync = (id, customerData) => {
  return async (dispatch) => {
    dispatch(updateCustomer(id, customerData));
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      const data = await response.json();
      dispatch(updateCustomerSuccess(data));
    } catch (error) {
      dispatch(updateCustomerFailure(error.message));
    }
  };
};

export const deleteCustomerAsync = (id) => {
  return async (dispatch) => {
    dispatch(deleteCustomer(id));
    try {
      await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      dispatch(deleteCustomerSuccess(id));
    } catch (error) {
      dispatch(deleteCustomerFailure(error.message));
    }
  };
};

export const getCustomerDetailsAsync = (id) => {
  return async (dispatch) => {
    dispatch(getCustomerDetails(id));
    try {
      const response = await fetch(`/api/customers/${id}`);
      const data = await response.json();
      dispatch(getCustomerDetailsSuccess(data));
    } catch (error) {
      dispatch(getCustomerDetailsFailure(error.message));
    }
  };
};