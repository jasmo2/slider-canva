import React, { useRef, useEffect, useState } from "react";
import "./style.css";

/** single image
 * const img = new Image();
 *     img.onload = start;
 *     img.src = images[0];
 *     function start() {
 *       context.drawImage(img, 0, 0);
 *     }
 */

const getAspectRatio = (image, canvas) => {
  let imageAspect = image.width / image.height;
  let aspect = canvas.width / canvas.height;

  /**
   * Here we have to compare which of the aspects Ratio
   * is bigger so we adjust the image as best as possible
   */
  if (imageAspect >= aspect) {
    aspect = canvas.width / image.width;
  } else if (aspect > imageAspect) {
    aspect = canvas.height / image.height;
  }

  const width = image.width * aspect;
  const height = image.height * aspect;
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
      const { limitX, moveXAmount } = canvasVars.current;
      const img = images[index];

      const { width: aWidth, height: aHeight } = getAspectRatio(img, canvas);

      const y = (canvas.height - aHeight) * 0.5;
      const x = moveXAmount + limitX + (canvas.width - aWidth) * 0.5;

      /** Image draw interphase
       * void ctx.drawImage(image, dx, dy, dWidth, dHeight);
       *
       * https://stackoverflow.com/questions/15036386/make-image-drawn-on-canvas-draggable-with-javascript
       */

      context.drawImage(
        img,

        x,
        y,
        aWidth,
        aHeight
      );

      canvasVars.current = {
        ...canvasVars.current,
        lastWidth: limitX,
        limitX: limitX + canvas.width,
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

        /**
         * Debug to make it stop in the last image with the right offset
         * console.table(`TCL ~ lastWidth ${lastWidth}\tx: ${x}`);
         */

        if (x > -lastWidth && x <= 0) {
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
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default Slider;
