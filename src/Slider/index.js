import React, { useRef, useEffect, useState } from "react";
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
    moveXAmount: 0,
    oldX: 0,
    startX: 0,
    imgsObjects: [],
    isDragging: false,
  });
  const [isDragging, setIsDragging] = useState(false);

  function draw(context, images = []) {
    const canvas = canvasRef.current;
    // context.clearRect(0, 0, canvas.width, canvas.height);
    const l = images.length;

    for (let index = 0; index < l; index++) {
      console.log(
        "TCL ~ file: index.js ~ line 56 ~ draw ~  for (let index = 0; index < l; index++) {"
      );
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

        canvasVars.current.limitX + canvasVars.current.moveXAmount,
        centerHeight,
        imgSize.width,
        imgSize.height
      );

      canvasVars.current.lastWidth = imgSize.width;
      canvasVars.current.limitX += imgSize.width;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    loadImages(images, (imgsObjects) => {
      canvasVars.current.imgsObjects = imgsObjects;
      draw(context, imgsObjects);
    });

    canvas.onmousedown = (event) => {
      setIsDragging(true);
      canvasVars.current.isDragging = true;
      canvasVars.current.startX = parseInt(event.clientX);
      console.log(
        "TCL ~ file: index.js ~ line 97 ~ useEffect ~ canvasVars.current.startX ",
        canvasVars.current.startX
      );
    };

    // Windows is use because in the exmaple it can be drag even outside canva box
    window.onmouseup = () => {
      canvasVars.current.oldX = canvasVars.current.moveXAmount;
      console.log(
        "TCL ~ file: index.js ~ line 102 ~ useEffect ~ canvasVars.current.oldX",
        canvasVars.current.oldX
      );
      setIsDragging(false);
      canvasVars.current.isDragging = false;
    };

    // Mousemove -> slide pictures
    window.onmousemove = (event) => {
      const { isDragging, startX, oldX, limitX, lastWidth, imgsObjects } =
        canvasVars.current;
      if (isDragging) {
        console.log(
          "TCL ~ file: index.js ~ line 122 ~ useEffect ~ event.clientX",
          event.clientX
        );
        const x = parseInt(event.clientX) - startX + oldX;
        console.log("TCL ~ file: index.js ~ line 119 ~ useEffect ~ x", x);

        if (x > -(limitX - lastWidth) && x <= 0) {
          canvasVars.current.moveXAmount = x;
          console.log(
            "TCL ~ file: index.js ~ line 118 ~ useEffect ~ imgsObjects",
            imgsObjects
          );
          draw(context, imgsObjects);
        }
      }
    };
  }, [images]);

  return (
    <canvas
      className={`canvas ${isDragging ? "dragging" : ""}`}
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%" }}
    />
  );
}

export default Slider;
