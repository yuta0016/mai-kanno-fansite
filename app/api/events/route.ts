import { NextResponse } from 'next/server';
import { client } from '@/lib/microcms';
import type { Event, MicroCMSListResponse } from '@/lib/microcms';

export async function GET() {
  try {
    const allEvents: Event[] = [];
    let offset = 0;
    const limit = 100;

    // 全件取得（ページネーション）
    while (true) {
      const response = await client.get<MicroCMSListResponse<Event>>({
        endpoint: 'events',
        queries: {
          limit,
          offset,
        },
      });

      allEvents.push(...response.contents);

      if (response.contents.length < limit) {
        break;
      }

      offset += limit;
    }

    return NextResponse.json({ events: allEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
