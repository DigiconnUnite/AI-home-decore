import { NextRequest, NextResponse } from 'next/server';
import { extractColorPalette } from '@/lib/ai-models';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, colorCount = 5 } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Extract color palette using AI
    const result = await extractColorPalette(imageUrl, colorCount);

    return NextResponse.json({
      success: true,
      palette: {
        colors: result.colors,
        dominantColor: result.dominantColor,
        colorHarmony: result.colorHarmony,
        processingTime: Date.now(),
      }
    });
  } catch (error) {
    console.error('Color palette extraction API error:', error);
    return NextResponse.json(
      { error: 'Failed to extract color palette' },
      { status: 500 }
    );
  }
}
