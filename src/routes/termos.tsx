import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/SiteChrome";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos e Condições — Canção Para Ti" },
      { name: "description", content: "Termos e condições do serviço de canções personalizadas Canção Para Ti." },
      { property: "og:title", content: "Termos e Condições — Canção Para Ti" },
      { property: "og:description", content: "Termos e condições do serviço Canção Para Ti." },
    ],
  }),
  component: () => (
    <LegalPage title="Termos e Condições">
      <p><b>Quem somos.</b> [Razão social], [NIF/CNPJ], [morada], email [contacto].</p>
      <p><b>O serviço.</b> Criamos uma canção original e personalizada a partir das informações que o cliente nos envia. A letra e a música são produzidas com apoio de ferramentas de inteligência artificial e revistas pela nossa equipa.</p>
      <p><b>Preço e pagamento.</b> Os preços incluem IVA. O pagamento é processado pelo Stripe. Os extras (entrega expresso, vídeo com letra, segunda canção) são opcionais.</p>
      <p><b>Prazos.</b> Entrega em até 48 horas (ou 6 horas no expresso), contadas a partir do envio do formulário da história.</p>
      <p><b>Revisões.</b> Estão incluídas até 3 revisões da letra, pedidas por email em até 14 dias após a entrega.</p>
      <p><b>Direito de livre resolução.</b> Por se tratar de um conteúdo feito segundo as especificações do cliente, não se aplica o direito de livre resolução de 14 dias. Mantemos, ainda assim, a nossa garantia de satisfação (ver Política de Reembolso).</p>
      <p><b>Uso da canção.</b> O cliente pode ouvir, oferecer e partilhar a canção para uso pessoal. [Definir se é permitido uso comercial.]</p>
      <p><b>Conteúdo enviado.</b> O cliente garante que tem o direito de partilhar as informações e fotos enviadas e que não violam direitos de terceiros.</p>
      <p><b>Lei aplicável.</b> [Definir.] Em caso de litígio, o consumidor pode recorrer a uma entidade de resolução alternativa de litígios.</p>
    </LegalPage>
  ),
});
