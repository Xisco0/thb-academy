import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

const SENDER_EMAIL = 'THB Music Academy <onboarding@resend.dev>';

export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
  if (!resend) return { success: false, error: 'Resend API Key missing' };
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Triumphant Harmony Brass Music Academy!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #090e1a; color: #f8fafc; padding: 36px; border-radius: 20px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #f59e0b; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">THB Music Academy</h2>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">The sound of victory, The heart of harmony</p>
          </div>
          <h1 style="color: #ffffff; font-size: 22px; margin-bottom: 16px;">Welcome, ${name}!</h1>
          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
            Thank you for registering with <strong>Triumphant Harmony Brass (THB) Music Academy</strong>.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
            Your student account is now active. You can explore available music courses, manage your enrollments, and track your tuition payments in your student portal.
          </p>
          <div style="margin-top: 32px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://thbacademy.org'}/student" style="background: #f59e0b; color: #090e1a; padding: 14px 28px; font-weight: bold; border-radius: 12px; text-decoration: none; display: inline-block;">Access Student Portal</a>
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-t: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Triumphant Harmony Brass Music Academy • Lagos, Nigeria</p>
          </div>
        </div>
      `,
    });
    return { success: !error, data, error };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendAdminWelcomeEmail({
  email,
  name,
  password,
  roleName,
}: {
  email: string;
  name: string;
  password: string;
  roleName?: string;
}) {
  if (!resend) return { success: false, error: 'Resend API Key missing' };
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Welcome to THB Music Academy Admin Team — Account Credentials',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #090e1a; color: #f8fafc; padding: 36px; border-radius: 20px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #f59e0b; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">THB Music Academy</h2>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Administrative Control Portal</p>
          </div>
          <h1 style="color: #ffffff; font-size: 22px; margin-bottom: 16px;">Welcome, ${name}!</h1>
          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
            An administrative account has been created for you at <strong>Triumphant Harmony Brass Music Academy</strong> ${roleName ? `with the role of <strong style="color: #f59e0b;">${roleName}</strong>` : ''}.
          </p>
          <div style="background: #0f172a; padding: 20px; border-radius: 14px; border: 1px solid #334155; margin: 20px 0;">
            <h3 style="color: #f59e0b; margin: 0 0 12px 0; font-size: 16px;">Your Admin Login Credentials</h3>
            <p style="margin: 6px 0; color: #94a3b8; font-size: 14px;">Email: <strong style="color: #ffffff;">${email}</strong></p>
            <p style="margin: 6px 0; color: #94a3b8; font-size: 14px;">Default Password: <strong style="color: #f59e0b; font-family: monospace; font-size: 16px; letter-spacing: 1px;">${password}</strong></p>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
            Please log into the Admin Dashboard using these credentials. We recommend changing your password upon your first sign in.
          </p>
          <div style="margin-top: 28px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://thbacademy.org'}/login" style="background: #f59e0b; color: #090e1a; padding: 14px 28px; font-weight: bold; border-radius: 12px; text-decoration: none; display: inline-block;">Log In to Admin Dashboard</a>
          </div>
        </div>
      `,
    });
    return { success: !error, data, error };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendPaymentSubmittedEmail({
  email,
  name,
  courseName,
  level,
  amount,
}: {
  email: string;
  name: string;
  courseName: string;
  level?: string;
  amount: number;
}) {
  if (!resend) return { success: false, error: 'Resend API Key missing' };
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: `Payment Proof Received — ${courseName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #090e1a; color: #f8fafc; padding: 36px; border-radius: 20px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #f59e0b; margin: 0; font-size: 24px;">THB Music Academy</h2>
          </div>
          <h2 style="color: #3b82f6; font-size: 20px; margin-bottom: 16px;">Payment Proof Received (Pending Verification)</h2>
          <p style="color: #cbd5e1; font-size: 15px;">Hello ${name},</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
            We have received your payment proof of <strong style="color: #f59e0b;">₦${amount.toLocaleString()}</strong> for:
          </p>
          <div style="background: #0f172a; padding: 16px; border-radius: 12px; border: 1px solid #334155; margin: 16px 0;">
            <p style="margin: 0; color: #ffffff; font-weight: bold; font-size: 16px;">${courseName}</p>
            ${level ? `<p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Level: <span style="color: #f59e0b; font-weight: bold; text-transform: uppercase;">${level}</span></p>` : ''}
            <p style="margin: 4px 0 0 0; color: #3b82f6; font-weight: bold; font-size: 13px;">Status: PENDING REVIEW</p>
          </div>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
            Our admin team is verifying your payment receipt. Your enrollment will be activated as soon as verification is complete.
          </p>
        </div>
      `,
    });
    return { success: !error, data, error };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendPaymentApprovedEmail({
  email,
  name,
  courseName,
  level,
}: {
  email: string;
  name: string;
  courseName: string;
  level?: string;
}) {
  if (!resend) return { success: false, error: 'Resend API Key missing' };
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: `Payment Approved & Enrollment Confirmed! — ${courseName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #090e1a; color: #f8fafc; padding: 36px; border-radius: 20px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #f59e0b; margin: 0; font-size: 24px;">THB Music Academy</h2>
          </div>
          <h2 style="color: #10b981; font-size: 20px; margin-bottom: 16px;">Payment Approved & Enrollment Active! 🎉</h2>
          <p style="color: #cbd5e1; font-size: 15px;">Hello ${name},</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
            Great news! Your payment for <strong style="color: #ffffff;">${courseName}</strong> ${level ? `(${level.toUpperCase()})` : ''} has been reviewed and <strong style="color: #10b981;">APPROVED</strong>.
          </p>
          <div style="background: #0f172a; padding: 16px; border-radius: 12px; border: 1px solid #10b981; margin: 20px 0;">
            <p style="margin: 0; color: #10b981; font-weight: bold; font-size: 16px;">Enrollment Status: ACTIVE</p>
            <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 14px;">You can now view your class schedule and access your course details in your student dashboard.</p>
          </div>
          <div style="margin-top: 28px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://thbacademy.org'}/student/enrollments" style="background: #f59e0b; color: #090e1a; padding: 14px 28px; font-weight: bold; border-radius: 12px; text-decoration: none; display: inline-block;">View My Enrollments</a>
          </div>
        </div>
      `,
    });
    return { success: !error, data, error };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendPaymentRejectedEmail({
  email,
  name,
  courseName,
  level,
  reason,
}: {
  email: string;
  name: string;
  courseName: string;
  level?: string;
  reason: string;
}) {
  if (!resend) return { success: false, error: 'Resend API Key missing' };
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: `Payment Verification Update — ${courseName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #090e1a; color: #f8fafc; padding: 36px; border-radius: 20px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #f59e0b; margin: 0; font-size: 24px;">THB Music Academy</h2>
          </div>
          <h2 style="color: #ef4444; font-size: 20px; margin-bottom: 16px;">Payment Proof Action Required</h2>
          <p style="color: #cbd5e1; font-size: 15px;">Hello ${name},</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
            We reviewed your submitted payment proof for <strong style="color: #ffffff;">${courseName}</strong> ${level ? `(${level.toUpperCase()})` : ''} and were unable to verify it.
          </p>
          <div style="background: #1e1b4b; border: 1px solid #ef4444; padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #ef4444; font-weight: bold; font-size: 14px;">Rejection Reason:</p>
            <p style="margin: 4px 0 0 0; color: #f8fafc; font-size: 14px;">${reason}</p>
          </div>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Please log into your student portal and submit a new, legible receipt or proof of transfer.
          </p>
          <div style="margin-top: 28px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://thbacademy.org'}/student/payments" style="background: #ef4444; color: #ffffff; padding: 14px 28px; font-weight: bold; border-radius: 12px; text-decoration: none; display: inline-block;">Resubmit Payment Proof</a>
          </div>
        </div>
      `,
    });
    return { success: !error, data, error };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
