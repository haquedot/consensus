import { NextResponse } from 'next/server';
import { getValidators, setValidator } from '../_state';

export async function POST(request) {
  const { name, stake = 0 } = await request.json();
  if (!name) return NextResponse.json({ error: 'Validator name required' }, { status: 400 });
  if (stake < 10) return NextResponse.json({ error: 'Minimum stake is 10 tokens to ensure skin in the game' }, { status: 400 });
  setValidator(name, stake);
  return NextResponse.json({ message: `${name} successfully added/updated`, validators: getValidators() });
}
