import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Logo } from "@/components/SiteChrome";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

type Search = { session?: string };

export const Route = createFileRoute("/historia")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    session: typeof s["session"] === "string" ? s["session"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Conta-nos a vossa história — Canção Para Ti" },
      { name: "description", content: "Preenche a história para criarmos a tua canção personalizada." },
      { property: "og:title", content: "Conta-nos a vossa história" },
      { property: "og:description", content: "Demora cerca de 5 minutos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Historia,
});

const OPTS = {
  relacao: ["Parceiro(a)", "Mãe", "Pai", "Filho(a)", "Avós", "Amigo(a)", "Outro"],
  ocasiao: ["Aniversário", "Casamento", "Pedido de casamento", "Natal", "Dia da Mãe / do Pai", "Nascimento", "Sem motivo"],
  estilo: ["Balada", "Pop", "Fado", "Acústico", "Romântico", "Animado"],
  voz: ["Feminina", "Masculina", "Tanto faz"],
} as const;

const REQUIRED = ["para_quem", "relacao", "ocasiao", "historia", "memorias", "estilo", "voz", "email"] as const;
const FIELDS = [...REQUIRED, "frase", "evitar"] as const;
type Data = Record<(typeof FIELDS)[number], string>;
const EMPTY = Object.fromEntries(FIELDS.map((f) => [f, ""])) as Data;

function Choices({ name, value, onChange }: { name: keyof typeof OPTS; value: string; onChange: (v: string) => void }) {
  return (
    <div className="choices">
      {OPTS[name].map((v) => (
        <label key={v}>
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />
          <span>{v}</span>
        </label>
      ))}
    </div>
  );
}

function Historia() {
  const { session = "" } = Route.useSearch();
  const pago = !!(SITE.checkoutAtivo && session);
  const KEY = "historia-rascunho-" + session;
  const [d, setD] = useState<Data>(EMPTY);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ email: string; when: string } | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      setD((p) => ({ ...p, ...saved }));
    } catch { /* ignore */ }
  }, [KEY]);

  const set = (k: keyof Data, v: string) =>
    setD((p) => {
      const n = { ...p, [k]: v };
      try { localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* ignore */ }
      return n;
    });

  const val = (k: keyof Data) => d[k].trim();
  const pct = Math.round((REQUIRED.filter((n) => val(n)).length / REQUIRED.length) * 100);

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setErr("");
    if (REQUIRED.some((n) => !val(n))) {
      setErr("Falta preencher os campos com *. Confere a vossa relação, a ocasião, o estilo e a voz.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(val("email"))) {
      setErr("O email não parece válido. Confere se está bem escrito.");
      return;
    }
    setSending(true);
    const row = {
      stripe_session: pago ? session : null,
      status: pago ? "novo" : "aguarda_pagamento",
      para_quem: val("para_quem"),
      relacao: val("relacao"),
      ocasiao: val("ocasiao"),
      historia: val("historia"),
      memorias: val("memorias"),
      frase: val("frase") || null,
      estilo: val("estilo"),
      voz: val("voz"),
      evitar: val("evitar") || null,
      email: val("email"),
    };
    const { error } = await supabase.from("pedidos").insert(row);
    setSending(false);
    if (error) {
      setErr(`Não conseguimos enviar agora. O teu texto ficou guardado nesta página: tenta de novo daqui a um minuto ou escreve para ${SITE.emailContacto}.`);
      return;
    }
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    const w = new Date(Date.now() + 48 * 3600 * 1000);
    setDone({
      email: row.email,
      when:
        w.toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" }) +
        ", " + w.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
    });
    window.scrollTo(0, 0);
  }

  return (
    <div className="form-page">
      <header className="nav">
        <div className="wrap"><Logo /></div>
      </header>
      <main className="wrap narrow">
        {done ? (
          <div className="card">
            <div className="stack" style={{ textAlign: "center", alignItems: "center" }}>
              <div className="vinyl" style={{ width: 120 }} aria-hidden="true" />
              <h1 style={{ fontSize: "clamp(1.7rem,5vw,2.4rem)" }}>Recebido!</h1>
              {pago ? (
                <>
                  <p className="lead">A tua canção chega a <b>{done.email}</b> até <b>{done.when}</b>.</p>
                  <p className="under">Se tiveres comprado a entrega expresso, chega em até 6 horas.</p>
                </>
              ) : (
                <p className="lead">Vamos responder para <b>{done.email}</b> em até 24 horas com os próximos passos e o pagamento. A canção fica pronta 48 horas depois.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="stack">
              {pago && <div className="msg ok">Pagamento recebido. Obrigado!</div>}
              <h1 style={{ fontSize: "clamp(1.7rem,5vw,2.4rem)" }}>
                {pago ? "Falta só um passo: conta-nos a vossa história" : "Conta-nos a vossa história"}
              </h1>
              <p className="lead" style={{ fontSize: "1rem" }}>Demora cerca de 5 minutos. Quanto mais detalhes, mais a canção vai soar a vocês.</p>
              <div className="progress" aria-hidden="true"><div style={{ width: pct + "%" }} /></div>
            </div>

            <form className="stack" style={{ marginTop: 26 }} noValidate onSubmit={submit}>
              <div className="field">
                <label htmlFor="para_quem">Para quem é a canção? *</label>
                <span className="hint">O nome e como lhe chamas (ex.: Ana, "a minha Aninhas")</span>
                <input id="para_quem" maxLength={120} value={d.para_quem} onChange={(e) => set("para_quem", e.target.value)} />
              </div>
              <fieldset className="field"><legend>Qual é a vossa relação? *</legend>
                <Choices name="relacao" value={d.relacao} onChange={(v) => set("relacao", v)} /></fieldset>
              <fieldset className="field"><legend>Qual é a ocasião? *</legend>
                <Choices name="ocasiao" value={d.ocasiao} onChange={(v) => set("ocasiao", v)} /></fieldset>
              <div className="field">
                <label htmlFor="historia">Como se conheceram, ou um momento marcante *</label>
                <span className="hint">Conta como se estivesses a falar com um amigo.</span>
                <textarea id="historia" maxLength={3000} value={d.historia} onChange={(e) => set("historia", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="memorias">3 memórias ou detalhes que só vocês sabem *</label>
                <span className="hint">Uma viagem, uma mania, um sítio especial, uma música vossa…</span>
                <textarea id="memorias" maxLength={3000} value={d.memorias} onChange={(e) => set("memorias", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="frase">Uma frase, alcunha ou piada vossa que queiras ouvir na canção</label>
                <input id="frase" maxLength={200} value={d.frase} onChange={(e) => set("frase", e.target.value)} />
              </div>
              <fieldset className="field"><legend>Estilo musical *</legend>
                <Choices name="estilo" value={d.estilo} onChange={(v) => set("estilo", v)} /></fieldset>
              <fieldset className="field"><legend>Voz *</legend>
                <Choices name="voz" value={d.voz} onChange={(v) => set("voz", v)} /></fieldset>
              <div className="field">
                <label htmlFor="evitar">Há algo que NÃO deve aparecer na letra?</label>
                <input id="evitar" maxLength={300} value={d.evitar} onChange={(e) => set("evitar", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="email">Email para receberes a canção *</label>
                <input id="email" type="email" autoComplete="email" value={d.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <p className="hint" style={{ fontSize: ".9rem", color: "var(--muted)" }}>Compraste o vídeo com a letra? Depois de enviares, responde ao email de confirmação com até 10 fotos.</p>
              {err && <div className="msg err">{err}</div>}
              <button className="btn" type="submit" disabled={sending}>{sending ? "A enviar…" : "Enviar a nossa história"}</button>
              <p className="under">Os teus dados são usados só para criar e entregar a canção. <Link to="/privacidade">Privacidade</Link></p>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
