import { NextResponse } from 'next/server';
import { ottTopologyService } from '@/lib/ottTopologyService';
export const runtime = 'nodejs';
export async function POST() { return NextResponse.json(ottTopologyService.purgeCorridors()); }