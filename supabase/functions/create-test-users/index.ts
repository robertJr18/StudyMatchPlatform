// @ts-nocheck - Deno Edge Function
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Define test users
    const testUsers = [
      {
        email: 'robert.gonzalez@universidad.edu.co',
        password: '123',
        full_name: 'Robert Eloy González Cabarcas',
        role: 'student',
        career: 'Ingeniería de Sistemas',
      },
      {
        email: 'jussi.torres@universidad.edu.co',
        password: '123',
        full_name: 'Jussi Torres González',
        role: 'monitor',
        career: null,
      },
      {
        email: 'admin@universidad.edu.co',
        password: '123',
        full_name: 'Administrador del Sistema',
        role: 'admin',
        career: null,
      },
    ];

    const results = [];

    for (const user of testUsers) {
      // Create auth user
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
      });

      if (authError) {
        // Check if user already exists
        if (authError.message.includes('already registered')) {
          results.push({
            email: user.email,
            status: 'already_exists',
            message: 'Usuario ya existe',
          });
          continue;
        }
        throw authError;
      }

      // Insert user profile
      const { error: profileError } = await supabaseAdmin.from('users').upsert({
        id: authUser.user!.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        career: user.career,
      });

      if (profileError) {
        console.error('Profile error:', profileError);
      }

      results.push({
        email: user.email,
        status: 'created',
        id: authUser.user!.id,
      });
    }

    // Setup enrollments for Robert
    const robert = results.find((r) => r.email === 'robert.gonzalez@universidad.edu.co');
    if (robert && robert.status === 'created') {
      const { data: subjects } = await supabaseAdmin
        .from('subjects')
        .select('id')
        .limit(5);

      if (subjects) {
        for (const subject of subjects) {
          await supabaseAdmin.from('enrollments').insert({
            student_id: robert.id,
            subject_id: subject.id,
          });
        }
      }
    }

    // Setup monitor for Jussi
    const jussi = results.find((r) => r.email === 'jussi.torres@universidad.edu.co');
    if (jussi && jussi.status === 'created') {
      const { data: gestionSubject } = await supabaseAdmin
        .from('subjects')
        .select('id')
        .eq('code', 'PROY101')
        .single();

      if (gestionSubject) {
        await supabaseAdmin.from('monitors').insert({
          user_id: jussi.id,
          subject_id: gestionSubject.id,
        });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
