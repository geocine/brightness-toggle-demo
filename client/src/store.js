import { createStore } from "redux";

const initialState = {
  isOn: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "TOGGLE":
      return { isOn: !state.isOn };
    case "SET":
      return { isOn: action.isOn };
    default:
      return state;
  }
}

export const store = createStore(reducer);