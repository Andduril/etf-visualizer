import { syncEtfs } from '@/src/jobs/syncEtfs';
import { mapError } from '@/src/lib/api';
import { NextResponse } from 'next/server';

export async function GET(_: Request) {
  try {
    await syncEtfs();

    return NextResponse.json(null, { status: 200 });
  } catch (err) {
    console.error('[cron/etfs/sync] failed:', err);

    const mapped = mapError(err);
    return NextResponse.json({ ok: false, error: mapped.body }, { status: mapped.status });
  }
}
