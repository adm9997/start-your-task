import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/SiteChrome";
import { SITE, precoBRL } from "@/lib/site";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: `Termos de Uso — ${SITE.marca}` },
      {
        name: "description",
        content: `Termos de uso do serviço de músicas personalizadas ${SITE.marca}.`,
      },
    ],
  }),
  component: () => (
    <LegalPage title="Termos de Uso">
      <p>
        <b>Quem somos.</b> {SITE.empresa}, {SITE.cnpj}, [endereço], e-mail {SITE.emailContato}.
      </p>
      <p>
        <b>O serviço.</b> Criamos uma música original e personalizada a partir das informações
        enviadas no quiz. A letra e a música são geradas com ferramentas de inteligência artificial.
      </p>
      <p>
        <b>Prévia grátis.</b> Antes de qualquer pagamento, você ouve até {SITE.previaSegundos}{" "}
        segundos da música e lê o início da letra. Podemos limitar a quantidade de prévias por
        pessoa e por dia.
      </p>
      <p>
        <b>Preço e pagamento.</b> A música completa custa {precoBRL()}, em pagamento único,
        processado pelo Mercado Pago (Pix ou cartão). Não há assinatura.
      </p>
      <p>
        <b>Entrega.</b> Após a confirmação do pagamento, a música completa, a letra e o download em
        MP3 são liberados no link exclusivo do pedido.
      </p>
      <p>
        <b>Direito de arrependimento.</b> [Definir com o jurídico como se aplica o art. 49 do CDC a
        um conteúdo digital personalizado, entregue imediatamente após a compra e ouvido previamente
        pelo cliente.]
      </p>
      <p>
        <b>Uso da música.</b> Você pode ouvir, presentear e compartilhar a música para uso pessoal.
        [Definir se é permitido uso comercial ou publicação em plataformas de streaming.]
      </p>
      <p>
        <b>Conteúdo enviado.</b> Você garante que tem o direito de compartilhar as informações
        enviadas e que elas não violam direitos de terceiros. Podemos recusar pedidos com conteúdo
        ofensivo ou ilegal.
      </p>
      <p>
        <b>Foro.</b> [Definir.]
      </p>
    </LegalPage>
  ),
});
