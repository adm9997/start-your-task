import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/SiteChrome";

export const Route = createFileRoute("/reembolsos")({
  head: () => ({
    meta: [
      { title: "Política de Reembolso — Canção Para Ti" },
      { name: "description", content: "Garantia de satisfação e política de reembolso da Canção Para Ti." },
      { property: "og:title", content: "Política de Reembolso — Canção Para Ti" },
      { property: "og:description", content: "Ou adoras, ou devolvemos o dinheiro." },
    ],
  }),
  component: () => (
    <LegalPage title="Política de Reembolso">
      <p><b>Garantia de satisfação.</b> Se, depois das revisões incluídas, a canção não te agradar, devolvemos o valor pago.</p>
      <p><b>Como pedir.</b> Escreve para [contacto] em até [14] dias após a entrega, com o número da encomenda.</p>
      <p><b>Prazo.</b> O reembolso é feito no mesmo meio de pagamento em até [10] dias úteis.</p>
      <p><b>Atrasos.</b> Se a entrega passar do prazo comprado (48 h ou 6 h), devolvemos o valor do expresso ou, a teu pedido, o valor total.</p>
    </LegalPage>
  ),
});
