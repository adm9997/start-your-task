import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

export function Logo({ asLink = true }: { asLink?: boolean }) {
  const inner = (
    <>
      <span className="disc" aria-hidden="true" />
      <span>{SITE.marca}</span>
    </>
  );
  return asLink ? (
    <Link className="logo" to="/">
      {inner}
    </Link>
  ) : (
    <span className="logo">{inner}</span>
  );
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <header className="nav">
        <div className="wrap">
          <Logo />
        </div>
      </header>
      <main className="wrap narrow">
        <div className="card stack">
          <p className="msg err">
            MODELO A REVISAR POR UM ADVOGADO ANTES DE PUBLICAR. Substitua os campos entre [colchetes].
          </p>
          <h1 style={{ fontSize: "2rem" }}>{title}</h1>
          {children}
        </div>
      </main>
    </>
  );
}
