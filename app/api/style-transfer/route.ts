import { NextRequest, NextResponse } from 'next/server';
import { applyStyleTransfer } from '@/lib/ai-models';

export async function POST(request: NextRequest) {
  try {
    const { originalImageUrl, styleImageUrl, maskData } = await request.json();
    
    if (!originalImageUrl || !styleImageUrl) {
      return NextResponse.json(
        { error: 'Original image URL and style image URL are required' },
        { status: 400 }
      );
    }

    // Apply style transfer using AI
    const result = await applyStyleTransfer(originalImageUrl, styleImageUrl, maskData);

    return NextResponse.json({
      success: true,
      result: {
        imageUrl: result.imageUrl,
        processingTime: result.processingTime,
        quality: result.quality,
      }
    });
  } catch (error) {
    console.error('Style transfer API error:', error);
    return NextResponse.json(
      { error: 'Failed to process style transfer' },
      { status: 500 }
    );
  }
}