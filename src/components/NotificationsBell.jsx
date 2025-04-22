// src/components/NotificationsBell.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

export default function NotificationsBell() {
  const [count, setCount] = useState(0);

  // ───────────────────────────────────────────────
  // 1. Load current unread count
  // 2. Subscribe to realtime INSERTS on notifications
  // ───────────────────────────────────────────────
  useEffect(() => {
    // initial count
    const getUnread = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);
      setCount(count);
    };
    getUnread();

    // realtime listener
    const channel = supabase
      .channel('user:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        ({ new: n }) => {
          setCount((prev) => prev + 1);

          // toast message based on type
          const msg =
            n.type === 'contract_offer'
              ? '📑  New contract offer!'
              : n.type === 'contract_accepted'
              ? '✅  Your contract was accepted!'
              : n.type === 'result_approved'
              ? '🏆  Match result approved!'
              : '🔔  New notification';

          toast(msg);
        }
      )
      .subscribe();

    // cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Link to="/notifications" style={{ position: 'relative', fontSize: 20 }}>
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
