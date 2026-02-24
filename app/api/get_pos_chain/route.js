import { NextResponse } from 'next/server';
import { getPosChain } from '../_state';

export function GET() {
  const chain = getPosChain();
  return NextResponse.json({ chain, length: chain.length });
}
