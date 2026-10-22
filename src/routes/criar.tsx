import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Logo } from "@/components/SiteChrome";
import { OPCOES, PedidoSchema } from "@/lib/musica";
import { lerUtm, track } from "@/lib/pixel";
import { SITE, precoBRL } from "@/lib/site";

type Search = { estilo?: string | undefined };

export const Route = createFileRoute("/criar")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    estilo: typeof s["estilo"] === "string" ? s["estilo"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Criar minha música — ${SITE.marca}` },
      {
        name: "description",
        content: "Responda o quiz e ouça a prévia grátis da sua música personalizada.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Criar,
});

const CAMPOS = [
  "para_quem",
  "relacao",
  "ocasiao",
  "historia",
  "memorias",
  "frase",
  "evitar",
  "estilo",
  "voz",
  "clima",
  "email",
  "whatsapp",
] as const;
type Campo = (typeof CAMPOS)[number];
type Dados = Record<Campo, string> & { aceite: boolean };
const VAZIO: Dados = {
  ...(Object.fromEntries(CAMPOS.map((c) => [c, ""])) as Record<Campo, string>),
  aceite: false,
};
const KEY = "quiz-rascunho";

const ETAPAS: { titulo: string; campos: Campo[] }[] = [
  { titulo: "Para quem é a música?", campos: ["para_quem", "relacao", "ocasiao"] },
  { titulo: "Conte a história de vocês", campos: ["historia", "memorias", "frase", "evitar"] },
  { titulo: "Como ela deve soar?", campos: ["estilo", "voz", "clima"] },
  { titulo: "Para onde enviamos?", campos: ["email", "whatsapp"] },
];

function Escolhas({
  nome,
  valor,
  onChange,
}: {
  nome: keyof typeof OPCOES;
  valor: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="choices">
      {OPCOES[nome].map((v) => (
        <label key={v}>
          <input
            type="radio"
            name={nome}
            value={v}
            checked={valor === v}
            onChange={() => onChange(v)}
          />
          <span>{v}</span>
        </label>
      ))}
    </div>
  );
}

function Criar() {
  const { estilo } = Route.useSearch();
  const navigate = useNavigate();
  const [d, setD] = useState<Dados>(VAZIO);
  const [etapa, setEtapa] = useState(0);
  const [err, setErr] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(KEY) || "{}");
      setD((p) => ({ ...p, ...salvo, aceite: false }));
    } catch {
      /* sem storage */
    }
    if (estilo && (OPCOES.estilo as readonly string[]).includes(estilo))
      setD((p) => ({ ...p, estilo }));
  }, [estilo]);

  const set = <K extends keyof Dados>(k: K, v: Dados[K]) =>
    setD((p) => {
      const n = { ...p, [k]: v };
      try {
        const { aceite: _a, ...resto } = n;
        localStorage.setItem(KEY, JSON.stringify(resto));
      } catch {
        /* sem storage */
      }
      return n;
    });

  function validarEtapa(i: number) {
    const r = PedidoSchema.safeParse({ ...d, aceite: true });
    if (r.success) return "";
    const campos = ETAPAS[i]!.campos as string[];
    const issue = r.error.issues.find((x) => campos.includes(String(x.path[0])));
    if (!issue) return "";
    const nome = String(issue.path[0]);
    if (["relacao", "ocasiao", "estilo", "voz", "clima"].includes(nome))
      return "Escolha uma opção em cada pergunta.";
    return issue.message;
  }

  async function avancar(ev: FormEvent) {
    ev.preventDefault();
    const msg = validarEtapa(etapa);
    setErr(msg);
    if (msg) return;
    if (etapa < ETAPAS.length - 1) {
      setEtapa(etapa + 1);
      window.scrollTo(0, 0);
      return;
    }
    if (!d.aceite) return setErr("Aceite os termos para continuar.");
    setEnviando(true);
    try {
      const r = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...d, utm: lerUtm() }),
      });
      const out = (await r.json()) as { token?: string; id?: string; erro?: string };
      if (!r.ok || !out.token) throw new Error(out.erro || "Não conseguimos enviar agora.");
      track("Lead", { content_name: "Quiz música" }, out.id);
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* sem storage */
      }
      navigate({ to: "/pedido/$token", params: { token: out.token } });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Não conseguimos enviar agora. Tente de novo.");
      setEnviando(false);
    }
  }

  const pct = Math.round(((etapa + 1) / ETAPAS.length) * 100);

  return (
    <div className="form-page">
      <header className="nav">
        <div className="wrap">
          <Logo />
        </div>
      </header>
      <main className="wrap narrow">
        <div className="card">
          <div className="stack">
            <span className="eyebrow">
              Passo {etapa + 1} de {ETAPAS.length}
            </span>
            <h1 style={{ fontSize: "clamp(1.7rem,5vw,2.4rem)" }}>{ETAPAS[etapa]!.titulo}</h1>
            <div className="progress" aria-hidden="true">
              <div style={{ width: pct + "%" }} />
            </div>
          </div>

          <form className="stack" style={{ marginTop: 26 }} noValidate onSubmit={avancar}>
            {etapa === 0 && (
              <>
                <div className="field">
                  <label htmlFor="para_quem">Nome de quem vai receber *</label>
                  <span className="hint">Como você chama a pessoa (ex.: Ana, "minha Aninha")</span>
                  <input
                    id="para_quem"
                    maxLength={120}
                    value={d.para_quem}
                    onChange={(e) => set("para_quem", e.target.value)}
                  />
                </div>
                <fieldset className="field">
                  <legend>Qual a relação de vocês? *</legend>
                  <Escolhas nome="relacao" valor={d.relacao} onChange={(v) => set("relacao", v)} />
                </fieldset>
                <fieldset className="field">
                  <legend>Qual a ocasião? *</legend>
                  <Escolhas nome="ocasiao" valor={d.ocasiao} onChange={(v) => set("ocasiao", v)} />
                </fieldset>
              </>
            )}

            {etapa === 1 && (
              <>
                <div className="field">
                  <label htmlFor="historia">
                    Como vocês se conheceram, ou um momento marcante *
                  </label>
                  <span className="hint">Escreva como se estivesse contando para um amigo.</span>
                  <textarea
                    id="historia"
                    maxLength={3000}
                    value={d.historia}
                    onChange={(e) => set("historia", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="memorias">Detalhes que só vocês sabem *</label>
                  <span className="hint">
                    Uma viagem, uma mania, um lugar especial, um apelido, uma data…
                  </span>
                  <textarea
                    id="memorias"
                    maxLength={3000}
                    value={d.memorias}
                    onChange={(e) => set("memorias", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="frase">Uma frase que você quer ouvir na música</label>
                  <input
                    id="frase"
                    maxLength={200}
                    value={d.frase}
                    onChange={(e) => set("frase", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="evitar">Algo que NÃO pode aparecer na letra?</label>
                  <input
                    id="evitar"
                    maxLength={300}
                    value={d.evitar}
                    onChange={(e) => set("evitar", e.target.value)}
                  />
                </div>
              </>
            )}

            {etapa === 2 && (
              <>
                <fieldset className="field">
                  <legend>Estilo musical *</legend>
                  <Escolhas nome="estilo" valor={d.estilo} onChange={(v) => set("estilo", v)} />
                </fieldset>
                <fieldset className="field">
                  <legend>Voz *</legend>
                  <Escolhas nome="voz" valor={d.voz} onChange={(v) => set("voz", v)} />
                </fieldset>
                <fieldset className="field">
                  <legend>Clima da música *</legend>
                  <Escolhas nome="clima" valor={d.clima} onChange={(v) => set("clima", v)} />
                </fieldset>
              </>
            )}

            {etapa === 3 && (
              <>
                <div className="field">
                  <label htmlFor="email">Seu e-mail *</label>
                  <span className="hint">Usamos para enviar a música depois do pagamento.</span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={d.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="whatsapp">Seu WhatsApp (opcional)</label>
                  <input
                    id="whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(11) 99999-9999"
                    value={d.whatsapp}
                    onChange={(e) => set("whatsapp", e.target.value)}
                  />
                </div>
                <label className="aceite">
                  <input
                    id="aceite"
                    type="checkbox"
                    checked={d.aceite}
                    onChange={(e) => set("aceite", e.target.checked)}
                  />
                  <span>
                    Li e aceito os{" "}
                    <Link to="/termos" target="_blank">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link to="/privacidade" target="_blank">
                      Política de Privacidade
                    </Link>
                    .
                  </span>
                </label>
                <p className="hint">
                  A prévia é grátis. Se gostar, a música completa custa {precoBRL()}.
                </p>
              </>
            )}

            {err && (
              <div className="msg err" role="alert">
                {err}
              </div>
            )}
            <div className="quiz-nav">
              {etapa > 0 && (
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    setErr("");
                    setEtapa(etapa - 1);
                  }}
                >
                  Voltar
                </button>
              )}
              <button className="btn" type="submit" disabled={enviando}>
                {etapa < ETAPAS.length - 1
                  ? "Continuar"
                  : enviando
                    ? "Enviando…"
                    : "♪ Criar minha prévia grátis"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
