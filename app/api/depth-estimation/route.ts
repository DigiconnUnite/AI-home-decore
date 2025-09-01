import { NextRequest, NextResponse } from 'next/server';
import { estimateDepth } from '@/lib/ai-models';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Estimate depth using AI
    const result = await estimateDepth(imageUrl);

    return NextResponse.json({
      success: true,
      depth: {
        depthMap: result.depthMap,
        minDepth: result.minDepth,
        maxDepth: result.maxDepth,
        perspectiveCorrection: result.perspectiveCorrection,
        processingTime: Date.now(),
      }
    });
  } catch (error) {
    console.error('Depth estimation API error:', error);
    return NextResponse.json(
      { error: 'Failed to estimate depth' },
      { status: 500 }
    );
  }
}
