import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/SiteChrome";
import { OPCOES } from "@/lib/musica";
import { guardarUtm } from "@/lib/pixel";
import { SITE, precoBRL } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.marca} — música personalizada com a sua história` },
      {
        name: "description",
        content:
          "Conte a sua história e receba uma música feita só para quem você ama. Ouça uma prévia grátis antes de pagar.",
      },
      { property: "og:title", content: "Uma música feita só para quem você ama" },
      {
        property: "og:description",
        content: "Conte a história, ouça a prévia grátis e só pague se gostar.",
      },
    ],
  }),
  component: Index,
});

function Cta({
  children,
  className = "btn",
  estilo,
}: {
  children: ReactNode;
  className?: string;
  estilo?: string;
}) {
  return (
    <Link className={className} to="/criar" search={estilo ? { estilo } : {}}>
      {children}
    </Link>
  );
}

const OCASIOES = [
  ["Aniversário", "Uma música com o nome e a história de quem faz anos"],
  ["Pedido de casamento", "Para tocar na hora do sim"],
  ["Casamento", "A entrada, a primeira dança ou a surpresa na festa"],
  ["Aniversário de namoro", "Os momentos de vocês, do primeiro encontro até hoje"],
  ["Dia das Mães e dos Pais", "O agradecimento que fica guardado para sempre"],
  ["Formatura", "Para celebrar a conquista com quem esteve junto"],
  ["Chá revelação", "Uma música para dar as boas-vindas ao bebê"],
  ["Homenagem", "Para lembrar alguém especial com carinho"],
];

function Index() {
  useEffect(guardarUtm, []);
  const [filtro, setFiltro] = useState("Todos");
  const amostras = SITE.amostras.filter((a) => filtro === "Todos" || a.estilo === filtro);
  const generos = [
    "Todos",
    ...OPCOES.estilo.filter((g) => SITE.amostras.some((a) => a.estilo === g)),
  ];

  return (
    <>
      <div className="topbar">
        Ouça a prévia grátis antes de pagar · Pronta em poucos minutos · Pagamento único
      </div>

      <header className="nav">
        <div className="wrap">
          <Logo />
          <nav className="menu" aria-label="Seções">
            <a href="#como">Como funciona</a>
            {SITE.amostras.length > 0 && <a href="#exemplos">Exemplos</a>}
            <a href="#preco">Preço</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <Cta className="btn small">Criar prévia grátis</Cta>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap grid">
            <div className="stack">
              <span className="eyebrow">Música personalizada</span>
              <h1>A história de vocês virou música. E ela tem o nome de quem você ama.</h1>
              <p className="lead">
                Você conta como se conheceram, as manias, os lugares e as datas. Nós transformamos
                tudo numa música original, no estilo que você escolher. Você ouve a prévia antes de
                pagar qualquer coisa.
              </p>
              <div className="ctas">
                <Cta>♪ Criar minha prévia grátis</Cta>
                {SITE.amostras.length > 0 && (
                  <a className="btn ghost" href="#exemplos">
                    Ouvir exemplos
                  </a>
                )}
              </div>
              <ul className="badges">
                <li>Quiz de ~2 minutos</li>
                <li>Prévia de {SITE.previaSegundos} s grátis</li>
                <li>{precoBRL()} só se gostar</li>
              </ul>
            </div>
            <div className="hero-media">
              {SITE.videoHero ? (
                <video src={SITE.videoHero} controls playsInline preload="metadata" />
              ) : (
                <div className="ph">
                  <div className="vinyl" aria-hidden="true" />
                  <p>Uma música. Uma pessoa. Nenhuma outra igual.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="dark hook">
          <div className="wrap narrow">
            <p>Flores murcham. Perfume acaba. Roupa sai de moda.</p>
            <p>
              Uma música com o nome dela, com o dia em que vocês se conheceram e com aquela piada
              que só vocês entendem <em>toca de novo toda vez que bater a saudade</em>.
            </p>
          </div>
        </section>

        <section>
          <div className="wrap">
            <span className="eyebrow">Por que uma música</span>
            <h2>Um presente que ninguém mais pode dar.</h2>
            <div className="features">
              <div>
                <b>Letra só de vocês</b>
                <span>
                  Escrita a partir das memórias que você conta, com nomes e detalhes reais.
                </span>
              </div>
              <div>
                <b>7 estilos</b>
                <span>{OPCOES.estilo.join(", ")}.</span>
              </div>
              <div>
                <b>Voz e arranjo completos</b>
                <span>Música inteira com voz, instrumentos e refrão para cantar junto.</span>
              </div>
              <div>
                <b>Rápida</b>
                <span>A prévia fica pronta em poucos minutos, sem esperar dias.</span>
              </div>
              <div>
                <b>Única</b>
                <span>Cada música é criada do zero para um pedido. Não existe outra igual.</span>
              </div>
              <div>
                <b>Para guardar</b>
                <span>MP3 para baixar e link para ouvir e compartilhar quando quiser.</span>
              </div>
            </div>
          </div>
        </section>

        <section id="como" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <span className="eyebrow">Como funciona</span>
            <h2>Quatro passos, e você só paga no último.</h2>
            <div className="steps four">
              <div className="step">
                <span className="n">1</span>
                <h3>Responda o quiz</h3>
                <p>Para quem é, a ocasião, a história e o estilo. Leva uns 2 minutos.</p>
              </div>
              <div className="step">
                <span className="n">2</span>
                <h3>A música é criada</h3>
                <p>Letra e melodia ficam prontas em poucos minutos.</p>
              </div>
              <div className="step">
                <span className="n">3</span>
                <h3>Ouça a prévia grátis</h3>
                <p>Escute até {SITE.previaSegundos} segundos e leia o começo da letra.</p>
              </div>
              <div className="step">
                <span className="n">4</span>
                <h3>Gostou? Libere</h3>
                <p>Pague {precoBRL()} no Pix ou cartão e receba a música completa na hora.</p>
              </div>
            </div>
            <p style={{ marginTop: 30 }}>
              <Cta>Começar o quiz</Cta>
            </p>
          </div>
        </section>

        {SITE.amostras.length > 0 && (
          <section className="dark" id="exemplos">
            <div className="wrap">
              <span className="eyebrow" style={{ color: "#F39AAB" }}>
                Exemplos
              </span>
              <h2>Ouça músicas criadas aqui.</h2>
              <div className="filtros" role="group" aria-label="Filtrar por estilo">
                {generos.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={g === filtro ? "on" : ""}
                    onClick={() => setFiltro(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className="samples">
                {amostras.map((s) => (
                  <div className="sample" key={s.ficheiro}>
                    <b>{s.titulo}</b>
                    <small>{s.estilo}</small>
                    <audio controls preload="none" src={s.ficheiro} />
                    <Cta className="btn small" estilo={s.estilo}>
                      Quero neste estilo
                    </Cta>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="wrap">
            <span className="eyebrow">Para quem e para quando</span>
            <h2>Toda data especial cabe numa música.</h2>
            <div className="occasions">
              {OCASIOES.map(([t, d]) => (
                <div className="occ" key={t}>
                  <b>{t}</b>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="wrap narrow">
            <span className="eyebrow">O que você recebe</span>
            <h2>Tudo para emocionar.</h2>
            <ul className="receive">
              <li>Música completa e original, com cerca de 2 a 3 minutos</li>
              <li>Letra completa para ler junto</li>
              <li>MP3 para baixar e guardar para sempre</li>
              <li>Link para ouvir e mandar no WhatsApp</li>
              <li>Prévia grátis antes de pagar</li>
              <li>Suporte pelo WhatsApp</li>
            </ul>
          </div>
        </section>

        <section className="dark" id="preco">
          <div className="wrap" style={{ textAlign: "center" }}>
            <h2>Preço único. Sem assinatura.</h2>
            <div className="price">
              <span className="eyebrow">Música personalizada</span>
              <div className="amount">{precoBRL()}</div>
              <ul>
                <li>Letra feita com a sua história</li>
                <li>Música completa no estilo escolhido</li>
                <li>MP3 + link para compartilhar</li>
                <li>Prévia grátis antes de pagar</li>
                <li>Pronta em poucos minutos</li>
              </ul>
              <Cta>♪ Criar minha prévia grátis</Cta>
              <div className="pay">
                <span>Pix</span>
                <span>Cartão de crédito</span>
                <span>Mercado Pago</span>
              </div>
            </div>
          </div>
        </section>

        <section className="faq" id="duvidas">
          <div className="wrap narrow">
            <span className="eyebrow">Perguntas frequentes</span>
            <h2 style={{ marginBottom: 24 }}>Ficou alguma dúvida?</h2>
            <details>
              <summary>Preciso pagar antes de ouvir?</summary>
              <p>
                Não. Você responde o quiz, ouve uma prévia de {SITE.previaSegundos} segundos e lê o
                começo da letra. Só paga se quiser liberar a música completa.
              </p>
            </details>
            <details>
              <summary>Quanto tempo demora?</summary>
              <p>
                A prévia costuma ficar pronta em poucos minutos. Depois do pagamento, a música
                completa é liberada na hora, na mesma página.
              </p>
            </details>
            <details>
              <summary>A música é exclusiva?</summary>
              <p>
                Sim. Cada música é criada do zero a partir da sua história. Você pode ouvir,
                presentear e compartilhar à vontade.
              </p>
            </details>
            <details>
              <summary>Posso escolher o estilo e a voz?</summary>
              <p>Sim: {OPCOES.estilo.join(", ")}, com voz feminina ou masculina.</p>
            </details>
            <details>
              <summary>Preciso criar conta?</summary>
              <p>
                Não. O seu pedido tem um link exclusivo. É por ele que você acessa a música, e ele
                também vai para o seu e-mail depois do pagamento.
              </p>
            </details>
            <details>
              <summary>Como pago?</summary>
              <p>Pix ou cartão de crédito, pelo Mercado Pago. Pagamento único, sem assinatura.</p>
            </details>
            <details>
              <summary>A música é feita com inteligência artificial?</summary>
              <p>
                Sim. A letra e a música são criadas com ferramentas de IA a partir das informações
                que você envia.
              </p>
            </details>
          </div>
        </section>

        <section className="dark" style={{ textAlign: "center" }}>
          <div className="wrap narrow stack" style={{ alignItems: "center" }}>
            <h2>Em 2 minutos você já está ouvindo a prévia.</h2>
            <Cta>♪ Criar minha prévia grátis</Cta>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div>
            <b style={{ color: "var(--night-ink)" }}>{SITE.marca}</b>
            <br />
            {SITE.empresa} · {SITE.cnpj}
            <br />
            Contato: {SITE.emailContato} · WhatsApp:{" "}
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
              fale com a gente
            </a>
          </div>
          <nav aria-label="Informações legais">
            <Link to="/termos">Termos de Uso</Link>
            <Link to="/privacidade">Privacidade</Link>
            <Link to="/reembolsos">Reembolsos</Link>
          </nav>
        </div>
      </footer>

      <div className="sticky-cta">
        <Cta>♪ Criar prévia grátis</Cta>
      </div>
    </>
  );
}
