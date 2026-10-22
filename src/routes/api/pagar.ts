import { createFileRoute } from "@tanstack/react-router";

// POST /api/pagar { token } — cria o checkout no Mercado Pago e devolve a URL de pagamento.
export const Route = createFileRoute("/api/pagar")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const s = await import("@/lib/servidor.server");
        try {
          const { token } = ((await request.json().catch(() => ({}))) ?? {}) as { token?: string };
          const p = await s.pedidoPorToken(String(token ?? ""));
          const url = await s.criarPreferencia(p, request);
          return s.json({ url });
        } catch (e) {
          return s.responderErro(e);
        }
      },
    },
  },
});
