import { createFileRoute } from "@tanstack/react-router";

// POST /api/mp-webhook — notificações do Mercado Pago. A liberação só acontece depois de consultar
// o pagamento na API do Mercado Pago (status aprovado, valor e pedido conferidos).
export const Route = createFileRoute("/api/mp-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const s = await import("@/lib/servidor.server");
        try {
          const u = new URL(request.url);
          const body = ((await request.json().catch(() => ({}))) ?? {}) as {
            type?: string;
            action?: string;
            data?: { id?: string | number };
          };
          const tipo = u.searchParams.get("type") ?? u.searchParams.get("topic") ?? body.type ?? "";
          const dataId = String(
            u.searchParams.get("data.id") ?? body.data?.id ?? u.searchParams.get("id") ?? "",
          );
          if (tipo !== "payment" || !dataId) return s.json({ ok: true });

          const segredo = process.env["MP_WEBHOOK_SECRET"]?.trim();
          if (segredo) {
            const ok = await s.assinaturaMpValida(
              request.headers.get("x-signature") ?? "",
              request.headers.get("x-request-id") ?? "",
              dataId,
              segredo,
            );
            if (!ok) return s.json({ erro: "assinatura inválida" }, 401);
          }
          await s.confirmarPagamento(dataId, s.origemDe(request));
          return s.json({ ok: true });
        } catch (e) {
          return s.responderErro(e);
        }
      },
    },
  },
});
