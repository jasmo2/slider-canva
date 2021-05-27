import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Slider from "./Slider";
import reportWebVitals from "./reportWebVitals";

import imgA from "./images/A.jpeg";
import imgB from "./images/B.jpeg";
import imgC from "./images/C.jpeg";
const images = [imgA, imgB, imgC];

const width = "800px";
const styles = { width };
ReactDOM.render(
  <React.StrictMode>
    <section className="wrapper" style={styles}>
      <Slider images={images} />
    </section>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
