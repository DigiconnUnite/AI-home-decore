'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { motion } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';

interface CanvasEditorProps {
  imageUrl: string;
  selectedDesign: any;
  setCanvasRef: (canvas: any) => void;
  setIsProcessing: (processing: boolean) => void;
}

export function CanvasEditor({ 
  imageUrl, 
  selectedDesign, 
  setCanvasRef, 
  setIsProcessing 
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [wallMask, setWallMask] = useState<any>(null);

  // Helper to safely clear and dispose previous canvas
  const disposeCanvas = useCallback(() => {
    if (canvas) {
      try {
        canvas.dispose();
      } catch (e) {
        // ignore
      }
      setCanvas(null);
    }
  }, [canvas]);

  // Create and set up the fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Dispose previous canvas if any
    disposeCanvas();

    // Defensive: check if canvasRef.current is still valid
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f8fafc',
    });

    setCanvas(fabricCanvas);
    setCanvasRef(fabricCanvas);

    return () => {
      try {
        fabricCanvas.dispose();
      } catch (e) {
        // ignore
      }
      setCanvas(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCanvasRef, canvasRef.current]);

  // Load image when canvas or imageUrl changes
  useEffect(() => {
    if (canvas && imageUrl) {
      loadImageToCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, imageUrl]);

  // Apply design when all dependencies are ready
  useEffect(() => {
    if (canvas && selectedDesign && wallMask) {
      applyDesignToWall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, selectedDesign, wallMask]);

  // Defensive: clear wallMask when image changes
  useEffect(() => {
    setWallMask(null);
  }, [imageUrl]);

  const loadImageToCanvas = async () => {
    if (!canvas) return;

    setIsSegmenting(true);
    setIsProcessing(true);

    try {
      // Defensive: clear canvas only if context is valid
      if (canvas.getContext()) {
        canvas.clear();
      }

      // Load image
      const img: fabric.Image = await new Promise((resolve, reject) => {
        fabric.Image.fromURL(
          imageUrl,
          (image) => {
            if (image) resolve(image);
            else reject(new Error('Failed to load image'));
          },
          { crossOrigin: 'anonymous' }
        );
      });

      // Scale image to fit canvas
      const canvasWidth = 800;
      const canvasHeight = 600;
      const scale = Math.min(
        canvasWidth / (img.width || 1),
        canvasHeight / (img.height || 1)
      );

      img.scale(scale);
      img.set({
        left: (canvasWidth - (img.width || 0) * scale) / 2,
        top: (canvasHeight - (img.height || 0) * scale) / 2,
        selectable: false,
        evented: false,
      });

      // Defensive: clear again before adding image
      if (canvas.getContext()) {
        canvas.clear();
      }
      canvas.add(img);
      canvas.renderAll();

      // Simulate AI wall segmentation
      await simulateWallSegmentation(img);

    } catch (error) {
      console.error('Error loading image:', error);
    } finally {
      setIsSegmenting(false);
      setIsProcessing(false);
    }
  };

  const simulateWallSegmentation = async (img: fabric.Image) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create a mock wall mask (in production, this would be from AI)
    const maskRect = new fabric.Rect({
      left: (img.left || 0) + 50,
      top: (img.top || 0) + 100,
      width: ((img.width || 0) * (img.scaleX || 1)) - 100,
      height: ((img.height || 0) * (img.scaleY || 1)) - 200,
      fill: 'rgba(59, 130, 246, 0.3)',
      stroke: '#3b82f6',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      opacity: 0.7,
    });

    if (canvas && canvas.getContext()) {
      canvas.add(maskRect);
      canvas.renderAll();
    }

    setWallMask(maskRect);
  };

  const applyDesignToWall = async () => {
    if (!canvas || !wallMask || !selectedDesign) return;

    try {
      // Remove previous design
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        if ((obj as any).isDesign) {
          canvas.remove(obj);
        }
      });

      // Create pattern from design
      const patternImg: fabric.Image = await new Promise((resolve, reject) => {
        fabric.Image.fromURL(
          selectedDesign.url,
          (image) => {
            if (image) resolve(image);
            else reject(new Error('Failed to load design image'));
          },
          { crossOrigin: 'anonymous' }
        );
      });

      const pattern = new fabric.Pattern({
        source: patternImg.getElement(),
        repeat: 'repeat',
      });

      // Apply pattern to wall area
      const designRect = new fabric.Rect({
        left: wallMask.left,
        top: wallMask.top,
        width: wallMask.width,
        height: wallMask.height,
        fill: pattern,
        opacity: 0.9,
        selectable: true,
        evented: true,
      });

      (designRect as any).isDesign = true;

      canvas.add(designRect);
      canvas.renderAll();

      // Animate the application
      designRect.set('opacity', 0);
      canvas.renderAll();

      // Fade in animation
      const animate = () => {
        const currentOpacity = designRect.opacity!;
        if (currentOpacity < 0.9) {
          designRect.set('opacity', Math.min(currentOpacity + 0.1, 0.9));
          canvas.renderAll();
          requestAnimationFrame(animate);
        } else {
          designRect.set('opacity', 0.9);
          canvas.renderAll();
        }
      };
      animate();

    } catch (error) {
      console.error('Error applying design:', error);
    }
  };

  return (
    <div className="relative h-full flex items-center justify-center p-6">
      {isSegmenting && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Wall Detection
            </h3>
            <p className="text-gray-600 flex items-center justify-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              Analyzing wall structure and lighting...
            </p>
          </div>
        </motion.div>
      )}
      
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full border border-gray-200 rounded-xl shadow-lg"
      />
      
      {!imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Canvas ready for wall visualization</p>
        </div>
      )}
    </div>
  );
}