import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@flowstate.pro";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!resend) {
    console.warn("Resend not configured — skipping email send");
    return false;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendDailyDigestEmail(
  to: string,
  data: {
    firstName: string;
    focusMinutes: number;
    sessionsCompleted: number;
    streak: number;
    topInsight: string;
  }
): Promise<boolean> {
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4c6ef5;">Good morning, ${data.firstName}!</h1>
      <p>Here's your daily productivity summary:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 12px; border: 1px solid #e9ecef; text-align: center;">
            <strong style="font-size: 24px; color: #4c6ef5;">${data.focusMinutes}m</strong><br/>
            <span style="color: #868e96; font-size: 12px;">Focus Time</span>
          </td>
          <td style="padding: 12px; border: 1px solid #e9ecef; text-align: center;">
            <strong style="font-size: 24px; color: #4c6ef5;">${data.sessionsCompleted}</strong><br/>
            <span style="color: #868e96; font-size: 12px;">Sessions</span>
          </td>
          <td style="padding: 12px; border: 1px solid #e9ecef; text-align: center;">
            <strong style="font-size: 24px; color: #4c6ef5;">${data.streak} days</strong><br/>
            <span style="color: #868e96; font-size: 12px;">Streak</span>
          </td>
        </tr>
      </table>
      <p style="color: #495057;"><strong>Coach's Insight:</strong> ${data.topInsight}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://flowstate.pro"}/dashboard" 
         style="display: inline-block; padding: 12px 24px; background: #4c6ef5; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
        Open Dashboard
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject: `FlowState Pro — ${data.focusMinutes}m focused yesterday`,
    html,
  });
}

export async function sendStreakAlertEmail(
  to: string,
  data: { firstName: string; streak: number }
): Promise<boolean> {
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #e03131;">Your ${data.streak}-day streak is at risk!</h1>
      <p>Hey ${data.firstName}, you haven't completed a session today.</p>
      <p>One focused session is all it takes to keep your streak alive.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://flowstate.pro"}/dashboard" 
         style="display: inline-block; padding: 12px 24px; background: #4c6ef5; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
        Start a Session
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Your ${data.streak}-day streak is at risk!`,
    html,
  });
}
