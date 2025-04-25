// src/pages/Admin.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AdminNavButton from '../components/AdminNavButton';
import {
  PlusCircleIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  EyeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  MegaphoneIcon,
  LockClosedIcon,
  ServerIcon,
  TrophyIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline';

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
    <div className="main-content" style={{ color: '#f8fafc', background: 'transparent' }}>
      <h1 className="page-title">Admin Dashboard</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px', background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
        <AdminNavButton icon={PlusCircleIcon} label="Create League" path="/admin-create-league" />
        <AdminNavButton icon={UserGroupIcon} label="Add Team" path="/admin-add-team" />
        <AdminNavButton icon={CalendarDaysIcon} label="Schedule Match" path="/admin-schedule-match" />
        <AdminNavButton icon={ClipboardDocumentListIcon} label="Enter Match Results" path="/admin-match-results" />
        <AdminNavButton icon={ClipboardIcon} label="View Teams" path="/admin-view-teams" />
        <AdminNavButton icon={TrophyIcon} label="Manage Brackets" path="/admin-bracket-generator" />
        <AdminNavButton icon={ClipboardIcon} label="View Registered Teams" path="/leagues" />
        <AdminNavButton icon={EyeIcon} label="Review Matches" path="/admin-review-matches" />
        <AdminNavButton icon={ChartBarIcon} label="Review Player Stats" path="/admin-review-stats" />
        <AdminNavButton icon={ClipboardDocumentListIcon} label="Review Submissions" path="/admin-review-board" />
        <AdminNavButton icon={LockClosedIcon} label="Roster-Lock" path="/admin-roster-lock" />
        <AdminNavButton icon={MegaphoneIcon} label="Discord Announcement" path="/admin-discord-announce" />
        <AdminNavButton icon={ServerIcon} label="Manage Webhooks" path="/admin-manage-webhooks" />
        <AdminNavButton icon={Cog6ToothIcon} label="League Settings" path="/admin-league-settings" />
      </div>
    </div>
  );
}

export default Admin;
