import { NextRequest, NextResponse } from 'next/server';
import { ottTopologyService } from '@/lib/ottTopologyService';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const format = contentType.includes('json') ? 'json' : 'csv';
    const text = await req.text();
    const result = ottTopologyService.ingestCorridors(text, format);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}