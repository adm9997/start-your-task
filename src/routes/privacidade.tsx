import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/SiteChrome";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: `Política de Privacidade — ${SITE.marca}` },
      {
        name: "description",
        content: `Como a ${SITE.marca} coleta e trata os seus dados pessoais (LGPD).`,
      },
    ],
  }),
  component: () => (
    <LegalPage title="Política de Privacidade">
      <p>
        <b>Controlador.</b> {SITE.empresa}, {SITE.cnpj}, e-mail {SITE.emailContato}.
      </p>
      <p>
        <b>Dados coletados.</b> E-mail, WhatsApp (opcional), as informações da história enviadas no
        quiz, endereço IP e navegador (para segurança e limite de uso) e parâmetros de campanha
        (UTM). Dados de pagamento são tratados pelo Mercado Pago e não ficam conosco.
      </p>
      <p>
        <b>Finalidades.</b> Criar e entregar a música, prevenir abuso, cumprir obrigações legais e
        medir campanhas de anúncios.
      </p>
      <p>
        <b>Bases legais (LGPD, art. 7º).</b> Execução de contrato, cumprimento de obrigação legal e
        legítimo interesse (segurança e medição).
      </p>
      <p>
        <b>Compartilhamento.</b> Mercado Pago (pagamentos), Supabase/Lovable Cloud (hospedagem e
        banco de dados), Anthropic (geração da letra), ElevenLabs (geração da música), serviço de
        e-mail e Meta (medição de anúncios, se ativada). [Revisar a lista.]
      </p>
      <p>
        <b>Retenção.</b> As histórias são apagadas [180] dias após a criação; dados fiscais pelo
        prazo legal.
      </p>
      <p>
        <b>Seus direitos.</b> Confirmação, acesso, correção, anonimização, eliminação e
        portabilidade, pelo e-mail {SITE.emailContato}. Você também pode reclamar à ANPD.
      </p>
    </LegalPage>
  ),
});
