'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { CanvasEditor } from '@/components/CanvasEditor';
import { DesignPalette } from '@/components/DesignPalette';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { ExportPanel } from '@/components/ExportPanel';
import { ClientOnly } from '@/components/ClientOnly';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canvasRef, setCanvasRef] = useState<any>(null);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  const handleDesignSelect = (design: any) => {
    setSelectedDesign(design);
  };

  const handleExport = () => {
    if (canvasRef) {
      const dataURL = canvasRef.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2
      });
      
      const link = document.createElement('a');
      link.download = 'wall-design.png';
      link.href = dataURL;
      link.click();
    }
  };

  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI Wall Visualizer...</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {!uploadedImage ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Transform Your Space with{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Visualization
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Upload a photo of your wall and instantly see how different designs, colors, and materials will look in your space.
                </p>
              </div>
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
              {/* Design Palette */}
              <div className="xl:col-span-1 order-2 xl:order-1">
                <DesignPalette
                  onDesignSelect={handleDesignSelect}
                  selectedDesign={selectedDesign}
                />
              </div>

              {/* Main Canvas Area */}
              <div className="xl:col-span-2 order-1 xl:order-2 relative">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-full overflow-hidden">
                  <Toolbar
                    onExport={handleExport}
                    canvasRef={canvasRef}
                    isProcessing={isProcessing}
                  />
                  <CanvasEditor
                    imageUrl={uploadedImage}
                    selectedDesign={selectedDesign}
                    setCanvasRef={setCanvasRef}
                    setIsProcessing={setIsProcessing}
                  />
                </div>
              </div>

              {/* Export Panel */}
              <div className="xl:col-span-1 order-3">
                <ExportPanel
                  onExport={handleExport}
                  canvasRef={canvasRef}
                  uploadedImage={uploadedImage}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </ClientOnly>
  );
}