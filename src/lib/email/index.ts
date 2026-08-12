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
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0b1329; color: #e2e8f0; padding: 32px; border-radius: 16px;">
          <h1 style="color: #f59e0b; margin-bottom: 16px;">Welcome, ${name}!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
            Thank you for registering at <strong>Triumphant Harmony Brass (THB) Music Academy</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
            <em>"The sound of victory, The heart of harmony."</em>
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
            Founder & Music Director: <strong>Taiwo Toyinbo</strong>
          </p>
          <div style="margin-top: 32px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/programs" style="background: #f59e0b; color: #0b1329; padding: 12px 24px; font-weight: bold; border-radius: 8px; text-decoration: none;">Explore Programs</a>
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
  amount,
}: {
  email: string;
  name: string;
  courseName: string;
  amount: number;
}) {
  if (!resend) return { success: false, error: 'Resend API Key missing' };
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: `Payment Proof Received - ${courseName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0b1329; color: #e2e8f0; padding: 32px; border-radius: 16px;">
          <h2 style="color: #f59e0b;">Payment Proof Received</h2>
          <p style="color: #cbd5e1;">Hello ${name},</p>
          <p style="color: #cbd5e1;">We have received your payment proof of <strong>₦${amount.toLocaleString()}</strong> for <strong>${courseName}</strong>.</p>
          <p style="color: #cbd5e1;">Our admin team is verifying your payment and your enrollment will be activated shortly.</p>
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
}: {
  email: string;
  name: string;
  courseName: string;
}) {
  if (!resend) return { success: false, error: 'Resend API Key missing' };
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: `Enrollment Confirmed! - ${courseName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0b1329; color: #e2e8f0; padding: 32px; border-radius: 16px;">
          <h2 style="color: #10b981;">Payment Approved & Enrollment Active! 🎉</h2>
          <p style="color: #cbd5e1;">Hello ${name},</p>
          <p style="color: #cbd5e1;">Great news! Your payment for <strong>${courseName}</strong> has been approved and your enrollment is now <strong>Active</strong>.</p>
          <p style="color: #cbd5e1;">You can view your course details and class schedule in your student dashboard.</p>
          <div style="margin-top: 24px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/student/enrollments" style="background: #f59e0b; color: #0b1329; padding: 12px 24px; font-weight: bold; border-radius: 8px; text-decoration: none;">View My Enrollments</a>
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
  reason,
}: {
  email: string;
  name: string;
  courseName: string;
  reason: string;
}) {
  if (!resend) return { success: false, error: 'Resend API Key missing' };
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: `Payment Verification Update - ${courseName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0b1329; color: #e2e8f0; padding: 32px; border-radius: 16px;">
          <h2 style="color: #ef4444;">Payment Issue Notification</h2>
          <p style="color: #cbd5e1;">Hello ${name},</p>
          <p style="color: #cbd5e1;">We were unable to verify your payment for <strong>${courseName}</strong>.</p>
          <p style="color: #ef4444; background: #1e293b; padding: 12px; border-radius: 8px;"><strong>Reason:</strong> ${reason}</p>
          <p style="color: #cbd5e1;">Please re-upload a valid payment proof in your student portal or contact our support team.</p>
        </div>
      `,
    });
    return { success: !error, data, error };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
