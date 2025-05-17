import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';
// Create and use theme
const AppTheme = theme;

// Components
import Navbar from '@/components/Navbar';


// Pages
import Login from '@/pages/Login';
import Register from '@/pages/register';
import Dashboard from '@/pages/dashboard';
import LeagueBrowser from '@/pages/league-browser';
import RegisterTeam from '@/pages/register-team';
import SubmitPlayerStats from '@/pages/submit-player-stats';
import SubmitResult from '@/pages/submit-result';
import Matches from '@/pages/matches';
import PublicMatches from '@/pages/public-matches';
import PublicBracket from '@/pages/public-bracket';
import Champion from '@/pages/champion';
import Leaderboard from '@/pages/leaderboard';
import Standings from '@/pages/standings';
import PlayerProfile from '@/pages/player-profile';
import LeagueTeams from '@/pages/league-teams';
import OwnerSendContract from '@/pages/owner-send-contract';
import MyContracts from '@/pages/my-contracts';
import Notifications from '@/pages/notifications';
import Admin from '@/pages/admin';
import AdminReviewMatches from '@/pages/admin-review-matches';
import AdminSubmitResult from '@/pages/admin-submit-result';
import AdminCreateLeague from '@/pages/admin-create-league';
import AdminAddTeam from '@/pages/admin-add-team';
import AdminScheduleMatch from '@/pages/admin-schedule-match';
import AdminReviewStats from '@/pages/admin-review-stats';
import AdminRosterLock from '@/pages/admin-roster-lock';
import SendAnnouncement from '@/pages/send-announcement';
import AdminManageWebhooks from '@/pages/admin-manage-webhooks';
import AdminReviewBoard from '@/pages/admin-review-board';
import LeagueSettings from '@/pages/league-settings';

function App() {
  const router = useRouter();
const pathname = router.pathname;

  useEffect(() => {
    const existing = document.getElementById('dynamic-theme');
    if (existing) existing.remove();

    const link = document.createElement('link');
    link.id = 'dynamic-theme';
    link.rel = 'stylesheet';
    link.href = '/combined-theme.css'; // Updated to use the combined theme file

    document.head.appendChild(link);
  }, [pathname]);

  useEffect(() => {
    const themeClass = pathname.startsWith('/alt')
      ? 'theme-alt-dark'
      : pathname.startsWith('/roadto24k')
      ? 'theme-roadto24k'
      : 'theme-dark';

    document.body.className = themeClass; // Dynamically set the theme class on the body element
  }, [pathname]);

  return (
    <>
      {/* Always render Navbar */}
      <Navbar />
      <div className="main-content">
        
      </div>
    </>
  );
}


export default function AppWrapper() {
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      
    </ThemeProvider>
  );
}
