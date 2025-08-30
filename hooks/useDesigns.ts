'use client';

import { useState, useEffect } from 'react';

export interface Design {
  id: string;
  name: string;
  category: 'pvc' | 'wallpaper' | 'paint' | 'texture';
  url: string;
  color?: string;
  preview: string;
  tags?: string[];
  price?: number;
}

const mockDesigns: Design[] = [
  // PVC Panels
  {
    id: 'pvc-wood-oak',
    name: 'Oak Wood Grain',
    category: 'pvc',
    url: 'https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg',
    preview: 'https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg?w=100&h=100&fit=crop',
    tags: ['wood', 'natural', 'warm'],
    price: 25.99,
  },
  {
    id: 'pvc-marble-white',
    name: 'Carrara Marble',
    category: 'pvc',
    url: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg',
    preview: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?w=100&h=100&fit=crop',
    tags: ['marble', 'luxury', 'white'],
    price: 35.99,
  },
  {
    id: 'pvc-brick-exposed',
    name: 'Exposed Brick',
    category: 'pvc',
    url: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg',
    preview: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=100&h=100&fit=crop',
    tags: ['brick', 'industrial', 'rustic'],
    price: 28.99,
  },

  // Wallpapers
  {
    id: 'wp-geometric-modern',
    name: 'Modern Geometric',
    category: 'wallpaper',
    url: 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg',
    preview: 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?w=100&h=100&fit=crop',
    tags: ['geometric', 'modern', 'pattern'],
    price: 18.99,
  },
  {
    id: 'wp-botanical-green',
    name: 'Botanical Garden',
    category: 'wallpaper',
    url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    preview: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=100&h=100&fit=crop',
    tags: ['botanical', 'green', 'nature'],
    price: 22.99,
  },
  {
    id: 'wp-abstract-blue',
    name: 'Ocean Waves',
    category: 'wallpaper',
    url: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg',
    preview: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?w=100&h=100&fit=crop',
    tags: ['abstract', 'blue', 'waves'],
    price: 24.99,
  },

  // Paint Colors
  {
    id: 'paint-navy-deep',
    name: 'Deep Navy',
    category: 'paint',
    color: '#1e3a8a',
    url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%231e3a8a"/></svg>',
    preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%231e3a8a"/></svg>',
    tags: ['blue', 'dark', 'sophisticated'],
    price: 12.99,
  },
  {
    id: 'paint-sage-green',
    name: 'Sage Garden',
    category: 'paint',
    color: '#84cc16',
    url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%2384cc16"/></svg>',
    preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%2384cc16"/></svg>',
    tags: ['green', 'natural', 'calm'],
    price: 14.99,
  },
  {
    id: 'paint-terracotta',
    name: 'Terracotta Sunset',
    category: 'paint',
    color: '#ea580c',
    url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%23ea580c"/></svg>',
    preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%23ea580c"/></svg>',
    tags: ['orange', 'warm', 'earth'],
    price: 13.99,
  },
];

export function useDesigns() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDesigns(mockDesigns);
      setLoading(false);
    }, 500);
  }, []);

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || design.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getDesignsByCategory = (category: string) => {
    return designs.filter(design => design.category === category);
  };

  return {
    designs: filteredDesigns,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    getDesignsByCategory,
  };
}