import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate('/');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">Admin Dashboard</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
        <button onClick={() => navigate('/admin-create-league')} className="form-button">
          ➕ Create League
        </button>
        <button onClick={() => navigate('/admin-add-team')} className="form-button">
          ➕ Add Team
        </button>
        <button onClick={() => navigate('/admin-schedule-match')} className="form-button">
          📅 Schedule Match {/* ✅ NEW BUTTON */}
        </button>
        <button onClick={() => navigate('/admin-match-results')} className="form-button">
          📝 Enter Match Results
        </button>
        <button onClick={() => navigate('/admin-view-teams')} className="form-button">
          📋 View Teams {/* ✅ NEW BUTTON */}
        </button>
        
        <button onClick={() => navigate('/admin-bracket-generator')} className="form-button">
          🏆 Manage Brackets
        </button>
        <button onClick={() => navigate('/leagues')} className="form-button">
          📋 View Registered Teams
        </button>
      </div>
    </div>
  );
}

export default Admin;
