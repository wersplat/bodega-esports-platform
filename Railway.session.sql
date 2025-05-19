WITH model_tables AS (
    -- List of tables that should exist based on SQLAlchemy models
    SELECT 'profiles' AS table_name, 'Core user accounts' AS description
    UNION SELECT 'leagues', 'Top-level competition organization'
    UNION SELECT 'seasons', 'Time-bound competition periods'
    UNION SELECT 'teams', 'Groups of players competing together'
    UNION SELECT 'rosters', 'Team membership for a season'
    UNION SELECT 'matches', 'Competitions between teams'
    UNION SELECT 'match_submissions', 'Match result submissions'
    UNION SELECT 'player_stats', 'Individual player performance data'
    UNION SELECT 'roles', 'User role definitions'
    UNION SELECT 'user_roles', 'Role assignments to users'
    UNION SELECT 'divisions', 'Grouping of teams within seasons'
    UNION SELECT 'conferences', 'Grouping of divisions'
    UNION SELECT 'league_settings', 'Configuration for leagues'
    UNION SELECT 'team_members', 'Alternative team membership table'
    UNION SELECT 'team_invitations', 'Invitations to join teams'
    UNION SELECT 'players', 'Player information'
    UNION SELECT 'webhooks', 'External integration endpoints'
    UNION SELECT 'webhook_events', 'Individual webhook events'
    UNION SELECT 'webhook_retries', 'Failed webhook delivery attempts'
    UNION SELECT 'webhook_health', 'Webhook health monitoring'
    UNION SELECT 'webhook_analytics', 'Webhook usage statistics'
    UNION SELECT 'notifications', 'System notifications'
)
SELECT 
    m.table_name,
    m.description,
    CASE 
        WHEN t.table_name IS NOT NULL THEN '✓' 
        ELSE '❌' 
    END AS exists_in_db,
    CASE 
        WHEN t.table_name IS NOT NULL THEN (
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = m.table_name
        )
        ELSE 0 
    END AS row_count
FROM 
    model_tables m
LEFT JOIN 
    information_schema.tables t 
    ON m.table_name = t.table_name 
    AND t.table_schema = 'public'
ORDER BY 
    exists_in_db,
    m.table_name;