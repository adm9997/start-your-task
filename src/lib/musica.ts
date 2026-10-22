// Lógica pura do fluxo da música: opções do quiz, validação, plano de composição e corte da prévia.
// Sem dependências de servidor — usado no navegador, no servidor e nos testes.
import { z } from "zod";

export const OPCOES = {
  relacao: [
    "Namorado(a)",
    "Marido / Esposa",
    "Mãe",
    "Pai",
    "Filho(a)",
    "Avós",
    "Amigo(a)",
    "Outro",
  ],
  ocasiao: [
    "Aniversário",
    "Aniversário de namoro",
    "Casamento",
    "Pedido de casamento",
    "Dia das Mães",
    "Dia dos Pais",
    "Formatura",
    "Chá revelação",
    "Homenagem",
    "Surpresa sem motivo",
  ],
  estilo: ["Sertanejo", "Romântica", "Gospel", "Pagode", "MPB", "Pop", "Rock"],
  voz: ["Feminina", "Masculina"],
  clima: ["Emocionante", "Alegre", "Animada", "Divertida"],
} as const;

// Tags de estilo (em inglês, como o modelo de música entende melhor) para cada gênero.
export const ESTILO_TAGS: Record<(typeof OPCOES.estilo)[number], string[]> = {
  Sertanejo: ["sertanejo", "brazilian country", "acoustic guitar", "accordion", "heartfelt"],
  Romântica: ["romantic ballad", "piano", "soft strings", "intimate"],
  Gospel: ["brazilian gospel", "worship", "uplifting", "choir backing vocals"],
  Pagode: ["pagode", "samba", "cavaquinho", "pandeiro", "warm"],
  MPB: ["MPB", "bossa nova influences", "nylon guitar", "smooth"],
  Pop: ["brazilian pop", "catchy", "modern production"],
  Rock: ["pop rock", "electric guitars", "live drums", "anthemic"],
};

export const CLIMA_TAGS: Record<(typeof OPCOES.clima)[number], string> = {
  Emocionante: "emotional, touching",
  Alegre: "happy, bright",
  Animada: "upbeat, energetic",
  Divertida: "playful, fun",
};

const opt = <T extends readonly [string, ...string[]]>(v: T) => z.enum(v);

export const PedidoSchema = z.object({
  para_quem: z.string().trim().min(1, "Escreva o nome de quem vai receber.").max(120),
  relacao: opt(OPCOES.relacao),
  ocasiao: opt(OPCOES.ocasiao),
  historia: z
    .string()
    .trim()
    .min(20, "Conte um pouco mais da história (mín. 20 caracteres).")
    .max(3000),
  memorias: z.string().trim().min(10, "Conte pelo menos uma memória especial.").max(3000),
  frase: z.string().trim().max(200).optional().default(""),
  evitar: z.string().trim().max(300).optional().default(""),
  estilo: opt(OPCOES.estilo),
  voz: opt(OPCOES.voz),
  clima: opt(OPCOES.clima),
  email: z.string().trim().toLowerCase().email("Confira o e-mail.").max(254),
  whatsapp: z
    .string()
    .trim()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((s) => s === "" || (s.length >= 10 && s.length <= 13), "Confira o WhatsApp (com DDD).")
    .optional()
    .default(""),
  aceite: z.literal(true, { errorMap: () => ({ message: "Aceite os termos para continuar." }) }),
  utm: z.record(z.string().max(200)).optional().default({}),
});
export type PedidoInput = z.infer<typeof PedidoSchema>;

export type Status = "aguardando_geracao" | "gerando" | "previa_pronta" | "pago" | "erro";

// ---------- Letra ----------

export type Secao = { nome: string; linhas: string[] };
export type Letra = { titulo: string; secoes: Secao[] };

/** Extrai e valida a letra (JSON) devolvida pelo modelo de texto. */
export function parseLetra(texto: string): Letra {
  const ini = texto.indexOf("{");
  const fim = texto.lastIndexOf("}");
  if (ini < 0 || fim <= ini) throw new Error("Resposta da letra sem JSON");
  const raw = JSON.parse(texto.slice(ini, fim + 1)) as unknown;
  const s = z
    .object({
      titulo: z.string().min(1).max(80),
      secoes: z
        .array(
          z.object({
            nome: z.string().min(1).max(40),
            linhas: z.array(z.string().min(1).max(140)).max(10),
          }),
        )
        .min(3)
        .max(10),
    })
    .parse(raw);
  return {
    titulo: s.titulo.trim(),
    secoes: s.secoes.map((x) => ({
      nome: x.nome.trim(),
      linhas: x.linhas.map((l) => l.trim()).filter(Boolean),
    })),
  };
}

/** Parte da letra mostrada antes do pagamento (primeiras seções com versos). */
export function letraPrevia(l: Letra, n = 2): Letra {
  return { titulo: l.titulo, secoes: l.secoes.filter((s) => s.linhas.length > 0).slice(0, n) };
}

// ---------- Plano de composição (ElevenLabs Music) ----------

export const duracaoSecao = (linhas: number) =>
  linhas === 0 ? 8000 : Math.min(40000, Math.max(8000, linhas * 4500 + 3000));

export function planoComposicao(l: Letra, p: Pick<PedidoInput, "estilo" | "voz" | "clima">) {
  const voz = p.voz === "Feminina" ? "female lead vocals" : "male lead vocals";
  return {
    positive_global_styles: [
      ...ESTILO_TAGS[p.estilo],
      CLIMA_TAGS[p.clima],
      voz,
      "brazilian portuguese lyrics",
      "clear vocals",
    ],
    negative_global_styles: ["explicit", "spoken word", "english lyrics"],
    sections: l.secoes.map((s) => ({
      section_name: s.nome,
      positive_local_styles: [] as string[],
      negative_local_styles: [] as string[],
      duration_ms: duracaoSecao(s.linhas.length),
      lines: s.linhas,
    })),
  };
}

/** Alternativa em texto livre, usada se o plano de composição for recusado. */
export function promptMusica(l: Letra, p: Pick<PedidoInput, "estilo" | "voz" | "clima">) {
  const plano = planoComposicao(l, p);
  const letra = l.secoes.map((s) => `[${s.nome}]\n${s.linhas.join("\n")}`).join("\n\n");
  const total = plano.sections.reduce((a, s) => a + s.duration_ms, 0);
  return {
    prompt:
      `${plano.positive_global_styles.join(", ")}. Song sung in Brazilian Portuguese with these exact lyrics:\n\n${letra}`.slice(
        0,
        4000,
      ),
    music_length_ms: Math.min(240000, Math.max(60000, total)),
  };
}

// ---------- Corte da prévia (MP3) ----------

const BITRATES: Record<string, number[]> = {
  // MPEG-1 Layer III
  v1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, -1],
  // MPEG-2 / 2.5 Layer III
  v2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, -1],
};
const SAMPLERATES: Record<number, number[]> = {
  3: [44100, 48000, 32000], // MPEG-1
  2: [22050, 24000, 16000], // MPEG-2
  0: [11025, 12000, 8000], // MPEG-2.5
};

function frameInfo(b: Uint8Array, i: number): { len: number; dur: number } | null {
  if (i + 4 > b.length || b[i] !== 0xff || (b[i + 1]! & 0xe0) !== 0xe0) return null;
  const ver = (b[i + 1]! >> 3) & 3;
  const layer = (b[i + 1]! >> 1) & 3;
  if (ver === 1 || layer !== 1) return null; // só Layer III
  const brIdx = b[i + 2]! >> 4;
  const srIdx = (b[i + 2]! >> 2) & 3;
  const pad = (b[i + 2]! >> 1) & 1;
  const br = (ver === 3 ? BITRATES["v1"] : BITRATES["v2"])![brIdx]!;
  const sr = SAMPLERATES[ver]?.[srIdx];
  if (!br || br < 0 || !sr) return null;
  const samples = ver === 3 ? 1152 : 576;
  const len = Math.floor(((samples / 8) * br * 1000) / sr) + pad;
  return { len, dur: samples / sr };
}

/** Devolve os primeiros `segundos` de um MP3, cortando exatamente no fim de um frame. */
export function cortarMp3(b: Uint8Array, segundos: number): Uint8Array {
  let i = 0;
  // Pula tag ID3v2
  if (b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33 && b.length > 10) {
    i = 10 + ((b[6]! << 21) | (b[7]! << 14) | (b[8]! << 7) | b[9]!);
  }
  let t = 0;
  while (i < b.length && t < segundos) {
    const f = frameInfo(b, i);
    if (!f) {
      i++; // ressincroniza
      continue;
    }
    i += f.len;
    t += f.dur;
  }
  return b.slice(0, Math.min(i, b.length));
}
