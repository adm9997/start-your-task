import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "@/components/SiteChrome";
import { SITE, stripeOk } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.marca} — uma canção personalizada com a vossa história` },
      {
        name: "description",
        content:
          "Transformamos a vossa história numa canção única, escrita e cantada para uma só pessoa. Entrega em 48 horas, 3 revisões incluídas.",
      },
      { property: "og:title", content: "Uma canção com a vossa história" },
      { property: "og:description", content: "O presente que se ouve vezes sem conta. Entrega em 48 horas." },
    ],
  }),
  component: Index,
});

function Buy({ children, className = "btn" }: { children: ReactNode; className?: string }) {
  if (stripeOk) return <a className={className} href={SITE.stripeLink}>{children}</a>;
  return <Link className={className} to="/historia">{children}</Link>;
}

function Index() {
  return (
    <>
      <div className="topbar">
        {stripeOk
          ? "Entrega em 48 h · 3 revisões incluídas · Pagamento seguro"
          : "Entrega em 48 h · 3 revisões incluídas · Garantia de satisfação"}
      </div>

      <header className="nav">
        <div className="wrap">
          <Logo />
          <Buy className="btn small">Criar a minha canção</Buy>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap grid">
            <div className="stack">
              <span className="eyebrow">Canção personalizada</span>
              <h1>A vossa história, transformada numa canção que só existe para ela.</h1>
              <p className="lead">Contas-nos as memórias, as piadas só vossas e o que sentes. Nós escrevemos, cantamos e produzimos uma canção única, pronta a oferecer em 48 horas.</p>
              <div>
                <Buy>♪ Criar a minha canção — {SITE.preco}</Buy>
                <p className="under">3 revisões incluídas · Se não gostares, devolvemos o dinheiro</p>
              </div>
            </div>
            <div className="hero-media">
              {SITE.videoHero ? (
                <video src={SITE.videoHero} controls playsInline preload="metadata" />
              ) : (
                <div className="ph">
                  <div className="vinyl" aria-hidden="true" />
                  <p>Uma canção. Uma pessoa. Nenhuma outra igual no mundo.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="dark hook">
          <div className="wrap narrow">
            <p>Há presentes que se usam uma vez e ficam numa gaveta.</p>
            <p>E há presentes que se ouvem vezes sem conta, que se partilham com a família e que <em>fazem chorar à primeira nota</em>.</p>
            <p>Uma canção com o nome dela, com o dia em que se conheceram, com aquela frase que só vocês percebem.</p>
          </div>
        </section>

        <section id="como">
          <div className="wrap">
            <span className="eyebrow">Como funciona</span>
            <h2>Três passos. Cinco minutos do teu lado.</h2>
            <div className="steps">
              <div className="step"><span className="n">1</span><h3>Conta-nos a vossa história</h3><p>Responde a umas perguntas simples: quem é, como se conheceram, os momentos que não esqueces.</p></div>
              <div className="step"><span className="n">2</span><h3>Nós criamos a canção</h3><p>Escrevemos a letra a partir das tuas memórias e produzimo-la no estilo que escolheres: balada, pop, fado ou acústico.</p></div>
              <div className="step"><span className="n">3</span><h3>Recebes e ofereces</h3><p>Chega ao teu email em até 48 horas, em qualidade de estúdio, pronta a ouvir, descarregar e partilhar.</p></div>
            </div>
            <p style={{ marginTop: 30 }}><Buy>Quero oferecer uma canção</Buy></p>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <span className="eyebrow">Para quem e para quando</span>
            <h2>Para todas as pessoas que merecem uma canção.</h2>
            <div className="occasions">
              <div className="occ"><b>Para quem amas</b><span>Aniversário de namoro, casamento, pedido de casamento</span></div>
              <div className="occ"><b>Para os pais</b><span>Aniversário, bodas, Dia da Mãe e Dia do Pai</span></div>
              <div className="occ"><b>Para os filhos</b><span>Nascimento, batizado, primeiro aniversário</span></div>
              <div className="occ"><b>Para os amigos</b><span>Despedidas, conquistas, aquele amigo de sempre</span></div>
              <div className="occ"><b>Para o Natal</b><span>O presente que ninguém vai esperar</span></div>
            </div>
          </div>
        </section>

        {SITE.amostras.length > 0 && (
          <section className="dark" id="amostras">
            <div className="wrap">
              <span className="eyebrow" style={{ color: "#F39AAB" }}>Ouve alguns exemplos</span>
              <h2>Cada canção começa com uma história verdadeira.</h2>
              <div className="samples">
                {SITE.amostras.map((s) => (
                  <div className="sample" key={s.ficheiro}>
                    <b>{s.titulo}</b>
                    <small>{s.estilo ?? ""}</small>
                    <audio controls preload="none" src={s.ficheiro} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="wrap narrow">
            <span className="eyebrow">O que recebes</span>
            <h2>Tudo o que precisas para emocionar.</h2>
            <ul className="receive">
              <li>Uma canção original de 2 a 3 minutos, com letra baseada na vossa história</li>
              <li>Voz e produção profissionais, no estilo que escolheres</li>
              <li>Ficheiro MP3 em alta qualidade para descarregar e guardar para sempre</li>
              <li>Link para ouvir e partilhar no telemóvel</li>
              <li>3 revisões incluídas para afinar a letra</li>
            </ul>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="wrap narrow">
            <div className="guarantee">
              <div className="seal">GARANTIA DE SATISFAÇÃO</div>
              <div className="stack" style={{ gap: 8 }}>
                <h3>Ou adoras, ou devolvemos o dinheiro.</h3>
                <p className="lead" style={{ fontSize: "1rem" }}>Se depois das revisões a canção não te tocar, devolvemos o valor pago. Sem perguntas complicadas.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="dark" id="preco">
          <div className="wrap" style={{ textAlign: "center" }}>
            <h2>Um presente que ninguém mais pode dar.</h2>
            <div className="price">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
                <div><span className="eyebrow">Canção personalizada</span><div className="amount">{SITE.preco}</div></div>
                <span className="under" style={{ margin: 0 }}>IVA incluído</span>
              </div>
              <ul>
                <li>Letra escrita a partir da vossa história</li>
                <li>Entrega em 48 horas</li>
                <li>3 revisões incluídas</li>
                <li>Garantia de satisfação</li>
              </ul>
              <div className="extras">
                <p style={{ marginBottom: 6 }}><b>{stripeOk ? "No checkout podes juntar:" : "Também podes pedir:"}</b></p>
                {SITE.extras.map((x) => (
                  <div key={x.nome}><span>{x.nome}</span><span>{x.preco}</span></div>
                ))}
              </div>
              <Buy>♪ Criar a minha canção agora</Buy>
              <div className="pay">
                {stripeOk ? (
                  <><span>Cartão</span><span>Apple Pay</span><span>Google Pay</span><span>Checkout seguro Stripe</span></>
                ) : (
                  "Primeiro contas a história. O pagamento é combinado por email antes de começarmos."
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="faq">
          <div className="wrap narrow">
            <span className="eyebrow">Perguntas frequentes</span>
            <h2 style={{ marginBottom: 24 }}>Ainda tens dúvidas?</h2>
            <details><summary>Quanto tempo demora?</summary><p>Até 48 horas depois de preencheres a história. Com a entrega expresso, até 6 horas.</p></details>
            <details><summary>E se eu não souber escrever bem?</summary><p>Não precisas. Basta contares as memórias como se estivesses a falar com um amigo; nós tratamos da letra.</p></details>
            <details><summary>Posso escolher o estilo?</summary><p>Sim: balada, pop, fado, acústico, romântico ou animado.</p></details>
            <details><summary>E se não gostar?</summary><p>Tens 3 revisões incluídas. Se mesmo assim não ficares satisfeito, devolvemos o dinheiro.</p></details>
            <details><summary>Como recebo a canção?</summary><p>Por email, com um link para ouvir e descarregar o MP3.</p></details>
            <details><summary>A canção é só minha?</summary><p>Sim. É criada de raiz para ti e podes oferecê-la e partilhá-la à vontade.</p></details>
            <details><summary>Como pago?</summary><p>Cartão, Apple Pay ou Google Pay, num checkout seguro do Stripe.</p></details>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div>
            <b style={{ color: "var(--night-ink)" }}>{SITE.marca}</b><br />
            {SITE.empresa} · {SITE.nif}<br />
            Contacto: {SITE.emailContacto}
          </div>
          <nav aria-label="Informação legal">
            <Link to="/termos">Termos e Condições</Link>
            <Link to="/privacidade">Privacidade</Link>
            <Link to="/reembolsos">Reembolsos</Link>
          </nav>
        </div>
      </footer>

      <div className="sticky-cta"><Buy>♪ Criar a minha canção — {SITE.preco}</Buy></div>
    </>
  );
}
