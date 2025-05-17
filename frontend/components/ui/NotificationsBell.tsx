import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { logError } from '../../utils/logger';

const SUPABASE_URL: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const NotificationsBell: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  const getUnread = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/notifications?is_read=eq.false`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY ?? '',
            Authorization: `Bearer ${SUPABASE_ANON_KEY ?? ''}`,
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
    const interval = setInterval(() => {
      getUnread();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/notifications" style={{ position: 'relative', fontSize: 20 }}>
      {'\uD83D\uDD14'}
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
};

export default NotificationsBell;
