'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SchedulesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/events');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">リダイレクト中...</p>
        <p className="text-sm text-gray-500">
          スケジュールページはイベントページに統合されました
        </p>
      </div>
    </div>
  );
}
