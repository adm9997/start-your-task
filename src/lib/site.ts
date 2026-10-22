// Configuração do site — edite aqui marca, preço, contatos e amostras.
// Tudo aqui é público (vai para o navegador). Chaves secretas ficam só nas variáveis de ambiente.
export const SITE = {
  marca: "Canção Para Ti",
  emailContato: "contato@seudominio.com.br",
  whatsapp: "5500000000000", // só números, com DDI e DDD. Ex.: 5511999999999
  empresa: "Nome da Empresa LTDA",
  cnpj: "CNPJ 00.000.000/0001-00",

  // Preço único (pagamento único, sem assinatura)
  precoCentavos: 3790,

  // Prévia grátis
  previaSegundos: 50,

  // Meta Pixel (opcional). Ex.: "123456789012345". Vazio = desligado.
  metaPixelId: "",

  // Stripe: mantido desligado. O pagamento ativo é o Mercado Pago.
  checkoutAtivo: false,
  stripeLink: "https://buy.stripe.com/SEU_LINK_AQUI",

  // Exemplos reais gerados pelo próprio sistema (não use músicas de terceiros).
  // Ex.: { titulo: "Para a Ana, 10 anos juntos", estilo: "Sertanejo", ficheiro: "https://.../ana.mp3" }
  amostras: [] as { titulo: string; estilo: string; ficheiro: string }[],

  videoHero: "",
};

export const precoBRL = (centavos = SITE.precoCentavos) =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const stripeOk =
  SITE.checkoutAtivo && !!SITE.stripeLink && !SITE.stripeLink.includes("SEU_LINK");
