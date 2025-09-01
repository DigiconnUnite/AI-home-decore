import { NextRequest, NextResponse } from 'next/server';
import { detectObjects } from '@/lib/ai-models';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Detect objects using AI
    const result = await detectObjects(imageUrl);

    return NextResponse.json({
      success: true,
      objects: {
        detectedObjects: result.objects,
        processingTime: Date.now(),
      }
    });
  } catch (error) {
    console.error('Object detection API error:', error);
    return NextResponse.json(
      { error: 'Failed to detect objects' },
      { status: 500 }
    );
  }
}
