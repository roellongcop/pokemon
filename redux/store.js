import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import { asyncFunctionMiddleware } from "./middleware/asyncFunctionMiddleware";
import { getData } from "../lib/storage";

const store = configureStore({
  reducer: {
    USER: userSlice,
  },
  middleware: [asyncFunctionMiddleware],
});

const loadUser = async (dispatch, state) => {
  const currentUser = await getData("currentUser");

  dispatch({ type: "user/setCurrentUser", payload: currentUser });
};

store.dispatch(loadUser);

export default store;
