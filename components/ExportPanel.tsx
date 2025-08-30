'use client';

import { useState } from 'react';
import { Download, Share2, Save, Sparkles, Camera, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ExportPanelProps {
  onExport: () => void;
  canvasRef: any;
  uploadedImage: string | null;
}

export function ExportPanel({ onExport, canvasRef, uploadedImage }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleHighResExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onExport();
    setIsExporting(false);
  };

  const exportOptions = [
    {
      name: 'High Resolution',
      description: 'Perfect for printing',
      format: 'PNG',
      size: '4K',
      icon: FileImage,
      action: handleHighResExport,
      premium: true,
    },
    {
      name: 'Social Media',
      description: 'Optimized for sharing',
      format: 'JPG',
      size: '1080p',
      icon: Share2,
      action: onExport,
      premium: false,
    },
    {
      name: 'Quick Preview',
      description: 'Fast download',
      format: 'PNG',
      size: '720p',
      icon: Download,
      action: onExport,
      premium: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Project Info */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <span>Project Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Ready to export</span>
            </div>
          </div>
          
          {uploadedImage && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Original Image</p>
              <div className="w-full h-20 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={uploadedImage} 
                  alt="Original wall"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-600" />
            <span>Export Options</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {exportOptions.map((option) => (
            <div key={option.name}>
              <Button
                variant="ghost"
                className="w-full justify-start p-4 h-auto hover:bg-gray-50 transition-all duration-200"
                onClick={option.action}
                disabled={isExporting || !uploadedImage}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <option.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{option.name}</p>
                      {option.premium && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{option.description}</p>
                    <p className="text-xs text-gray-500">{option.format} • {option.size}</p>
                  </div>
                </div>
              </Button>
              {option !== exportOptions[exportOptions.length - 1] && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" disabled={!uploadedImage}>
              <Save className="w-4 h-4 mr-2" />
              Save Project
            </Button>
            <Button variant="outline" size="sm" disabled={!uploadedImage}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Processing Status */}
      {isExporting && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div>
                <p className="font-medium text-blue-900">Generating Export</p>
                <p className="text-xs text-blue-700">Applying AI enhancements...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}