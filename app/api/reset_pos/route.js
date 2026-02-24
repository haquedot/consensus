import { NextResponse } from 'next/server';
import { resetPos } from '../_state';

export function POST() {
  resetPos();
  return NextResponse.json({ message: 'PoS simulation has been reset' });
}
