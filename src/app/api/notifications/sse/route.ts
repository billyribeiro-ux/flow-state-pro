import { NextRequest } from "next/server";
import { getDbUser } from "@/lib/auth/clerk";
import { createSSEStream } from "@/lib/notifications/sse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getDbUser();

    const stream = createSSEStream(user.id);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("SSE connection error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
}
