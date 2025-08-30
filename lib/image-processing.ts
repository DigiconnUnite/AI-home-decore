// Image processing utilities for the AI Wall Visualizer

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessingOptions {
  quality: number;
  format: 'png' | 'jpg' | 'webp';
  maxWidth?: number;
  maxHeight?: number;
}

// Validate uploaded image file
export function validateImage(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File must be a JPEG, PNG, or WebP image' };
  }
  
  return { valid: true };
}

// Get image dimensions from file
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

// Resize image while maintaining aspect ratio
export function resizeImage(
  file: File, 
  maxWidth: number, 
  maxHeight: number, 
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const { width, height } = img;
      
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      const newWidth = width * ratio;
      const newHeight = height * ratio;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and resize
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Convert image to base64 for processing
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert to base64'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Apply lighting correction to image
export function adjustImageLighting(
  imageData: ImageData, 
  brightness: number = 0, 
  contrast: number = 0
): ImageData {
  const data = imageData.data;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness
    data[i] = Math.max(0, Math.min(255, data[i] + brightness));     // Red
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness)); // Green
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness)); // Blue
    
    // Apply contrast
    data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
  }
  
  return imageData;
}

// Generate thumbnail from canvas
export function generateThumbnail(
  canvas: HTMLCanvasElement, 
  width: number = 200, 
  height: number = 150
): string {
  const thumbnailCanvas = document.createElement('canvas');
  const ctx = thumbnailCanvas.getContext('2d');
  
  thumbnailCanvas.width = width;
  thumbnailCanvas.height = height;
  
  ctx?.drawImage(canvas, 0, 0, width, height);
  
  return thumbnailCanvas.toDataURL('image/jpeg', 0.8);
}