import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/SiteChrome";
import type { Letra } from "@/lib/musica";
import { track } from "@/lib/pixel";
import { SITE, precoBRL } from "@/lib/site";

type Visao = {
  status: "aguardando_geracao" | "gerando" | "previa_pronta" | "pago" | "erro";
  para_quem: string;
  ocasiao: string;
  estilo: string;
  voz: string;
  titulo: string | null;
  valor_centavos: number;
  letra: Letra | null;
  previa_url: string | null;
  audio_url: string | null;
  download_url: string | null;
  pode_tentar_de_novo: boolean;
  geracao_travada: boolean;
};

type Search = {
  payment_id?: string | undefined;
  status?: string | undefined;
  collection_status?: string | undefined;
};

export const Route = createFileRoute("/pedido/$token")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    payment_id:
      typeof s["payment_id"] === "string" || typeof s["payment_id"] === "number"
        ? String(s["payment_id"])
        : undefined,
    status: typeof s["status"] === "string" ? s["status"] : undefined,
    collection_status:
      typeof s["collection_status"] === "string" ? s["collection_status"] : undefined,
  }),
  head: () => ({
    meta: [{ title: `Sua música — ${SITE.marca}` }, { name: "robots", content: "noindex" }],
  }),
  component: Pedido,
});

const FRASES = [
  "Lendo a história de vocês…",
  "Escrevendo a letra…",
  "Encontrando a melodia…",
  "Gravando a voz…",
  "Mixando os instrumentos…",
  "Quase lá…",
];

function LetraView({ letra, completa }: { letra: Letra; completa: boolean }) {
  return (
    <div className="letra">
      {letra.secoes
        .filter((s) => s.linhas.length)
        .map((s, i) => (
          <div key={i}>
            <small>{s.nome}</small>
            {s.linhas.map((l, j) => (
              <p key={j}>{l}</p>
            ))}
          </div>
        ))}
      {!completa && <p className="under">…a letra completa aparece depois de liberar a música.</p>}
    </div>
  );
}

function Pedido() {
  const { token } = Route.useParams();
  const { payment_id, status: mpStatus, collection_status } = Route.useSearch();
  const [v, setV] = useState<Visao | null>(null);
  const [err, setErr] = useState("");
  const [frase, setFrase] = useState(0);
  const [pagando, setPagando] = useState(false);
  const gerou = useRef(false);
  const comprou = useRef(false);

  const carregar = useCallback(async () => {
    const q = new URLSearchParams({ token });
    if (payment_id) q.set("payment_id", payment_id);
    const r = await fetch(`/api/status?${q}`);
    const out = (await r.json()) as Visao & { erro?: string };
    if (!r.ok) throw new Error(out.erro || "Não encontramos este pedido.");
    setV(out);
    return out;
  }, [token, payment_id]);

  const gerar = useCallback(async () => {
    setErr("");
    setV((x) => (x ? { ...x, status: "gerando" } : x));
    try {
      const r = await fetch("/api/gerar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const out = (await r.json()) as { erro?: string };
      if (!r.ok) setErr(out.erro || "A criação falhou.");
    } catch {
      /* conexão caiu: o polling abaixo continua acompanhando */
    }
    await carregar().catch(() => undefined);
  }, [token, carregar]);

  // Primeira carga + dispara a geração se ainda não começou
  useEffect(() => {
    carregar()
      .then((x) => {
        if ((x.status === "aguardando_geracao" || x.geracao_travada) && !gerou.current) {
          gerou.current = true;
          void gerar();
        }
      })
      .catch((e: Error) => setErr(e.message));
  }, [carregar, gerar]);

  // Acompanha enquanto gera ou enquanto o pagamento é confirmado
  const aguardandoPagamento =
    !!payment_id && v?.status === "previa_pronta" && (mpStatus ?? collection_status) !== "rejected";
  useEffect(() => {
    if (!v || !(v.status === "gerando" || aguardandoPagamento)) return;
    const t = setInterval(
      () => {
        carregar()
          .then((x) => {
            if (x.geracao_travada && !gerou.current) {
              gerou.current = true;
              void gerar();
            }
          })
          .catch(() => undefined);
      },
      aguardandoPagamento ? 4000 : 6000,
    );
    return () => clearInterval(t);
  }, [v, aguardandoPagamento, carregar, gerar]);

  useEffect(() => {
    if (v?.status !== "gerando") return;
    const t = setInterval(() => setFrase((f) => Math.min(f + 1, FRASES.length - 1)), 20000);
    return () => clearInterval(t);
  }, [v?.status]);

  useEffect(() => {
    if (v?.status === "pago" && payment_id && !comprou.current) {
      comprou.current = true;
      track("Purchase", { currency: "BRL", value: v.valor_centavos / 100 }, undefined);
    }
  }, [v?.status, v?.valor_centavos, payment_id]);

  async function pagar() {
    setPagando(true);
    setErr("");
    track("InitiateCheckout", {
      currency: "BRL",
      value: (v?.valor_centavos ?? SITE.precoCentavos) / 100,
    });
    try {
      const r = await fetch("/api/pagar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const out = (await r.json()) as { url?: string; erro?: string };
      if (!r.ok || !out.url) throw new Error(out.erro || "Não conseguimos abrir o pagamento.");
      window.location.href = out.url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Não conseguimos abrir o pagamento.");
      setPagando(false);
    }
  }

  const linkPagina =
    typeof window !== "undefined" ? window.location.origin + `/pedido/${token}` : "";
  const textoWhats = encodeURIComponent(`Fiz uma música especial para você ♪ ${linkPagina}`);

  return (
    <div className="form-page">
      <header className="nav">
        <div className="wrap">
          <Logo />
        </div>
      </header>
      <main className="wrap narrow">
        <div className="card stack">
          {!v && !err && <p className="lead">Carregando…</p>}
          {!v && err && (
            <>
              <h1 style={{ fontSize: "2rem" }}>Pedido não encontrado</h1>
              <p className="lead">{err}</p>
              <Link className="btn" to="/criar">
                Criar uma música
              </Link>
            </>
          )}

          {v && (v.status === "gerando" || v.status === "aguardando_geracao") && (
            <div className="stack" style={{ textAlign: "center", alignItems: "center" }}>
              <div className="vinyl" style={{ width: 140 }} aria-hidden="true" />
              <h1 style={{ fontSize: "clamp(1.6rem,5vw,2.2rem)" }}>
                Criando a música para {v.para_quem}
              </h1>
              <p className="lead" aria-live="polite">
                {FRASES[frase]}
              </p>
              <p className="under">
                Leva poucos minutos. Deixe esta página aberta. Se sair, volte por este mesmo link.
              </p>
            </div>
          )}

          {v && v.status === "erro" && (
            <div className="stack">
              <h1 style={{ fontSize: "2rem" }}>A criação não deu certo desta vez</h1>
              <p className="lead">{err || "Tivemos um problema ao criar a música."}</p>
              {v.pode_tentar_de_novo ? (
                <button className="btn" onClick={() => void gerar()}>
                  Tentar de novo
                </button>
              ) : (
                <a
                  className="btn"
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar no WhatsApp
                </a>
              )}
            </div>
          )}

          {v && v.status === "previa_pronta" && (
            <div className="stack">
              <span className="eyebrow">Prévia grátis</span>
              <h1 style={{ fontSize: "clamp(1.6rem,5vw,2.2rem)" }}>
                {v.titulo ?? `Para ${v.para_quem}`}
              </h1>
              <p className="under" style={{ marginTop: 0 }}>
                {v.estilo} · voz {v.voz.toLowerCase()} · {v.ocasiao}
              </p>
              {v.previa_url && (
                <audio
                  controls
                  preload="auto"
                  src={v.previa_url}
                  style={{ width: "100%" }}
                  onPlay={() => track("ViewContent", { content_name: "Prévia" })}
                />
              )}
              {v.letra && <LetraView letra={v.letra} completa={false} />}
              {aguardandoPagamento ? (
                <div className="msg ok">
                  Confirmando o seu pagamento… isso leva alguns segundos.
                </div>
              ) : (
                <>
                  {(mpStatus ?? collection_status) === "rejected" && (
                    <div className="msg err">
                      O pagamento não foi aprovado. Tente de novo ou use outra forma.
                    </div>
                  )}
                  <div
                    className="price"
                    style={{ margin: 0, boxShadow: "none", border: "1px solid var(--line)" }}
                  >
                    <span className="eyebrow">Liberar música completa</span>
                    <div className="amount">{precoBRL(v.valor_centavos)}</div>
                    <ul>
                      <li>Música inteira (~2 a 3 min)</li>
                      <li>Letra completa</li>
                      <li>MP3 para baixar + link para compartilhar</li>
                    </ul>
                    <button className="btn" onClick={() => void pagar()} disabled={pagando}>
                      {pagando ? "Abrindo pagamento…" : "Liberar com Pix ou cartão"}
                    </button>
                    <div className="pay">
                      <span>Pix</span>
                      <span>Cartão</span>
                      <span>Mercado Pago</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {v && v.status === "pago" && (
            <div className="stack">
              <span className="eyebrow">Música liberada</span>
              <h1 style={{ fontSize: "clamp(1.6rem,5vw,2.2rem)" }}>
                {v.titulo ?? `Para ${v.para_quem}`}
              </h1>
              {v.audio_url && (
                <audio controls preload="auto" src={v.audio_url} style={{ width: "100%" }} />
              )}
              <div className="ctas">
                {v.download_url && (
                  <a className="btn" href={v.download_url}>
                    Baixar MP3
                  </a>
                )}
                <a
                  className="btn ghost"
                  href={`https://wa.me/?text=${textoWhats}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar no WhatsApp
                </a>
              </div>
              <p className="under">
                Guarde este link: é por ele que você ouve a música sempre que quiser.
              </p>
              {v.letra && <LetraView letra={v.letra} completa />}
            </div>
          )}

          {v && err && v.status !== "erro" && (
            <div className="msg err" role="alert">
              {err}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
