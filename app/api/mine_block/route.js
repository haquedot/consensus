import { NextResponse } from 'next/server';
import { addPowBlock } from '../_state';

export function GET() {
  const block = addPowBlock();
  return NextResponse.json({
    message: 'Congratulations, you successfully mined a block!',
    index: block.index,
    time_stamp: block.timestamp,
    previous_hash: block.previous_hash,
    proof: block.proof,
  });
}
