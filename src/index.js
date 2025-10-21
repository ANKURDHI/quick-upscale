// Check if we're in a browser or Node.js environment
const isBrowser = typeof window !== "undefined";
let Canvas, Image;

if (!isBrowser) {
  try {
    const canvas = require("canvas");
    Canvas = canvas.Canvas;
    Image = canvas.Image;
  } catch (e) {
    throw new Error(
      "Canvas package is required for Node.js. Install it with: npm install canvas"
    );
  }
}

async function loadImage(source) {
  if (isBrowser) {
    // Browser environment
    if (source instanceof HTMLImageElement) {
      return source;
    }

    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";

      img.onload = () => resolve(img);
      img.onerror = reject;

      if (typeof source === "string") {
        img.src = source;
      } else if (source instanceof Blob || source instanceof File) {
        img.src = URL.createObjectURL(source);
      } else {
        reject(new Error("Invalid image source type"));
      }
    });
  } else {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = reject;

      if (typeof source === "string") {
        if (source.startsWith("http://") || source.startsWith("https://")) {
          const https = require("https");
          const http = require("http");
          const protocol = source.startsWith("https://") ? https : http;

          protocol
            .get(source, (res) => {
              const chunks = [];
              res.on("data", (chunk) => chunks.push(chunk));
              res.on("end", () => {
                img.src = Buffer.concat(chunks);
              });
            })
            .on("error", reject);
        } else {
          const fs = require("fs");
          img.src = fs.readFileSync(source);
        }
      } else if (Buffer.isBuffer(source)) {
        img.src = source;
      } else {
        reject(new Error("Invalid image source type for Node.js"));
      }
    });
  }
}

function getCanvasQuality(quality) {
  const qualityMap = {
    low: "low",
    medium: "medium",
    high: "high",
  };
  return qualityMap[quality] || "medium";
}

async function upscaleImage(source, options = {}) {
  if (!options.scale && (!options.width || !options.height)) {
    throw new Error("Either scale or both width and height must be provided");
  }

  if (options.scale && (options.width || options.height)) {
    throw new Error("Cannot use scale together with width/height");
  }

  const img = await loadImage(source);

  let targetWidth, targetHeight;
  if (options.scale) {
    targetWidth = Math.floor(img.width * options.scale);
    targetHeight = Math.floor(img.height * options.scale);
  } else {
    targetWidth = options.width;
    targetHeight = options.height;
  }

  const canvas = isBrowser
    ? document.createElement("canvas")
    : new Canvas(targetWidth, targetHeight);
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  const quality = options.quality || "medium";

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = getCanvasQuality(quality);

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const outputFormat = options.outputFormat || "blob";
  const mimeType = options.mimeType || "image/png";
  const imageQuality =
    options.imageQuality !== undefined ? options.imageQuality : 0.92;

  if (outputFormat === "canvas") {
    return canvas;
  }

  if (outputFormat === "dataURL") {
    return canvas.toDataURL(mimeType, imageQuality);
  }

  if (isBrowser) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), mimeType, imageQuality);
    });
  } else {
    const buffer = canvas.toBuffer(
      mimeType === "image/jpeg" ? "image/jpeg" : "image/png"
    );
    return buffer;
  }
}

async function upscaleImages(sources, options = {}) {
  return Promise.all(sources.map((source) => upscaleImage(source, options)));
}

module.exports = {
  upscaleImage,
  upscaleImages,
};
