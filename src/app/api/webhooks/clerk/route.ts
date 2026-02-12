import { headers } from "next/headers";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = event.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;
    const primaryEmail = email_addresses[0]?.email_address;

    if (!primaryEmail) {
      return new Response("No email address", { status: 400 });
    }

    await db.insert(users).values({
      clerkId: id,
      email: primaryEmail,
      firstName: first_name,
      lastName: last_name,
      avatarUrl: image_url,
    });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;
    const primaryEmail = email_addresses[0]?.email_address;

    await db
      .update(users)
      .set({
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
        avatarUrl: image_url,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, id));
  }

  if (eventType === "user.deleted") {
    const { id } = event.data;
    if (id) {
      await db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.clerkId, id));
    }
  }

  return new Response("OK", { status: 200 });
}
