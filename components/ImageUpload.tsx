'use client';

import { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      processFile(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    
    // Create object URL for immediate preview
    const imageUrl = URL.createObjectURL(file);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onImageUpload(imageUrl);
    setIsUploading(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    // For now, just open file dialog - in production this would open camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        processFile(file);
      }
    };
    input.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Upload Area */}
      <div
        className={cn(
          "relative border-3 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer group",
          isDragOver 
            ? "border-blue-500 bg-blue-50 scale-105" 
            : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {isUploading ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Your Image
            </h3>
            <p className="text-gray-600">
              Preparing your wall for AI analysis...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Upload Your Wall Photo
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Drag and drop an image here, or click to browse your files.
              <br />
              For best results, use a clear, well-lit photo of your wall.
            </p>
            
            {/* Upload Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 px-8 py-3"
                size="lg"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Choose from Gallery
              </Button>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openCamera();
                }}
                variant="outline"
                className="border-2 hover:bg-gray-50 px-8 py-3"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Use Camera
              </Button>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Tips Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
            <Camera className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Good Lighting</h4>
          <p className="text-sm text-gray-600">
            Use natural light or bright room lighting for best results
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Clear View</h4>
          <p className="text-sm text-gray-600">
            Capture the full wall with minimal furniture or obstructions
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-orange-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">AI Ready</h4>
          <p className="text-sm text-gray-600">
            Our AI will automatically detect and segment your wall
          </p>
        </div>
      </div>
    </div>
  );
}