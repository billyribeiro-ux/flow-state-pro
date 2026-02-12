import { NextRequest, NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth/clerk";
import {
  getDailyAnalyticsRange,
  getRecentWeeklyAnalytics,
  getProductivityHeatmapData,
  getTotalFocusMinutesThisWeek,
} from "@/lib/db/queries/analytics";

export async function GET(request: NextRequest) {
  try {
    const user = await getDbUser();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? "daily";
    const days = Number(searchParams.get("days") ?? "30");

    switch (type) {
      case "daily": {
        const endDate = new Date().toISOString().split("T")[0]!;
        const startDate = new Date(Date.now() - days * 86400000).toISOString().split("T")[0]!;
        const data = await getDailyAnalyticsRange(user.id, startDate, endDate);
        return NextResponse.json({ data });
      }

      case "weekly": {
        const weeks = Number(searchParams.get("weeks") ?? "8");
        const data = await getRecentWeeklyAnalytics(user.id, weeks);
        return NextResponse.json({ data });
      }

      case "heatmap": {
        const data = await getProductivityHeatmapData(user.id, days);
        return NextResponse.json({ data });
      }

      case "summary": {
        const weeklyFocus = await getTotalFocusMinutesThisWeek(user.id);
        const today = new Date().toISOString().split("T")[0]!;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]!;
        const [todayData] = await getDailyAnalyticsRange(user.id, today, today);
        const [yesterdayData] = await getDailyAnalyticsRange(user.id, yesterday, yesterday);

        return NextResponse.json({
          weeklyFocusMinutes: weeklyFocus,
          today: todayData ?? null,
          yesterday: yesterdayData ?? null,
        });
      }

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
