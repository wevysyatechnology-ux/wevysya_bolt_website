import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Fall back to anon key if service role not available
    const key = serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, key);

    // Try inserting into contact_messages table
    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert([{ name, email, phone, message }]);

    if (!insertError) {
      return NextResponse.json({ success: true });
    }

    // Table doesn't exist yet — fall back to storage as a queue
    const payload = JSON.stringify({ name, email, phone, message, submitted_at: new Date().toISOString() }, null, 2);
    const filename = `contact-messages/${Date.now()}-${Math.random().toString(36).slice(2)}.json`;

    // Use service role client for storage upload (bypasses RLS)
    const adminClient = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey)
      : supabase;

    const { error: storageError } = await adminClient.storage
      .from('media')
      .upload(filename, new Blob([payload], { type: 'application/json' }), {
        contentType: 'application/json',
        upsert: false,
      });

    if (storageError) {
      console.error('contact storage fallback error:', storageError);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('contact route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
