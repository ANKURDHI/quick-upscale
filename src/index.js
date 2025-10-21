async function loadImage(source) {
  if (source instanceof HTMLImageElement) {
    return source;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = reject;

    if (typeof source === 'string') {
      img.src = source;
    } else if (source instanceof Blob || source instanceof File) {
      img.src = URL.createObjectURL(source);
    } else {
      reject(new Error('Invalid image source type'));
    }
  });
}

function getCanvasQuality(quality) {
  const qualityMap = {
    'low': 'low',
    'medium': 'medium',
    'high': 'high'
  };
  return qualityMap[quality] || 'medium';
}


function getImageQualityFromPreset(quality) {
  const qualityMap = {
    'low': 0.7,
    'medium': 0.85,
    'high': 0.95
  };
  return qualityMap[quality] || 0.85;
}


async function upscaleImage(source, options = {}) {
  
  if (!options.scale && (!options.width || !options.height)) {
    throw new Error('Either scale or both width and height must be provided');
  }

  if (options.scale && (options.width || options.height)) {
    throw new Error('Cannot use scale together with width/height');
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

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  const quality = options.quality || 'medium';
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = getCanvasQuality(quality);

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);


  const outputFormat = options.outputFormat || 'blob';
  const mimeType = options.mimeType || 'image/png';
  const imageQuality = options.imageQuality !== undefined 
    ? options.imageQuality 
    : getImageQualityFromPreset(quality);

  if (outputFormat === 'canvas') {
    return canvas;
  }

  if (outputFormat === 'dataURL') {
    return canvas.toDataURL(mimeType, imageQuality);
  }


  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, imageQuality);
  });
}


async function upscaleImages(sources, options = {}) {
  return Promise.all(sources.map(source => upscaleImage(source, options)));
}


export { upscaleImage, upscaleImages };