import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
// import ErrorBoundary from "./errorBoundary/errorBoundary";
// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./redux/auth/authSlice";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  // <App />
  
  <Provider store={store}>
    {console.log(store)}
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
