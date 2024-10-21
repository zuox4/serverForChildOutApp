import React, {createContext, useState} from 'react';

import './index.css';

import reportWebVitals from './reportWebVitals';
import * as ReactDOM from "react-dom/client";


import App from "./App";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();

