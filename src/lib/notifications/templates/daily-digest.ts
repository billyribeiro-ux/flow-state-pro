export interface DailyDigestData {
  firstName: string;
  date: string;
  focusMinutes: number;
  sessionsCompleted: number;
  tasksCompleted: number;
  streak: number;
  methodology: string;
  topInsight: string;
  encouragement: string;
}

export function renderDailyDigestHtml(data: DailyDigestData): string {
  const focusHours = Math.floor(data.focusMinutes / 60);
  const focusRemaining = data.focusMinutes % 60;
  const focusDisplay = focusHours > 0
    ? `${focusHours}h ${focusRemaining}m`
    : `${data.focusMinutes}m`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; background: #f8f9fa;">
  <div style="max-width: 560px; margin: 0 auto; padding: 32px 16px;">
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
      <h1 style="color: #1a1a2e; font-size: 20px; margin: 0 0 4px;">
        Good morning, ${data.firstName}!
      </h1>
      <p style="color: #6b7280; font-size: 13px; margin: 0 0 24px;">
        Here's your FlowState summary for ${data.date}
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 16px; background: #f0f4ff; border-radius: 12px; text-align: center; width: 25%;">
            <div style="font-size: 22px; font-weight: 700; color: #4c6ef5;">${focusDisplay}</div>
            <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Focus</div>
          </td>
          <td style="width: 8px;"></td>
          <td style="padding: 16px; background: #f0f4ff; border-radius: 12px; text-align: center; width: 25%;">
            <div style="font-size: 22px; font-weight: 700; color: #4c6ef5;">${data.sessionsCompleted}</div>
            <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Sessions</div>
          </td>
          <td style="width: 8px;"></td>
          <td style="padding: 16px; background: #f0f4ff; border-radius: 12px; text-align: center; width: 25%;">
            <div style="font-size: 22px; font-weight: 700; color: #4c6ef5;">${data.tasksCompleted}</div>
            <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Tasks</div>
          </td>
          <td style="width: 8px;"></td>
          <td style="padding: 16px; background: ${data.streak >= 7 ? "#fef3c7" : "#f0f4ff"}; border-radius: 12px; text-align: center; width: 25%;">
            <div style="font-size: 22px; font-weight: 700; color: ${data.streak >= 7 ? "#d97706" : "#4c6ef5"};">${data.streak}d</div>
            <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Streak</div>
          </td>
        </tr>
      </table>

      <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.6;">
          <strong>Coach's Insight:</strong> ${data.topInsight}
        </p>
      </div>

      <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 24px;">
        ${data.encouragement}
      </p>

      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://flowstate.pro"}/dashboard"
         style="display: inline-block; padding: 12px 28px; background: #4c6ef5; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">
        Open Dashboard
      </a>
    </div>
  </div>
</body>
</html>`;
}
