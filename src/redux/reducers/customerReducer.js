// File: D:\crm-frontend\src\redux\reducers\customerReducer.js

import {
  FETCH_CUSTOMERS_REQUEST,
  FETCH_CUSTOMERS_SUCCESS,
  FETCH_CUSTOMERS_FAILURE,
  ADD_CUSTOMER_REQUEST,
  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAILURE,
  UPDATE_CUSTOMER_REQUEST,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_FAILURE,
  DELETE_CUSTOMER_REQUEST,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAILURE,
  GET_CUSTOMER_DETAILS_REQUEST,
  GET_CUSTOMER_DETAILS_SUCCESS,
  GET_CUSTOMER_DETAILS_FAILURE,
} from '../actions/customerActions';

const initialState = {
  customers: [],
  loading: false,
  error: null,
  selectedCustomer: null,
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch customers
    case FETCH_CUSTOMERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CUSTOMERS_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: action.payload,
      };
    case FETCH_CUSTOMERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Add customer
    case ADD_CUSTOMER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_CUSTOMER_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: [...state.customers, action.payload],
      };
    case ADD_CUSTOMER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update customer
    case UPDATE_CUSTOMER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_CUSTOMER_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer
        ),
        selectedCustomer: action.payload,
      };
    case UPDATE_CUSTOMER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Delete customer
    case DELETE_CUSTOMER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_CUSTOMER_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: state.customers.filter(
          (customer) => customer.id !== action.payload
        ),
      };
    case DELETE_CUSTOMER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get customer details
    case GET_CUSTOMER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_CUSTOMER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedCustomer: action.payload,
      };
    case GET_CUSTOMER_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default customerReducer;