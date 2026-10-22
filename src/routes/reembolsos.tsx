import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/SiteChrome";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/reembolsos")({
  head: () => ({
    meta: [
      { title: `Política de Reembolso — ${SITE.marca}` },
      { name: "description", content: `Política de reembolso da ${SITE.marca}.` },
    ],
  }),
  component: () => (
    <LegalPage title="Política de Reembolso">
      <p>
        <b>Ouça antes de pagar.</b> Você ouve a prévia e lê o início da letra antes de comprar. O
        pagamento libera exatamente a música que você ouviu.
      </p>
      <p>
        <b>Problemas técnicos.</b> Se a música não for liberada após o pagamento aprovado, ou o
        arquivo estiver com defeito, resolvemos ou devolvemos o valor integral.
      </p>
      <p>
        <b>Como pedir.</b> Fale com a gente pelo e-mail {SITE.emailContato} ou WhatsApp em até [7]
        dias após a compra, com o e-mail usado no pedido.
      </p>
      <p>
        <b>Prazo.</b> O reembolso é feito pelo Mercado Pago, no mesmo meio de pagamento, em até [10]
        dias úteis.
      </p>
    </LegalPage>
  ),
});
