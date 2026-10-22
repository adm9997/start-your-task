import { createFileRoute } from "@tanstack/react-router";
import { PedidoSchema } from "@/lib/musica";

// POST /api/pedidos — recebe o quiz e cria o pedido. Devolve o token da página do pedido.
export const Route = createFileRoute("/api/pedidos")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const s = await import("@/lib/servidor.server");
        try {
          const body = await request.json().catch(() => null);
          const r = PedidoSchema.safeParse(body);
          if (!r.success)
            return s.json({ erro: r.error.issues[0]?.message ?? "Confira os dados." }, 400);
          const { id, token } = await s.criarPedido(r.data, request);
          return s.json({ id, token });
        } catch (e) {
          return s.responderErro(e);
        }
      },
    },
  },
});
