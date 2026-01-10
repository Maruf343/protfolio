// Contact API: validates payload and sends email via SMTP (nodemailer)
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body || {};

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields (name, email, message)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic email sanity check
    const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!emailValid) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Support both SMTP_* and EMAIL_* env var names (your .env.local uses EMAIL_USER / EMAIL_PASS)
    const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
    const SMTP_PORT = process.env.SMTP_PORT || '465';
    const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || SMTP_USER;

    if (!SMTP_USER || !SMTP_PASS) {
      console.error('Email config missing', { SMTP_USER: !!SMTP_USER, SMTP_PASS: !!SMTP_PASS });
      return new Response(JSON.stringify({ error: 'Email service not configured on server' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const mailOptions = {
      from: `${name} <${email}>`,
      to: CONTACT_TO_EMAIL,
      subject: `New message from my-portfolio: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Contact email sent', info?.messageId || info);
      return new Response(JSON.stringify({ success: true, message: 'Message sent' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (sendErr) {
      console.error('Failed to send contact email', sendErr);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error('Contact API error', err);
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
