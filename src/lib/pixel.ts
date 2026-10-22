// Meta Pixel no navegador. Só funciona se SITE.metaPixelId estiver preenchido.
import { SITE } from "@/lib/site";

type Fbq = (...args: unknown[]) => void;

export function pixelScript() {
  if (!SITE.metaPixelId) return "";
  const id = SITE.metaPixelId.replace(/\D/g, "");
  return `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`;
}

export function track(evento: string, params: Record<string, unknown> = {}, eventID?: string) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (!fbq) return;
  fbq("track", evento, params, eventID ? { eventID } : undefined);
}

/** Guarda as UTMs da primeira visita para anexar ao pedido. */
export function guardarUtm() {
  if (typeof window === "undefined") return;
  try {
    const q = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const k of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
    ]) {
      const v = q.get(k);
      if (v) utm[k] = v.slice(0, 200);
    }
    if (Object.keys(utm).length) sessionStorage.setItem("utm", JSON.stringify(utm));
  } catch {
    /* sem storage */
  }
}

export function lerUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem("utm") || "{}");
  } catch {
    return {};
  }
}
