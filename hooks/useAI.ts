import { useState, useCallback } from 'react';
import { 
  processWallSegmentation, 
  applyStyleTransfer, 
  estimateDepth, 
  extractColorPalette, 
  detectObjects,
  initializeAIModels,
  getModelStatus
} from '@/lib/ai-models';

export interface AIProcessingState {
  isProcessing: boolean;
  currentOperation: string;
  progress: number;
  error: string | null;
}

export interface AIResults {
  segmentation: any;
  depthEstimation: any;
  colorPalette: any;
  objectDetection: any;
  styleTransfer: any;
}

export function useAI() {
  const [state, setState] = useState<AIProcessingState>({
    isProcessing: false,
    currentOperation: '',
    progress: 0,
    error: null,
  });

  const [results, setResults] = useState<AIResults>({
    segmentation: null,
    depthEstimation: null,
    colorPalette: null,
    objectDetection: null,
    styleTransfer: null,
  });

  const [modelStatus, setModelStatus] = useState(getModelStatus());

  // Initialize AI models
  const initializeModels = useCallback(async () => {
    setState(prev => ({ ...prev, isProcessing: true, currentOperation: 'Initializing AI models...' }));
    
    try {
      const success = await initializeAIModels();
      if (success) {
        setModelStatus(getModelStatus());
        setState(prev => ({ ...prev, isProcessing: false, currentOperation: '', progress: 100 }));
      } else {
        throw new Error('Failed to initialize AI models');
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        currentOperation: ''
      }));
    }
  }, []);

  // Process wall segmentation
  const processSegmentation = useCallback(async (imageUrl: string) => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      currentOperation: 'Analyzing wall structure...',
      progress: 0,
      error: null 
    }));

    try {
      setState(prev => ({ ...prev, progress: 25 }));
      const result = await processWallSegmentation(imageUrl);
      
      setResults(prev => ({ ...prev, segmentation: result }));
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        currentOperation: '',
        progress: 100 
      }));

      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Segmentation failed',
        currentOperation: ''
      }));
      throw error;
    }
  }, []);

  // Estimate depth
  const processDepthEstimation = useCallback(async (imageUrl: string) => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      currentOperation: 'Estimating depth and perspective...',
      progress: 0,
      error: null 
    }));

    try {
      setState(prev => ({ ...prev, progress: 25 }));
      const result = await estimateDepth(imageUrl);
      
      setResults(prev => ({ ...prev, depthEstimation: result }));
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        currentOperation: '',
        progress: 100 
      }));

      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Depth estimation failed',
        currentOperation: ''
      }));
      throw error;
    }
  }, []);

  // Extract color palette
  const processColorPalette = useCallback(async (imageUrl: string, colorCount: number = 5) => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      currentOperation: 'Extracting color palette...',
      progress: 0,
      error: null 
    }));

    try {
      setState(prev => ({ ...prev, progress: 25 }));
      const result = await extractColorPalette(imageUrl, colorCount);
      
      setResults(prev => ({ ...prev, colorPalette: result }));
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        currentOperation: '',
        progress: 100 
      }));

      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Color palette extraction failed',
        currentOperation: ''
      }));
      throw error;
    }
  }, []);

  // Detect objects
  const processObjectDetection = useCallback(async (imageUrl: string) => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      currentOperation: 'Detecting objects in scene...',
      progress: 0,
      error: null 
    }));

    try {
      setState(prev => ({ ...prev, progress: 25 }));
      const result = await detectObjects(imageUrl);
      
      setResults(prev => ({ ...prev, objectDetection: result }));
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        currentOperation: '',
        progress: 100 
      }));

      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Object detection failed',
        currentOperation: ''
      }));
      throw error;
    }
  }, []);

  // Apply style transfer
  const processStyleTransfer = useCallback(async (
    originalImageUrl: string, 
    styleImageUrl: string, 
    maskData?: ImageData
  ) => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      currentOperation: 'Applying style transfer...',
      progress: 0,
      error: null 
    }));

    try {
      setState(prev => ({ ...prev, progress: 25 }));
      const result = await applyStyleTransfer(originalImageUrl, styleImageUrl, maskData);
      
      setResults(prev => ({ ...prev, styleTransfer: result }));
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        currentOperation: '',
        progress: 100 
      }));

      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Style transfer failed',
        currentOperation: ''
      }));
      throw error;
    }
  }, []);

  // Comprehensive image analysis
  const analyzeImage = useCallback(async (imageUrl: string) => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      currentOperation: 'Starting comprehensive analysis...',
      progress: 0,
      error: null 
    }));

    try {
      // Initialize models if needed
      if (!modelStatus.initialized) {
        await initializeModels();
      }

      // Run all analyses in parallel
      setState(prev => ({ ...prev, currentOperation: 'Running AI analyses...', progress: 10 }));
      
      const [segmentation, depth, palette, objects] = await Promise.all([
        processSegmentation(imageUrl),
        processDepthEstimation(imageUrl),
        processColorPalette(imageUrl),
        processObjectDetection(imageUrl),
      ]);

      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        currentOperation: 'Analysis complete!',
        progress: 100 
      }));

      return {
        segmentation,
        depthEstimation: depth,
        colorPalette: palette,
        objectDetection: objects,
      };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Analysis failed',
        currentOperation: ''
      }));
      throw error;
    }
  }, [modelStatus.initialized, initializeModels, processSegmentation, processDepthEstimation, processColorPalette, processObjectDetection]);

  // Clear results
  const clearResults = useCallback(() => {
    setResults({
      segmentation: null,
      depthEstimation: null,
      colorPalette: null,
      objectDetection: null,
      styleTransfer: null,
    });
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    isProcessing: state.isProcessing,
    currentOperation: state.currentOperation,
    progress: state.progress,
    error: state.error,
    results,
    modelStatus,

    // Actions
    initializeModels,
    processSegmentation,
    processDepthEstimation,
    processColorPalette,
    processObjectDetection,
    processStyleTransfer,
    analyzeImage,
    clearResults,
    clearError,
  };
}
