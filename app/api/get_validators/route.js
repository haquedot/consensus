import { NextResponse } from 'next/server';
import { getValidators } from '../_state';

export function GET() {
  return NextResponse.json({ validators: getValidators() });
}
