/**
 * Utility to process, crop, and fit uploaded user photos into perfect aspect ratios
 * for ID cards (3:4 portrait or square) and certificates, with automatic canvas scaling.
 */

export interface ImageCropOptions {
  aspectRatio?: number; // width / height, default 3/4 (0.75) for ID photos, 1 for square, 1.586 for credit card
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Loads an image from a File or Data URL, centers and crops it to the target aspect ratio,
 * and returns an optimized data URL.
 */
export async function fitImageToAspectRatio(
  imageSource: File | string,
  options: ImageCropOptions = {}
): Promise<string> {
  const {
    aspectRatio = 3 / 4, // standard 3:4 portrait ID photo
    maxWidth = 800,
    maxHeight = 1066,
    quality = 0.92
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const naturalWidth = img.naturalWidth || img.width;
        const naturalHeight = img.naturalHeight || img.height;

        // Calculate crop dimensions to achieve desired aspect ratio while centering
        const sourceRatio = naturalWidth / naturalHeight;
        let cropX = 0;
        let cropY = 0;
        let cropWidth = naturalWidth;
        let cropHeight = naturalHeight;

        if (sourceRatio > aspectRatio) {
          // Source is wider than target aspect ratio -> crop horizontal edges
          cropWidth = naturalHeight * aspectRatio;
          cropX = (naturalWidth - cropWidth) / 2;
        } else {
          // Source is taller than target aspect ratio -> crop vertical edges (favor upper-center for faces)
          cropHeight = naturalWidth / aspectRatio;
          // Shift crop slightly towards the top (35% from top instead of 50%) to keep head/face centered
          const excessHeight = naturalHeight - cropHeight;
          cropY = excessHeight * 0.35;
        }

        // Determine output canvas dimensions capped at maxWidth/maxHeight
        let outputWidth = cropWidth;
        let outputHeight = cropHeight;

        if (outputWidth > maxWidth) {
          outputWidth = maxWidth;
          outputHeight = maxWidth / aspectRatio;
        }
        if (outputHeight > maxHeight) {
          outputHeight = maxHeight;
          outputWidth = maxHeight * aspectRatio;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(outputWidth);
        canvas.height = Math.round(outputHeight);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable');
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw cropped & fitted image
        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      reject(err);
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          img.src = e.target.result;
        } else {
          reject(new Error('Failed to read file as data URL'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageSource);
    }
  });
}
