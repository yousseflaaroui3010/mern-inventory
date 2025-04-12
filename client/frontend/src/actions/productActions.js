// client/frontend/src/actions/productActions.js
import axios from 'axios';
import { returnErrors } from './errorActions';
import { tokenConfig } from './authActions';

import {
  GET_PRODUCTS,
  ADD_PRODUCT,
  DELETE_PRODUCTS,
  PRODUCTS_LOADING,
  EDIT_PRODUCT,
  CANCEL_EDIT,
  UPDATED_PRODUCT
} from './types';

export const getProducts = () => (dispatch, getState) => {
  dispatch(setProductsLoading());
  axios
    .get('/api/products', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_PRODUCTS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response ? err.response.data : 'Server Error'));
      console.error('Error getting products:', err);
    });
};

export const addProduct = product => (dispatch, getState) => {
  axios
    .post('/api/products/add', product, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_PRODUCT,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response ? err.response.data : 'Server Error'));
      console.error('Error adding product:', err);
    });
};

export const updateProduct = product => (dispatch, getState) => {
  axios
    .post(`/api/products/update/${product._id}`, product, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: UPDATED_PRODUCT,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response ? err.response.data : 'Server Error'));
      console.error('Error updating product:', err);
    });
};

export const deleteProduct = id => (dispatch, getState) => {
  axios
    .delete(`/api/products/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_PRODUCTS,
        payload: id
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response ? err.response.data : 'Server Error'));
      console.error('Error deleting product:', err);
    });
};

export const editProduct = product => {
  return {
    type: EDIT_PRODUCT,
    payload: product
  };
};

export const cancelEdit = () => {
  return {
    type: CANCEL_EDIT
  };
};

export const setProductsLoading = () => {
  return {
    type: PRODUCTS_LOADING
  };
};