import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, email, msg } = body ?? {};

  if (!name || !email || !msg) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'pabloschonwiesner@gmail.com',
      subject: `[Arcade Vault] Mensaje de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\n${msg}`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }
}
