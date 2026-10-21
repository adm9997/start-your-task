import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/SiteChrome";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Canção Para Ti" },
      { name: "description", content: "Como a Canção Para Ti recolhe e trata os teus dados pessoais." },
      { property: "og:title", content: "Política de Privacidade — Canção Para Ti" },
      { property: "og:description", content: "Como tratamos os teus dados pessoais." },
    ],
  }),
  component: () => (
    <LegalPage title="Política de Privacidade">
      <p><b>Responsável.</b> [Razão social], [contacto].</p>
      <p><b>Dados recolhidos.</b> Nome e email (checkout e formulário), as informações da história e, se enviadas, fotos. Os dados de pagamento são tratados pelo Stripe e não ficam connosco.</p>
      <p><b>Finalidade.</b> Criar e entregar a canção, responder a pedidos de revisão e cumprir obrigações fiscais.</p>
      <p><b>Base legal.</b> Execução do contrato (RGPD, art. 6.º, n.º 1, b) e obrigações legais.</p>
      <p><b>Subcontratantes.</b> Stripe (pagamentos), Lovable Cloud (armazenamento), fornecedores de ferramentas de IA usados na produção, serviço de email. [Listar.]</p>
      <p><b>Conservação.</b> As histórias e fotos são apagadas [90] dias após a entrega; os dados fiscais durante o prazo legal.</p>
      <p><b>Direitos.</b> Acesso, retificação, apagamento, oposição e portabilidade, pelo email [contacto]. Pode reclamar junto da CNPD.</p>
    </LegalPage>
  ),
});
