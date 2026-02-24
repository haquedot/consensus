import { NextResponse } from 'next/server';
import { getPowChain } from '../_state';

export function GET() {
  const chain = getPowChain();
  return NextResponse.json({ chain, length: chain.length });
}
