// src/pages/Notifications.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Notifications() {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      setList(data);
      // mark all read
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
    })();
  }, []);

  const renderText = (n) => {
    switch (n.type) {
      case 'contract_offer':
        return `You received a contract offer (team ${n.payload.team_id})`;
      case 'contract_accepted':
        return `Player accepted your contract offer (player ${n.payload.player_id})`;
      case 'result_approved':
        return `Match result approved (match ${n.payload.match_id})`;
      default:
        return n.type;
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Notifications</h1>
      <ul>
        {list.map(n => (
          <li key={n.id} style={{ marginBottom: 12 }}>
            {renderText(n)} — {new Date(n.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
