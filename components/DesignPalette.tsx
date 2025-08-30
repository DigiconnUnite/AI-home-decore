'use client';

import { useState } from 'react';
import { Search, Palette, Wallpaper, Paintbrush, Layers, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'

interface Design {
  id: string;
  name: string;
  category: 'pvc' | 'wallpaper' | 'paint' | 'texture';
  url: string;
  color?: string;
  preview: string;
}

interface DesignPaletteProps {
  onDesignSelect: (design: Design) => void;
  selectedDesign: Design | null;
}

const designs: Design[] = [
  // PVC Panels
  {
    id: 'pvc-wood-oak',
    name: 'Oak Wood Grain',
    category: 'pvc',
    url: 'https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg',
    preview: 'https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg?w=100&h=100&fit=crop',
  },
  {
    id: 'pvc-marble-white',
    name: 'White Marble',
    category: 'pvc',
    url: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg',
    preview: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?w=100&h=100&fit=crop',
  },
  {
    id: 'pvc-brick-modern',
    name: 'Modern Brick',
    category: 'pvc',
    url: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg',
    preview: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=100&h=100&fit=crop',
  },
  
  // Wallpapers
  {
    id: 'wp-geometric-modern',
    name: 'Geometric Pattern',
    category: 'wallpaper',
    url: 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg',
    preview: 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?w=100&h=100&fit=crop',
  },
  {
    id: 'wp-floral-vintage',
    name: 'Vintage Floral',
    category: 'wallpaper',
    url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    preview: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=100&h=100&fit=crop',
  },
  {
    id: 'wp-abstract-blue',
    name: 'Abstract Blue',
    category: 'wallpaper',
    url: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg',
    preview: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?w=100&h=100&fit=crop',
  },

  // Paint Colors
  {
    id: 'paint-navy',
    name: 'Deep Navy',
    category: 'paint',
    color: '#1e3a8a',
    url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%231e3a8a"/></svg>',
    preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%231e3a8a"/></svg>',
  },
  {
    id: 'paint-sage',
    name: 'Sage Green',
    category: 'paint',
    color: '#84cc16',
    url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%2384cc16"/></svg>',
    preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%2384cc16"/></svg>',
  },
  {
    id: 'paint-terracotta',
    name: 'Terracotta',
    category: 'paint',
    color: '#ea580c',
    url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%23ea580c"/></svg>',
    preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%23ea580c"/></svg>',
  },
];

export function DesignPalette({ onDesignSelect, selectedDesign }: DesignPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pvc');
  // Fix: add isSegmenting state for demo purposes (default: false)
  const [isSegmenting, setIsSegmenting] = useState(false);

  const filteredDesigns = designs.filter(design => 
    design.category === activeTab &&
    design.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryIcons = {
    pvc: Layers,
    wallpaper: Wallpaper,
    paint: Paintbrush,
    texture: Palette,
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Design Library</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-0 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 p-1 m-6 mb-0 bg-gray-50">
          <TabsTrigger value="pvc" className="flex items-center space-x-2">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">PVC</span>
          </TabsTrigger>
          <TabsTrigger value="wallpaper" className="flex items-center space-x-2">
            <Wallpaper className="w-4 h-4" />
            <span className="hidden sm:inline">Paper</span>
          </TabsTrigger>
          <TabsTrigger value="paint" className="flex items-center space-x-2">
            <Paintbrush className="w-4 h-4" />
            <span className="hidden sm:inline">Paint</span>
          </TabsTrigger>
        </TabsList>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 pt-4">
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-2 gap-3">
              {filteredDesigns.map((design) => (
                <motion.div
                  key={design.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200",
                    selectedDesign?.id === design.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => onDesignSelect(design)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={design.preview}
                      alt={design.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedDesign?.id === design.id && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {design.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* AI Status */}
      {isSegmenting && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 m-6 mt-0 bg-blue-50 rounded-xl border border-blue-200"
        >
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <p className="text-sm font-medium text-blue-900">AI Processing</p>
              <p className="text-xs text-blue-700">Detecting wall surfaces...</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}