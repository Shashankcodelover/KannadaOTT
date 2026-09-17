import { NextResponse } from 'next/server';
import { ottTopologyService } from '@/lib/ottTopologyService';
export const runtime = 'nodejs';
export async function GET() { return NextResponse.json(ottTopologyService.getOverview()); }