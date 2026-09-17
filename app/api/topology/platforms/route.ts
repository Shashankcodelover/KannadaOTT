import { NextRequest, NextResponse } from 'next/server';
import { ottTopologyService } from '@/lib/ottTopologyService';
export const runtime = 'nodejs';
export async function GET() { return NextResponse.json({ platforms: ottTopologyService.getPlatforms() }); }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const platform = ottTopologyService.addPlatform(body);
    return NextResponse.json({ success: true, platform });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}