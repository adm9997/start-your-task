# Start Your Task

comece sua tarefa.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f6815187-6a44-4265-920c-bf45949af8a3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Fluxo de venda (pt-BR)

Landing (`/`) → quiz (`/criar`) → página do pedido (`/pedido/:token`): letra pela Anthropic, música pela
ElevenLabs, prévia grátis de 50 s → pagamento Mercado Pago (Pix/cartão) → música completa, letra e MP3.

- Configuração pública (marca, preço, WhatsApp, Pixel, exemplos): `src/lib/site.ts`
- Lógica pura e testada (quiz, letra, plano de composição, corte da prévia): `src/lib/musica.ts`
- Servidor (chaves, APIs, banco, storage): `src/lib/servidor.server.ts`
- Rotas de API: `src/routes/api/` — `pedidos`, `gerar`, `status`, `pagar`, `mp-webhook`
- Banco: `drizzle/migrations/0001_fluxo_ia.sql` (colunas novas, bucket privado `cancoes`, fecha o insert anônimo)
- Variáveis de ambiente: `.env.example`

### Configurar
1. Cadastre os secrets de `.env.example` no Lovable Cloud.
2. Mercado Pago → Suas integrações → Webhooks: URL `https://SEU_DOMINIO/api/mp-webhook`, evento **Pagamentos**.
   Copie a assinatura secreta para `MP_WEBHOOK_SECRET`.
3. Teste com as credenciais de teste do Mercado Pago antes de trocar para produção.

Cada prévia gera uma música inteira (custo na ElevenLabs e na Anthropic). Ajuste `LIMITE_PREVIAS_POR_PESSOA`
e `LIMITE_PREVIAS_POR_DIA` conforme o orçamento.
