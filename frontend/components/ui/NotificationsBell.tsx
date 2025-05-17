'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logError } from '@/utils/logger';

const SUPABASE_URL: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const NotificationsBell = () => {
  const [count, setCount] = useState<number>(0);

  const getUnread = async () => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Missing Supabase URL or Anon Key');
      return;
    }

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCount(data.length);
    } catch (error) {
      logError('Error fetching unread notifications:', error);
    }
  };

  useEffect(() => {
    getUnread();
    const interval = setInterval(getUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/notifications" className="relative text-xl">
      {'🔔'}
      {count > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs leading-none">
          {count}
        </span>
      )}
    </Link>
  );
};

export default NotificationsBell;
