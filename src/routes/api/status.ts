import { createFileRoute } from "@tanstack/react-router";

// GET /api/status?token=...&payment_id=... — estado do pedido. Se voltar do Mercado Pago com
// payment_id, confere o pagamento na hora (não depende só do webhook).
export const Route = createFileRoute("/api/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const s = await import("@/lib/servidor.server");
        try {
          const u = new URL(request.url);
          let p = await s.pedidoPorToken(u.searchParams.get("token") ?? "");
          const paymentId = u.searchParams.get("payment_id");
          if (paymentId && p.status === "previa_pronta") {
            if (await s.confirmarPagamento(paymentId, s.origemDe(request)))
              p = await s.pedidoPorToken(p.token);
          }
          return s.json(await s.visaoPublica(p));
        } catch (e) {
          return s.responderErro(e);
        }
      },
    },
  },
});
