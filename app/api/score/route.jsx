import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";

// maintain a single array on the global object; naming makes intent clearer
if (!global.sseClients) {
  global.sseClients = [];
}
let clients = global.sseClients;

export async function GET(req) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const clientId = Date.now();
      const send = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      const client = { id: clientId, send };
      clients.push(client);

      try {
        await connectDB();
        const matches = await Match.find();
        send(matches);
      } catch (error) {
        console.error("SSE initial fetch error:", error);
      }

      const cleanup = () => {
        // remove the client when the request is aborted
        global.sseClients = global.sseClients.filter((c) => c.id !== clientId);
        clients = global.sseClients;
        try {
          controller.close();
        } catch {} // ignore if already closed
      };

      req.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      // nothing special to do here
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

export function notifyClients(data) {
  if (!global.sseClients) return;
  global.sseClients = global.sseClients.filter((client) => {
    try {
      client.send(data);
      return true;
    } catch (e) {
      console.warn("dropping closed SSE client", client.id, e);
      return false;
    }
  });
}

