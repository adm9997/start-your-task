import { createFileRoute } from "@tanstack/react-router";

// POST /api/gerar { token } — gera letra, música e prévia. Pode levar alguns minutos.
export const Route = createFileRoute("/api/gerar")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const s = await import("@/lib/servidor.server");
        try {
          const { token } = ((await request.json().catch(() => ({}))) ?? {}) as { token?: string };
          const p = await s.pedidoPorToken(String(token ?? ""));
          const status = await s.gerar(p, request);
          return s.json({ status });
        } catch (e) {
          return s.responderErro(e);
        }
      },
    },
  },
});
