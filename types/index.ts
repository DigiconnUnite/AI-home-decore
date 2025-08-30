export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription?: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  originalImageUrl: string;
  resultImageUrl?: string;
  designs: AppliedDesign[];
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppliedDesign {
  id: string;
  designId: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  opacity: number;
  rotation?: number;
  scale?: number;
}

export interface AIProcessingJob {
  id: string;
  type: 'segmentation' | 'style-transfer' | 'depth-estimation';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  inputImageUrl: string;
  resultData?: any;
  processingTime?: number;
  error?: string;
  createdAt: Date;
}

export interface DesignCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  designCount: number;
}

export interface CanvasState {
  objects: any[];
  version: string;
  timestamp: Date;
}