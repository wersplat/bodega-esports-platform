import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project values
const supabaseUrl = 'https://stgurrruqdwibubrmfis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z3VycnJ1cWR3aWJ1YnJtZmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDQ5NjgsImV4cCI6MjA2MjA4MDk2OH0.Y63dhnoNlYVs6qEXnyh-CUttyxDrOA_EEgD81Ml5RaQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
