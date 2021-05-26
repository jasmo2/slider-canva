import React, { useRef, useEffect } from "react";
import "./style.css";

// single image
// const img = new Image();
//     img.onload = start;
//     img.src = images[0];
//     function start() {
//       context.drawImage(img, 0, 0);
//     }
function Slider(props) {
  const { images = [] } = props;
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    loadImages(images, (imgsObjects) => {
      refresh(context, imgsObjects);
    });
  }, [images]);
  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      style={{ width: "100%" }}
    />
  );
}

export default Slider;
