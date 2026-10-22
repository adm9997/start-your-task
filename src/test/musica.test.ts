import { describe, expect, it } from "vitest";
import {
  cortarMp3,
  duracaoSecao,
  letraPrevia,
  parseLetra,
  PedidoSchema,
  planoComposicao,
  promptMusica,
} from "@/lib/musica";
import { assinaturaMpValida } from "@/lib/servidor.server";

// Frame MPEG-1 Layer III, 128 kbps, 44,1 kHz, sem padding: 417 bytes, 1152 amostras (~26,1 ms)
function frame() {
  const f = new Uint8Array(417);
  f.set([0xff, 0xfb, 0x90, 0x00]);
  return f;
}
function mp3(segundos: number, id3 = false) {
  const n = Math.ceil(segundos / (1152 / 44100));
  const head = id3
    ? new Uint8Array([0x49, 0x44, 0x33, 3, 0, 0, 0, 0, 0, 5, 1, 2, 3, 4, 5])
    : new Uint8Array();
  const out = new Uint8Array(head.length + n * 417);
  out.set(head);
  for (let i = 0; i < n; i++) out.set(frame(), head.length + i * 417);
  return out;
}

describe("cortarMp3", () => {
  it("corta em ~50 s, no limite de um frame", () => {
    const full = mp3(150);
    const prev = cortarMp3(full, 50);
    const dur = (prev.length / 417) * (1152 / 44100);
    expect(prev.length % 417).toBe(0);
    expect(dur).toBeGreaterThanOrEqual(50);
    expect(dur).toBeLessThan(50.1);
  });
  it("preserva a tag ID3 e não passa do tamanho original", () => {
    const full = mp3(20, true);
    expect(cortarMp3(full, 50).length).toBe(full.length);
    const p = cortarMp3(mp3(120, true), 10);
    expect(Array.from(p.slice(0, 3))).toEqual([0x49, 0x44, 0x33]);
    expect((p.length - 15) % 417).toBe(0);
  });
});

const LETRA_JSON = `Aqui está:\n{"titulo":"Ana do Mar","secoes":[{"nome":"Intro","linhas":[]},{"nome":"Verso 1","linhas":["a","b","c","d"]},{"nome":"Refrão","linhas":["e","f","g","h"]},{"nome":"Verso 2","linhas":["i","j"]}]}`;

describe("letra", () => {
  it("extrai o JSON e mostra só o começo na prévia", () => {
    const l = parseLetra(LETRA_JSON);
    expect(l.titulo).toBe("Ana do Mar");
    expect(l.secoes).toHaveLength(4);
    expect(letraPrevia(l).secoes.map((s) => s.nome)).toEqual(["Verso 1", "Refrão"]);
  });
  it("recusa resposta sem JSON", () => {
    expect(() => parseLetra("desculpe")).toThrow();
  });
  it("monta o plano de composição com duração por seção", () => {
    const l = parseLetra(LETRA_JSON);
    const plano = planoComposicao(l, {
      estilo: "Sertanejo",
      voz: "Feminina",
      clima: "Emocionante",
    });
    expect(plano.sections[0]!.duration_ms).toBe(8000);
    expect(plano.sections[1]!.duration_ms).toBe(duracaoSecao(4));
    expect(plano.positive_global_styles).toContain("female lead vocals");
    expect(plano.positive_global_styles).toContain("sertanejo");
    const pr = promptMusica(l, { estilo: "Rock", voz: "Masculina", clima: "Animada" });
    expect(pr.prompt.length).toBeLessThanOrEqual(4000);
    expect(pr.music_length_ms).toBeGreaterThanOrEqual(60000);
  });
});

describe("PedidoSchema", () => {
  const base = {
    para_quem: "Ana",
    relacao: "Namorado(a)",
    ocasiao: "Aniversário",
    historia: "Nos conhecemos num show em 2019 em BH.",
    memorias: "Viagem para Ouro Preto",
    estilo: "Sertanejo",
    voz: "Feminina",
    clima: "Emocionante",
    email: "  Ana@Exemplo.com ",
    whatsapp: "(31) 99999-0000",
    aceite: true,
  };
  it("normaliza e-mail e WhatsApp", () => {
    const r = PedidoSchema.parse(base);
    expect(r.email).toBe("ana@exemplo.com");
    expect(r.whatsapp).toBe("31999990000");
  });
  it("exige aceite e opções válidas", () => {
    expect(PedidoSchema.safeParse({ ...base, aceite: false }).success).toBe(false);
    expect(PedidoSchema.safeParse({ ...base, estilo: "Funk" }).success).toBe(false);
  });
});

describe("assinatura do webhook Mercado Pago", () => {
  it("aceita assinatura correta e recusa adulterada", async () => {
    const segredo = "segredo-teste";
    const manifesto = "id:123456;request-id:req-1;ts:1704908010;";
    const k = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(segredo),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = Array.from(
      new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(manifesto))),
      (x) => x.toString(16).padStart(2, "0"),
    ).join("");
    expect(await assinaturaMpValida(`ts=1704908010,v1=${sig}`, "req-1", "123456", segredo)).toBe(
      true,
    );
    expect(await assinaturaMpValida(`ts=1704908011,v1=${sig}`, "req-1", "123456", segredo)).toBe(
      false,
    );
    expect(await assinaturaMpValida("lixo", "req-1", "123456", segredo)).toBe(false);
  });
});
