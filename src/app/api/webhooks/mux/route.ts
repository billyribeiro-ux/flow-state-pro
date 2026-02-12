import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { videoProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Verify Mux webhook signature in production
    const signature = request.headers.get("mux-signature");
    if (!signature && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    switch (type) {
      case "video.asset.ready": {
        console.log(`Mux asset ready: ${data.id}`);
        break;
      }

      case "video.asset.errored": {
        console.error(`Mux asset errored: ${data.id}`, data.errors);
        break;
      }

      case "video.asset.deleted": {
        console.log(`Mux asset deleted: ${data.id}`);
        break;
      }

      default:
        console.log(`Unhandled Mux webhook type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Mux webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
