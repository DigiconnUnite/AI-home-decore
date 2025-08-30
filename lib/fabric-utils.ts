import fabric from 'fabric';

export interface WallObject extends fabric.Object {
  isWall?: boolean;
  originalImage?: string;
  maskData?: ImageData;
}

export interface DesignObject extends fabric.Object {
  isDesign?: boolean;
  designType?: 'pvc' | 'wallpaper' | 'paint' | 'texture';
  designId?: string;
}

// Create a wall mask overlay
export function createWallMask(bounds: any): fabric.Rect {
  return new fabric.Rect({
    left: bounds.x,
    top: bounds.y,
    width: bounds.width,
    height: bounds.height,
    fill: 'rgba(59, 130, 246, 0.3)',
    stroke: '#3b82f6',
    strokeWidth: 2,
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false,
    opacity: 0.7,
  });
}

// Apply design pattern to canvas object
export async function applyDesignPattern(
  canvas: fabric.Canvas,
  design: any,
  targetBounds: any
): Promise<fabric.Object | null> {
  try {
    if (design.category === 'paint') {
      // Solid color application
      const colorRect = new fabric.Rect({
        left: targetBounds.x,
        top: targetBounds.y,
        width: targetBounds.width,
        height: targetBounds.height,
        fill: design.color,
        opacity: 0.8,
        selectable: true,
        evented: true,
      });
      
      (colorRect as DesignObject).isDesign = true;
      (colorRect as DesignObject).designType = 'paint';
      (colorRect as DesignObject).designId = design.id;
      
      return colorRect;
    } else {
      // Pattern/texture application
      const patternImg = await fabric.Image.fromURL(design.url);
      
      const pattern = new fabric.Pattern({
        source: patternImg.getElement(),
        repeat: 'repeat',
      });

      const patternRect = new fabric.Rect({
        left: targetBounds.x,
        top: targetBounds.y,
        width: targetBounds.width,
        height: targetBounds.height,
        fill: pattern,
        opacity: 0.9,
        selectable: true,
        evented: true,
      });

      (patternRect as DesignObject).isDesign = true;
      (patternRect as DesignObject).designType = design.category;
      (patternRect as DesignObject).designId = design.id;
      
      return patternRect;
    }
  } catch (error) {
    console.error('Error applying design pattern:', error);
    return null;
  }
}

// Remove all design objects from canvas
export function clearDesigns(canvas: fabric.Canvas): void {
  const objects = canvas.getObjects();
  objects.forEach(obj => {
    if ((obj as DesignObject).isDesign) {
      canvas.remove(obj);
    }
  });
  canvas.renderAll();
}

// Get canvas bounds for proper scaling
export function getCanvasBounds(canvas: fabric.Canvas) {
  return {
    width: canvas.getWidth(),
    height: canvas.getHeight(),
  };
}

// Fit image to canvas while maintaining aspect ratio
export function fitImageToCanvas(
  image: fabric.Image, 
  canvasWidth: number, 
  canvasHeight: number
): void {
  const imgWidth = image.width!;
  const imgHeight = image.height!;
  
  const scale = Math.min(
    canvasWidth / imgWidth,
    canvasHeight / imgHeight
  );
  
  image.scale(scale);
  image.set({
    left: (canvasWidth - imgWidth * scale) / 2,
    top: (canvasHeight - imgHeight * scale) / 2,
  });
}