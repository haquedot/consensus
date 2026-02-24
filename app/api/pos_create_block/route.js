import { NextResponse } from 'next/server';
import { addPosBlock, getPosChain, selectValidator } from '../_state';

export async function POST(request) {
  // Accept optional `mode` to control selection: 'random' (default) or 'highest'
  const { data = 'Initial Data', mode = 'random' } = await request.json();
  try {
    // If caller requested deterministic selection, pre-select and pass it into the block creation
    if (mode === 'highest') {
      const chosen = selectValidator('highest');
      const block = addPosBlock(data, chosen);
      return NextResponse.json({ block, chain_length: getPosChain().length });
    }

    const block = addPosBlock(data);
    return NextResponse.json({ block, chain_length: getPosChain().length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
