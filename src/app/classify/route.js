import { NextResponse } from 'next/server'
import PipelineSingleton from './pipeline.js';

export async function GET(request) {
    const text = request.nextUrl.searchParams.get('text');
    if (!text) {
        return NextResponse.json({
            error: 'Missing text parameter',
        }, { status: 400 });
    }
    
    const classifier = await PipelineSingleton.getInstance();

    // perform the classification
    const result = await classifier(text);

    return NextResponse.json(result);
}