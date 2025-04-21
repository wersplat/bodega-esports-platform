import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project values
const supabaseUrl = 'https://kvkmepmsloyekfqwdcgq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2a21lcG1zbG95ZWtmcXdkY2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjUxNDAsImV4cCI6MjA2MDgwMTE0MH0.g4C6XilSBmy3liTbGpNbcoIAyyo4HF0x9bn5hlLDNzM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
