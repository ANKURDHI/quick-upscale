# quick-upscale

A simple, fast image upscaling library using canvas for resolution enhancement. Works in both browser and Node.js environments.

## Installation

```bash
npm install quick-upscale
```

For Node.js usage, you'll also need the `canvas` package:

```bash
npm install canvas
```

## Usage

### Basic Usage

```javascript
const { upscaleImage } = require("quick-upscale");

// Upscale by 2x
const upscaled = await upscaleImage("./image.jpg", { scale: 2 });

// Upscale to specific dimensions
const upscaled = await upscaleImage("./image.jpg", {
  width: 3840,
  height: 2160,
});
```

### Browser Usage

```javascript
import { upscaleImage } from "quick-upscale";

// From file input
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const upscaled = await upscaleImage(file, { scale: 2 });

// From image URL
const upscaled = await upscaleImage("https://example.com/image.jpg", {
  scale: 3,
});

// Display the result
const url = URL.createObjectURL(upscaled);
document.querySelector("img").src = url;
```

### Node.js Usage

```javascript
const { upscaleImage } = require("quick-upscale");
const fs = require("fs");

// Upscale from file path
const upscaled = await upscaleImage("./input.jpg", {
  scale: 2,
  outputFormat: "blob",
});

// Save to file
fs.writeFileSync("./output.png", upscaled);
```

### Advanced Options

```javascript
const upscaled = await upscaleImage("./image.jpg", {
  scale: 2, // Scale factor
  quality: "high", // 'low', 'medium', or 'high'
  outputFormat: "dataURL", // 'blob', 'dataURL', or 'canvas'
  mimeType: "image/jpeg", // Output format
  imageQuality: 0.95, // JPEG quality (0-1)
});
```

### Batch Processing

```javascript
const { upscaleImages } = require("quick-upscale");

const images = ["img1.jpg", "img2.jpg", "img3.jpg"];
const upscaled = await upscaleImages(images, { scale: 2 });
```

## API

### `upscaleImage(source, options)`

Upscales a single image.

**Parameters:**

- `source` - Image source (URL string, File, Blob, HTMLImageElement, or file path in Node.js)
- `options` - Configuration object:
  - `scale` (number) - Scale factor (e.g., 2 for 2x). Cannot be used with width/height.
  - `width` (number) - Target width in pixels. Must be used with height.
  - `height` (number) - Target height in pixels. Must be used with width.
  - `quality` (string) - Image smoothing quality: 'low', 'medium' (default), or 'high'
  - `outputFormat` (string) - Output format: 'blob' (default), 'dataURL', or 'canvas'
  - `mimeType` (string) - Output MIME type (default: 'image/png')
  - `imageQuality` (number) - JPEG quality from 0 to 1 (default: 0.92)

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

## Limitations

- This is **not** an AI upscaler - it won't add new details to images
- Best for moderate upscaling (2x-3x). Larger scales may result in visible interpolation artifacts
- For photos with fine details, consider AI-based solutions for better results

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

ANKURDHI

## Repository

https://github.com/ANKURDHI/quick-upscale
