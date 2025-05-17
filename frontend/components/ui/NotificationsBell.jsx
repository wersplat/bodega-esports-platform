// src/components/NotificationsBell.jsx

import { useEffect, useState } from 'react';
// NOTE: If you need SSR env vars, consider using process.env safely or next/config
import Link from 'next/link';
import { logError } from '../../utils/logger';

// Hardcoded values for development
// For SSR/CSR compatibility, read from window if available
const SUPABASE_URL = typeof window !== 'undefined' ? window.NEXT_PUBLIC_SUPABASE_URL : '';
const SUPABASE_ANON_KEY = typeof window !== 'undefined' ? window.NEXT_PUBLIC_SUPABASE_ANON_KEY : '';

export default function NotificationsBell() {
  const [count, setCount] = useState(0);

  // ───────────────────────────────────────────────
  // 1. Load current unread count
  // 2. Subscribe to realtime INSERTS on notifications
  // ───────────────────────────────────────────────
  const getUnread = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/notifications?is_read=eq.false`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      const data = await response.json();
      setCount(data.length);
    } catch (error) {
      logError('Error fetching unread notifications:', error);
    }
  };

  useEffect(() => {
    getUnread();

    // Simulate real-time updates (replace with actual WebSocket or polling logic if needed)
    const interval = setInterval(() => {
      getUnread();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/notifications" style={{ position: 'relative', fontSize: 20 }}>
      🔔
      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -4,
            right: -8,
            background: '#ef4444',
            color: '#fff',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: 12,
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
