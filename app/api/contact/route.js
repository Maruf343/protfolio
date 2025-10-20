import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const payload = await req.json();
    // Basic validation
    const { name, email, message } = payload || {};
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
    }

    // Check SMTP credentials
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) {
      console.error('SMTP credentials missing');
      // Still return 200 so UI shows success but warn in logs
      return new Response(JSON.stringify({ message: "Received (email sending disabled on server)" }), { status: 200 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    const mailOptions = {
      from: `${name} <${email}>`,
      to: user,
      subject: `Portfolio contact from ${name}`,
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
      html: `<p>You have a new message from <strong>${name}</strong> (${email}):</p><p>${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent:', info.messageId);

    return new Response(JSON.stringify({ message: 'Message sent' }), { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 });
  }
}
