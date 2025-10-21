# quick-upscale

A simple, fast image upscaling library using canvas for resolution enhancement. Works in browser environments.

## Installation
```bash
npm install quick-upscale
```

## Usage

### Basic Usage
```javascript
import { upscaleImage } from "quick-upscale";

// Upscale by 2x
const upscaled = await upscaleImage("./image.jpg", { scale: 2 });

// Upscale to specific dimensions
const upscaled = await upscaleImage("./image.jpg", {
  width: 3840,
  height: 2160,
});
```

### From File Input
```javascript
import { upscaleImage } from "quick-upscale";

const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const upscaled = await upscaleImage(file, { scale: 2 });

// Display the result
const url = URL.createObjectURL(upscaled);
document.querySelector("img").src = url;
```

### From Image URL
```javascript
import { upscaleImage } from "quick-upscale";

const upscaled = await upscaleImage("https://example.com/image.jpg", {
  scale: 3,
});

const url = URL.createObjectURL(upscaled);
document.querySelector("img").src = url;
```

### Advanced Options
```javascript
const upscaled = await upscaleImage("./image.jpg", {
  scale: 2, // Scale factor
  quality: "high", // 'low', 'medium', or 'high' - controls both canvas smoothing and JPEG quality
  outputFormat: "dataURL", // 'blob', 'dataURL', or 'canvas'
  mimeType: "image/jpeg", // Output format
  imageQuality: 0.95, // Optional: Override JPEG quality (0-1)
});
```

### Batch Processing
```javascript
import { upscaleImages } from "quick-upscale";

const images = ["img1.jpg", "img2.jpg", "img3.jpg"];
const upscaled = await upscaleImages(images, { scale: 2 });
```

## API

### `upscaleImage(source, options)`

Upscales a single image.

**Parameters:**

- `source` - Image source (URL string, File, Blob, or HTMLImageElement)
- `options` - Configuration object:
  - `scale` (number) - Scale factor (e.g., 2 for 2x). Cannot be used with width/height.
  - `width` (number) - Target width in pixels. Must be used with height.
  - `height` (number) - Target height in pixels. Must be used with width.
  - `quality` (string) - Controls both canvas smoothing and JPEG compression: 'low', 'medium' (default), or 'high'
  - `outputFormat` (string) - Output format: 'blob' (default), 'dataURL', or 'canvas'
  - `mimeType` (string) - Output MIME type (default: 'image/png')
  - `imageQuality` (number) - Optional: Override JPEG quality from 0 to 1 (defaults based on quality setting)

**Returns:** Promise resolving to Blob, Data URL string, or Canvas element

### `upscaleImages(sources, options)`

Batch upscales multiple images.

**Parameters:**

- `sources` (Array) - Array of image sources
- `options` (Object) - Same options as `upscaleImage`

**Returns:** Promise resolving to array of upscaled images

## How It Works

`quick-upscale` uses the HTML5 Canvas API to perform image upscaling through interpolation. While this doesn't add new details like AI-based upscalers, it effectively increases resolution for cases where you need:

- Higher resolution for printing
- Meeting size requirements
- Display on higher-DPI screens
- Compatibility with systems requiring specific dimensions

The library uses different interpolation algorithms based on the quality setting for the best balance of speed and visual quality.

## Quality Settings

The `quality` parameter controls both canvas smoothing during upscaling and JPEG compression quality:

- `'low'`: Fast processing, lower visual quality (canvas: nearest-neighbor, JPEG: 0.7)
- `'medium'`: Balanced performance and quality (canvas: bilinear, JPEG: 0.85) **[default]**
- `'high'`: Best visual quality, slower processing (canvas: bicubic, JPEG: 0.95)

You can override the JPEG quality independently using the `imageQuality` parameter if needed.

## Limitations

- This is **not** an AI upscaler - it won't add new details to images
- Best for moderate upscaling (2x-3x). Larger scales may result in visible interpolation artifacts
- For photos with fine details, consider AI-based solutions for better results
- Browser-only - does not support Node.js environments

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

ANKURDHI

## Repository

https://github.com/ANKURDHI/quick-upscale