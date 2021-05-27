import React, { useRef, useEffect, useState } from "react";
import "./style.css";

/* single image
 * const img = new Image();
 *     img.onload = start;
 *     img.src = images[0];
 *     function start() {
 *       context.drawImage(img, 0, 0);
 *     }
 */

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
    offsetX: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  function draw(context, images = []) {
    const canvas = canvasRef.current;
    canvasVars.current.limitX = 0;

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

      /* Image draw interphase
       * void ctx.drawImage(image, dx, dy, dWidth, dHeight);
       *
       * https://stackoverflow.com/questions/15036386/make-image-drawn-on-canvas-draggable-with-javascript
       */

      const { limitX, moveXAmount } = canvasVars.current;
      context.drawImage(
        img,

        limitX + moveXAmount,
        centerHeight,
        imgSize.width,
        imgSize.height
      );

      canvasVars.current = {
        ...canvasVars.current,
        lastWidth: imgSize.width,
        limitX: limitX + imgSize.width,
      };
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvasVars.current.offsetX = canvas.offsetLeft;

    loadImages(images, (imgsObjects) => {
      canvasVars.current.imgsObjects = imgsObjects;
      draw(context, imgsObjects);
    });

    canvas.onmousedown = (event) => {
      setIsDragging(true);

      canvasVars.current = {
        ...canvasVars.current,
        isDragging: true,
        startX: parseInt(event.clientX - canvasVars.current.offsetX),
      };
    };

    // Windows is use because in the exmaple it can be drag even outside canva box
    window.onmouseup = () => {
      setIsDragging(false);
      canvasVars.current = {
        ...canvasVars.current,
        oldX: canvasVars.current.moveXAmount,
        isDragging: false,
      };
    };

    window.onmousemove = (event) => {
      const {
        imgsObjects,
        isDragging,
        lastWidth,
        limitX,
        offsetX,
        oldX,
        startX,
      } = canvasVars.current;
      if (isDragging) {
        const x = parseInt(event.clientX - offsetX) - startX + oldX;

        if (x > -(limitX - lastWidth) && x <= 0) {
          canvasVars.current.moveXAmount = x;
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
