import { createFileRoute, redirect } from "@tanstack/react-router";

// Endereço antigo do formulário: agora o quiz fica em /criar.
export const Route = createFileRoute("/historia")({
  beforeLoad: () => {
    throw redirect({ to: "/criar", replace: true });
  },
});
