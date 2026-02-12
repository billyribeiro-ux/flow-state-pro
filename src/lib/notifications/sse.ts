import type { SSEEvent } from "@/types/coaching";

type SSEConnection = {
  controller: ReadableStreamDefaultController;
  userId: string;
};

const connections = new Map<string, Set<SSEConnection>>();

export function addSSEConnection(
  userId: string,
  controller: ReadableStreamDefaultController
): SSEConnection {
  const connection: SSEConnection = { controller, userId };
  if (!connections.has(userId)) {
    connections.set(userId, new Set());
  }
  connections.get(userId)!.add(connection);
  return connection;
}

export function removeSSEConnection(connection: SSEConnection): void {
  const userConnections = connections.get(connection.userId);
  if (userConnections) {
    userConnections.delete(connection);
    if (userConnections.size === 0) {
      connections.delete(connection.userId);
    }
  }
}

export function sendSSEEvent(userId: string, event: SSEEvent): void {
  const userConnections = connections.get(userId);
  if (!userConnections) return;

  const data = `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
  const encoder = new TextEncoder();

  for (const connection of userConnections) {
    try {
      connection.controller.enqueue(encoder.encode(data));
    } catch {
      removeSSEConnection(connection);
    }
  }
}

export function sendSSEEventToAll(event: SSEEvent): void {
  for (const userId of connections.keys()) {
    sendSSEEvent(userId, event);
  }
}

export function getActiveConnectionCount(userId: string): number {
  return connections.get(userId)?.size ?? 0;
}

export function createSSEStream(userId: string): ReadableStream {
  return new ReadableStream({
    start(controller) {
      const connection = addSSEConnection(userId, controller);

      // Send initial heartbeat
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(": heartbeat\n\n"));

      // Heartbeat interval
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
          removeSSEConnection(connection);
        }
      }, 30000);

      // Cleanup on close
      return () => {
        clearInterval(heartbeat);
        removeSSEConnection(connection);
      };
    },
  });
}
