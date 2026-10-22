-- Fluxo automático: quiz -> letra (IA) -> música (IA) -> prévia grátis -> pagamento Mercado Pago -> liberação.
-- O navegador não acessa mais a tabela diretamente: tudo passa pelas rotas /api (service role).

alter table public.pedidos
  add column if not exists token               text,
  add column if not exists clima               text,
  add column if not exists whatsapp            text,
  add column if not exists utm                 jsonb not null default '{}'::jsonb,
  add column if not exists titulo              text,
  add column if not exists letra               jsonb,
  add column if not exists previa_path         text,
  add column if not exists audio_path          text,
  add column if not exists tentativas          integer not null default 0,
  add column if not exists geracao_iniciada_em timestamptz,
  add column if not exists valor_centavos      integer not null default 3790,
  add column if not exists mp_preference_id    text,
  add column if not exists mp_payment_id       text,
  add column if not exists pago_em             timestamptz,
  add column if not exists ip                  text,
  add column if not exists user_agent          text,
  add column if not exists erro                text,
  add column if not exists atualizado_em       timestamptz not null default now();

-- Pedidos antigos (fluxo manual) ganham um token também
update public.pedidos
  set token = substr(md5(random()::text || id::text) || md5(clock_timestamp()::text || id::text), 1, 48)
  where token is null;
alter table public.pedidos alter column token set not null;
create unique index if not exists pedidos_token_key on public.pedidos (token);
create index if not exists pedidos_geracao_idx on public.pedidos (geracao_iniciada_em);
create index if not exists pedidos_email_idx on public.pedidos (email);
create index if not exists pedidos_ip_idx on public.pedidos (ip);

-- Fecha a inserção direta pelo navegador (agora só via /api/pedidos)
drop policy if exists "site insere pedidos" on public.pedidos;
revoke insert on public.pedidos from anon, authenticated;

-- Bucket privado para os áudios (acesso só por URL assinada gerada no servidor)
insert into storage.buckets (id, name, public)
values ('cancoes', 'cancoes', false)
on conflict (id) do update set public = false;
