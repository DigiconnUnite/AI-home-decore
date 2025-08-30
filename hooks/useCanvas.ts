'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { processWallSegmentation } from '@/lib/ai-models';
import { applyDesignPattern, clearDesigns, fitImageToCanvas } from '@/lib/fabric-utils';

export function useCanvas(canvasElement: HTMLCanvasElement | null) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [wallMask, setWallMask] = useState<any>(null);
  const historyRef = useRef<any[]>([]);
  const historyIndexRef = useRef(-1);

  useEffect(() => {
    if (canvasElement) {
      const fabricCanvas = new fabric.Canvas(canvasElement, {
        width: 800,
        height: 600,
        backgroundColor: '#f8fafc',
        preserveObjectStacking: true,
      });

      // Enable history tracking
      fabricCanvas.on('path:created', saveState);
      fabricCanvas.on('object:added', saveState);
      fabricCanvas.on('object:removed', saveState);
      fabricCanvas.on('object:modified', saveState);

      setCanvas(fabricCanvas);
      setIsReady(true);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [canvasElement]);

  const saveState = useCallback(() => {
    if (!canvas) return;
    
    const state = JSON.stringify(canvas.toJSON());
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(state);
    historyIndexRef.current++;
  }, [canvas]);

  const undo = useCallback(() => {
    if (!canvas || historyIndexRef.current <= 0) return;
    
    historyIndexRef.current--;
    const state = historyRef.current[historyIndexRef.current];
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
    });
  }, [canvas]);

  const redo = useCallback(() => {
    if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return;
    
    historyIndexRef.current++;
    const state = historyRef.current[historyIndexRef.current];
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
    });
  }, [canvas]);

  const loadImage = useCallback(async (imageUrl: string) => {
    if (!canvas) return;

    try {
      const img = await fabric.Image.fromURL(imageUrl);
      fitImageToCanvas(img, 800, 600);
      
      img.set({
        selectable: false,
        evented: false,
      });

      canvas.clear();
      canvas.add(img);
      canvas.renderAll();

      // Process wall segmentation
      const segmentationResult = await processWallSegmentation(imageUrl);
      
      // Create wall mask
      const mask = new fabric.Rect({
        left: segmentationResult.bounds.x,
        top: segmentationResult.bounds.y,
        width: segmentationResult.bounds.width,
        height: segmentationResult.bounds.height,
        fill: 'rgba(59, 130, 246, 0.2)',
        stroke: '#3b82f6',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      });

      canvas.add(mask);
      setWallMask(mask);
      canvas.renderAll();
      
      saveState();
    } catch (error) {
      console.error('Error loading image:', error);
    }
  }, [canvas, saveState]);

  const applyDesign = useCallback(async (design: any) => {
    if (!canvas || !wallMask) return;

    try {
      // Clear existing designs
      clearDesigns(canvas);

      // Apply new design
      const designObject = await applyDesignPattern(canvas, design, {
        x: wallMask.left,
        y: wallMask.top,
        width: wallMask.width,
        height: wallMask.height,
      });

      if (designObject) {
        canvas.add(designObject);
        canvas.renderAll();
        saveState();
      }
    } catch (error) {
      console.error('Error applying design:', error);
    }
  }, [canvas, wallMask, saveState]);

  return {
    canvas,
    isReady,
    wallMask,
    loadImage,
    applyDesign,
    undo,
    redo,
    saveState,
  };
}