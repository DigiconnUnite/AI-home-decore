'use client';

import { 
  Download, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Square,
  Undo2,
  Redo2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarProps {
  onExport: () => void;
  canvasRef: any;
  isProcessing: boolean;
}

export function Toolbar({ onExport, canvasRef, isProcessing }: ToolbarProps) {
  const handleZoomIn = () => {
    if (canvasRef) {
      const zoom = canvasRef.getZoom();
      canvasRef.setZoom(Math.min(zoom * 1.2, 3));
    }
  };

  const handleZoomOut = () => {
    if (canvasRef) {
      const zoom = canvasRef.getZoom();
      canvasRef.setZoom(Math.max(zoom / 1.2, 0.3));
    }
  };

  const handleResetView = () => {
    if (canvasRef) {
      canvasRef.setZoom(1);
      canvasRef.setViewportTransform([1, 0, 0, 1, 0, 0]);
    }
  };

  const tools = [
    { icon: Undo2, label: 'Undo', action: () => {} },
    { icon: Redo2, label: 'Redo', action: () => {} },
    null, // separator
    { icon: Move, label: 'Pan', action: () => {} },
    { icon: Square, label: 'Select', action: () => {} },
    null, // separator
    { icon: ZoomIn, label: 'Zoom In', action: handleZoomIn },
    { icon: ZoomOut, label: 'Zoom Out', action: handleZoomOut },
    { icon: RotateCcw, label: 'Reset View', action: handleResetView },
    null, // separator
    { icon: Download, label: 'Export', action: onExport, primary: true },
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <TooltipProvider>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {tools.map((tool, index) => {
              if (tool === null) {
                return <Separator key={index} orientation="vertical" className="h-8 mx-2" />;
              }

              const Icon = tool.icon;
              return (
                <Tooltip key={tool.label}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool.primary ? "default" : "ghost"}
                      size="icon"
                      onClick={tool.action}
                      disabled={isProcessing}
                      className={[
                        "h-10 w-10 transition-all duration-200",
                        tool.primary ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""
                      ].filter(Boolean).join(" ")}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tool.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Ready</span>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}