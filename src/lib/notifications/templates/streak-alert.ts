export interface StreakAlertData {
  firstName: string;
  streak: number;
  lastActiveDate: string;
  suggestedMethodology: string;
}

export function renderStreakAlertHtml(data: StreakAlertData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; background: #f8f9fa;">
  <div style="max-width: 560px; margin: 0 auto; padding: 32px 16px;">
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px;">🔥</div>
      </div>

      <h1 style="color: #e03131; font-size: 20px; margin: 0 0 8px; text-align: center;">
        Your ${data.streak}-day streak is at risk!
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px; text-align: center; line-height: 1.6;">
        Hey ${data.firstName}, you haven't completed a session today.
        One focused session is all it takes to keep your momentum going.
      </p>

      <div style="background: #fef2f2; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <div style="font-size: 36px; font-weight: 700; color: #e03131;">${data.streak}</div>
        <div style="font-size: 12px; color: #9b1c1c; margin-top: 4px;">days at stake</div>
      </div>

      <p style="color: #6b7280; font-size: 13px; margin: 0 0 24px; text-align: center;">
        Try a quick ${data.suggestedMethodology} session to stay on track.
      </p>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://flowstate.pro"}/dashboard"
           style="display: inline-block; padding: 12px 28px; background: #e03131; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">
          Start a Session Now
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
