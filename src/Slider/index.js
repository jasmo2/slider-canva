import React, { useRef, useEffect } from "react";
import "./style.css";

// single image
// const img = new Image();
//     img.onload = start;
//     img.src = images[0];
//     function start() {
//       context.drawImage(img, 0, 0);
//     }

const getAspectRatio = (inputWidth, inputHeight, maxWidth, maxHeight) => {
  const ratio = Math.min(maxWidth / inputWidth, maxHeight / inputHeight);
  const width = inputWidth * ratio;
  const height = inputHeight * ratio;

  return { width, height };
};
const loadImages = (images, cb) => {
  const canvaImgs = [];
  let loaderCounter = 0;

  const l = images.length;
  for (let index = 0; index < l; index++) {
    canvaImgs[index] = new Image();
    canvaImgs[index].onload = () => {
      loaderCounter++;
      if (loaderCounter >= l) {
        cb(canvaImgs);
      }
    };
    canvaImgs[index].src = images[index];
  }
};

function Slider(props) {
  const { images = [], width = 500, height = 250 } = props;
  const canvasRef = useRef(null);
  const canvasVars = useRef({
    lastWidth: 0,
    limitX: 0,
  });

  function refresh(context, images) {
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const l = images.length;

    for (let index = 0; index < l; index++) {
      const img = images[index];

      const imgSize = getAspectRatio(
        img.width,
        img.height,
        canvas.width,
        canvas.height
      );

      const centerHeight = (canvas.height - imgSize.height) / 2;
      const centerWidth = (canvas.width - imgSize.width) / 2;

      // Single image
      // void ctx.drawImage(image, dx, dy, dWidth, dHeight);
      // context.drawImage(img, 0, 0);

      context.drawImage(
        img,

        centerWidth + canvasVars.current.limitX + centerHeight,
        imgSize.width,
        imgSize.height
      );

      canvasVars.current.lastWidth = imgSize.width;
      canvasVars.current.limitX += canvas.width;
      console.log("-----");
    }
  }

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
      width={width}
      height={height}
      style={{ width: "100%" }}
    />
  );
}

export default Slider;
