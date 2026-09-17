import { NextResponse } from 'next/server';
import { ottTopologyService } from '@/lib/ottTopologyService';
export const runtime = 'nodejs';
export async function POST() {
  ottTopologyService.resetBaseline();
  return NextResponse.json({ success: true, overview: ottTopologyService.getOverview() });
}