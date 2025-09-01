'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { motion } from 'framer-motion';
import { Loader2, Zap, Brain, Target, AlertCircle } from 'lucide-react';
import { ClientOnly } from './ClientOnly';

interface CanvasEditorProps {
  imageUrl: string;
  selectedDesign: any;
  setCanvasRef: (canvas: any) => void;
  setIsProcessing: (processing: boolean) => void;
}

function CanvasEditorContent({ 
  imageUrl, 
  selectedDesign, 
  setCanvasRef, 
  setIsProcessing 
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [wallMask, setWallMask] = useState<any>(null);
  const [aiStatus, setAiStatus] = useState<string>('Initializing...');
  const [segmentationResult, setSegmentationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiModelsLoaded, setAiModelsLoaded] = useState(false);

  // Initialize AI models
  useEffect(() => {
    const initializeAI = async () => {
      try {
        setAiStatus('Loading AI models...');
        // Try to load AI models, but don't fail if they don't load
        const { initializeAIModels } = await import('@/lib/ai-models');
        const success = await initializeAIModels();
        setAiModelsLoaded(success);
        setAiStatus(success ? 'AI models ready' : 'Using fallback detection');
      } catch (error) {
        console.warn('AI models failed to load, using fallback:', error);
        setAiModelsLoaded(false);
        setAiStatus('Using fallback detection');
      }
    };

    initializeAI();
  }, []);

  // Helper to safely clear and dispose previous canvas
  const disposeCanvas = useCallback(() => {
    if (canvas) {
      try {
        canvas.dispose();
      } catch (e) {
        console.warn('Error disposing canvas:', e);
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

    try {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#f8fafc',
        preserveObjectStacking: true,
      });

      setCanvas(fabricCanvas);
      setCanvasRef(fabricCanvas);
      setError(null);

      return () => {
        try {
          fabricCanvas.dispose();
        } catch (e) {
          console.warn('Error disposing fabric canvas:', e);
        }
        setCanvas(null);
      };
    } catch (error) {
      console.error('Error creating fabric canvas:', error);
      setError('Failed to initialize canvas');
    }
  }, [setCanvasRef]);

  // Load image when canvas or imageUrl changes
  useEffect(() => {
    if (canvas && imageUrl) {
      loadImageToCanvas();
    }
  }, [canvas, imageUrl]);

  // Apply design when all dependencies are ready
  useEffect(() => {
    if (canvas && selectedDesign && wallMask) {
      applyDesignToWall();
    }
  }, [canvas, selectedDesign, wallMask]);

  // Defensive: clear wallMask when image changes
  useEffect(() => {
    setWallMask(null);
    setSegmentationResult(null);
    setError(null);
  }, [imageUrl]);

  const loadImageToCanvas = async () => {
    if (!canvas) return;

    setIsSegmenting(true);
    setIsProcessing(true);
    setAiStatus('Loading image...');
    setError(null);

    try {
      // Safely clear canvas
      if (canvas.getContext && canvas.getContext()) {
        canvas.clear();
      }

      // Load image with error handling
      const img: fabric.Image = await new Promise((resolve, reject) => {
        fabric.Image.fromURL(imageUrl, {
          crossOrigin: 'anonymous'
        }, (image: fabric.Image | null) => {
          if (image) {
            resolve(image);
          } else {
            reject(new Error('Failed to load image'));
          }
        });
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

      // Safely add image to canvas
      if (canvas.getContext && canvas.getContext()) {
        canvas.clear();
        canvas.add(img);
        canvas.renderAll();
      }

      // Perform AI wall segmentation or fallback
      if (aiModelsLoaded) {
        await performAISegmentation(img);
      } else {
        await performFallbackSegmentation(img);
      }

    } catch (error) {
      console.error('Error loading image:', error);
      setError('Failed to load image. Please try again.');
      setAiStatus('Error processing image');
    } finally {
      setIsSegmenting(false);
      setIsProcessing(false);
    }
  };

  const performAISegmentation = async (img: fabric.Image) => {
    try {
      setAiStatus('Analyzing wall structure...');

      // Import AI models dynamically to prevent SSR issues
      const { processWallSegmentation, estimateDepth, extractColorPalette } = await import('@/lib/ai-models');

      // Perform wall segmentation using AI
      const result = await processWallSegmentation(imageUrl);
      setSegmentationResult(result);

      setAiStatus('Detecting wall boundaries...');

      // Create wall mask visualization
      const maskRect = new fabric.Rect({
        left: (img.left || 0) + result.bounds.x * (img.scaleX || 1),
        top: (img.top || 0) + result.bounds.y * (img.scaleY || 1),
        width: result.bounds.width * (img.scaleX || 1),
        height: result.bounds.height * (img.scaleY || 1),
        fill: 'rgba(59, 130, 246, 0.3)',
        stroke: '#3b82f6',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        opacity: 0.7,
      });

      if (canvas && canvas.getContext && canvas.getContext()) {
        canvas.add(maskRect);
        canvas.renderAll();
      }

      setWallMask(maskRect);

      // Perform additional AI analysis
      setAiStatus('Estimating depth and perspective...');
      await estimateDepth(imageUrl);

      setAiStatus('Extracting color palette...');
      await extractColorPalette(imageUrl);

      setAiStatus('AI analysis complete!');

    } catch (error) {
      console.error('AI segmentation error:', error);
      setAiStatus('AI analysis failed - using fallback detection');

      // Fallback to simple wall detection
      await performFallbackSegmentation(img);
    }
  };

  const performFallbackSegmentation = async (img: fabric.Image) => {
    try {
      setAiStatus('Using fallback wall detection...');

      // Simple fallback wall detection
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

      if (canvas && canvas.getContext && canvas.getContext()) {
        canvas.add(maskRect);
        canvas.renderAll();
      }

      setWallMask(maskRect);
      setSegmentationResult({
        confidence: 0.5,
        bounds: {
          x: 50,
          y: 100,
          width: ((img.width || 0) * (img.scaleX || 1)) - 100,
          height: ((img.height || 0) * (img.scaleY || 1)) - 200,
        }
      });

      setAiStatus('Fallback detection complete');
    } catch (error) {
      console.error('Fallback segmentation error:', error);
      setError('Failed to detect wall area');
    }
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
        fabric.Image.fromURL(selectedDesign.url, {
          crossOrigin: 'anonymous'

        }, (image: fabric.Image | null) => {
          if (image) resolve(image);
          else reject(new Error('Failed to load design image'));
        });
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

      if (canvas.getContext && canvas.getContext()) {
        canvas.add(designRect);
        canvas.renderAll();
      }

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
      setError('Failed to apply design to wall');
    }
  };

  return (
    <div className="relative h-full flex items-center justify-center p-6">
      {error && (
        <div
          className="absolute top-4 right-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2 z-20"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-800">{error}</span>
          </div>
        </div>
      )}

      {isSegmenting && (
        <div 
          className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {aiModelsLoaded ? 'AI Wall Analysis' : 'Wall Detection'}
            </h3>
            <p className="text-gray-600 flex items-center justify-center mb-4">
              <Target className="w-4 h-4 mr-2 text-blue-500" />
              {aiStatus}
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full border border-gray-200 rounded-xl shadow-lg"
      />
      
      {!imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Canvas ready for wall visualization</p>
          </div>
        </div>
      )}

      {/* AI Status Indicator */}
      {segmentationResult && (
        <div
          className="absolute top-4 left-4 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              {aiModelsLoaded ? 'AI Ready' : 'Fallback Ready'} ({(segmentationResult.confidence * 100).toFixed(0)}% confidence)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Export the component wrapped with ClientOnly
export function CanvasEditor(props: CanvasEditorProps) {
  return (
    <ClientOnly
      fallback={
        <div className="relative h-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing canvas...</p>
          </div>
        </div>
      }
    >
      <CanvasEditorContent {...props} />
    </ClientOnly>
  );
}