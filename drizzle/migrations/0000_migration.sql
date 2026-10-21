create table public.pedidos (
  id             uuid primary key default gen_random_uuid(),
  criado_em      timestamptz not null default now(),
  stripe_session text,
  para_quem      text not null,
  relacao        text not null,
  ocasiao        text not null,
  historia       text not null,
  memorias       text not null,
  frase          text,
  estilo         text not null,
  voz            text not null,
  evitar         text,
  email          text not null,
  status         text not null default 'aguarda_pagamento'
);

grant insert on public.pedidos to anon, authenticated;
grant all on public.pedidos to service_role;

alter table public.pedidos enable row level security;

create policy "site insere pedidos" on public.pedidos
  for insert to anon, authenticated
  with check (
    char_length(para_quem) between 1 and 120
    and char_length(historia) between 1 and 4000
    and char_length(memorias) between 1 and 4000
    and char_length(email) between 3 and 254
    and coalesce(char_length(frase), 0) <= 200
    and coalesce(char_length(evitar), 0) <= 300
    and status in ('aguarda_pagamento', 'novo')
  );