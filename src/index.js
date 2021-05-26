import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Slider from "./Slider";
import reportWebVitals from "./reportWebVitals";

import imgA from "./images/A.jpeg";
import imgB from "./images/B.jpeg";
import imgC from "./images/C.jpeg";
const images = [imgA, imgB, imgC];

ReactDOM.render(
  <React.StrictMode>
    <Slider images={images} width={640} height={400} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
