'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DraftModeIndicator() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const exitDraftMode = async () => {
    setIsExiting(true);
    const currentPath = window.location.pathname;
    await fetch(`/api/disable-draft?redirect=${encodeURIComponent(currentPath)}`);
    router.refresh();
    setIsExiting(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="font-medium">Preview Mode</span>
        </div>
        <button
          onClick={exitDraftMode}
          disabled={isExiting}
          className="bg-white text-orange-500 px-3 py-1 rounded text-sm font-medium hover:bg-orange-50 transition-colors disabled:opacity-50"
        >
          {isExiting ? 'Exiting...' : 'Exit'}
        </button>
      </div>
    </div>
  );
}
