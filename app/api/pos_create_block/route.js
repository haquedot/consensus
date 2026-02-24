import { NextResponse } from 'next/server';
import { addPosBlock, getPosChain } from '../_state';

export async function POST(request) {
  const { data = 'Initial Data' } = await request.json();
  try {
    const block = addPosBlock(data);
    return NextResponse.json({ block, chain_length: getPosChain().length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
