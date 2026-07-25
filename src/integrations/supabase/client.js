import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qnrybiutkrqxvvkdduyi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnliaXV0a3JxeHZ2a2RkdXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NTM4NTYsImV4cCI6MjA4MDQyOTg1Nn0.qFyknugVBf_OSwN5tIQ4VDE68nVpjl3-FE4htdVfqsE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);