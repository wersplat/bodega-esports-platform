import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  type: string;
  payload?: {
    team_id?: string;
    player_id?: string;
    match_id?: string;
    [key: string]: any;
  };
  created_at: string;
}

const Notifications: React.FC = () => {
  const [list, setList] = useState<Notification[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://api.bodegacatsgc.gg/notifications');
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        setList(data);

        // Mark all unread as read
        await fetch('https://api.bodegacatsgc.gg/notifications/mark-read', { method: 'POST' });
      } catch (err) {
        // Optionally log or display error
      }
    })();
  }, []);

  const renderText = (n: Notification): string => {
    switch (n.type) {
      case 'contract_offer':
        return `You received a contract offer (team ${n.payload?.team_id})`;
      case 'contract_accepted':
        return `Player accepted your contract offer (player ${n.payload?.player_id})`;
      case 'result_approved':
        return `Match result approved (match ${n.payload?.match_id})`;
      default:
        return n.type;
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Notifications</h1>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {list.map((n) => (
          <li
            key={n.id}
            style={{
              marginBottom: 12,
              background: '#222b3a',
              color: '#f8fafc',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 0 6px rgba(0,0,0,0.18)',
            }}
          >
            {renderText(n)} —{' '}
            <span style={{ color: '#cbd5e1' }}>{new Date(n.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
