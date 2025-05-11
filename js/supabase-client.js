// js/supabase-client.js
const SUPABASE_URL = 'https://idcktjonedzxaseklueu.supabase.co'; // Find this in your Supabase project settings > API
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkY2t0am9uZWR6eGFzZWtsdWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NjcyMDMsImV4cCI6MjA2MTE0MzIwM30.3WdTaipjYf__UfSdVN2LFQwoeFs-w9fwhnl6dJTQOoQ'; // Find this in your Supabase project settings > API

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase URL or Anon Key is missing. Please check your environment variables or configuration.");
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Optional: Test if it's created
if (typeof supabaseClient !== 'undefined') {
    console.log('Supabase client initialized successfully!');
} else {
    console.error('Supabase client failed to initialize.');
}

// If you want to use it globally, you can do:
window.supabaseClient = supabaseClient;
// ...existing code...

// Export it if you plan to use modules, or it will be globally available as `supabaseClient`
// export default supabaseClient; // If using ES modules