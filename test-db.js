import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('newsletter').select('count').limit(1);
    if (error) {
      console.error('❌ Erreur connexion BDD:', error.message);
    } else {
      console.log('✅ Connexion BDD réussie');
    }
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

testConnection();