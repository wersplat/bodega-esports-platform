import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAlt = location.pathname.startsWith('/alt');

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
        <button onClick={() => navigate(isAlt ? '/alt/admin-create-league' : '/admin-create-league')} className="form-button">
          ➕ Create League
        </button>
        <button onClick={() => navigate(isAlt ? '/alt/admin-bracket-generator' : '/admin-bracket-generator')} className="form-button">
          🏆 Manage Brackets
        </button>
        <button onClick={() => navigate(isAlt ? '/alt/admin-add-team' : '/admin-add-team')} className="form-button">
          ➕ Add Team
        </button>
        <button onClick={() => navigate(isAlt ? '/alt/leagues' : '/leagues')} className="form-button">
          📋 View Registered Teams
        </button>
      </div>
    </div>
  );
}

export default Admin;
