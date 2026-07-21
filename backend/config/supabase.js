const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const isValidUrl = supabaseUrl && supabaseUrl.startsWith('http') && !supabaseUrl.includes('your_supabase');
const isValidKey = supabaseServiceKey && !supabaseServiceKey.includes('your_supabase') && supabaseServiceKey.length > 20;

let supabase = null;

if (isValidUrl && isValidKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase connected.');
  } catch (err) {
    console.warn('⚠️  Supabase init failed:', err.message, '— Using mock data mode.');
  }
} else {
  console.warn('⚠️  Supabase not configured. Using mock data mode. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env to enable persistence.');
}

module.exports = supabase;
