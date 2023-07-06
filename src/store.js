// src/store.js
import { createStore } from 'redux';

const initialState = {
  data: {}  // This will hold the JSON object
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
