// Configuração do site — edite aqui marca, preços, contactos e amostras.
export const SITE = {
  marca: "Canção Para Ti",
  emailContacto: "ola@seudominio.pt",
  empresa: "Nome da Empresa Lda / LTDA",
  nif: "NIF/CNPJ 00.000.000/0001-00",

  // Checkout desligado: os botões levam ao formulário da história e o
  // pagamento é combinado por email. Para ligar, checkoutAtivo: true e
  // configure o Payment Link para redirecionar para /historia?session={CHECKOUT_SESSION_ID}
  checkoutAtivo: false,
  stripeLink: "https://buy.stripe.com/SEU_LINK_AQUI",

  preco: "€24,90",
  extras: [
    { nome: "Entrega expresso em 6 h", preco: "+€9,90" },
    { nome: "Vídeo com a letra e as vossas fotos", preco: "+€12,90" },
    { nome: "Segunda canção para outra pessoa", preco: "+€9,90" },
  ],

  // Ex.: { titulo: "Para a Ana, 10 anos de namoro", estilo: "Balada", ficheiro: "https://.../ana.mp3" }
  amostras: [] as { titulo: string; estilo?: string; ficheiro: string }[],

  videoHero: "",
};

export const stripeOk =
  SITE.checkoutAtivo && !!SITE.stripeLink && !SITE.stripeLink.includes("SEU_LINK");
