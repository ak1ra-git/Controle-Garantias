"use client";

import { useRouter } from "next/navigation";
import { useAutenticacao } from "@/lib/contexto-autenticacao";
import { IconeEscudo, IconeSair } from "@/componentes/icones";
import { Botao } from "@/componentes/Botao";

export function BarraNavegacao() {
  const { nome, logout } = useAutenticacao();
  const router = useRouter();

  function sair() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 text-primary">
          <IconeEscudo />
          <span className="text-base font-semibold text-text">Minhas Garantias</span>
        </div>

        <div className="flex items-center gap-3">
          {nome && (
            <span className="hidden text-sm text-text-muted sm:inline">Olá, {nome}</span>
          )}
          <Botao variante="fantasma" onClick={sair}>
            <IconeSair />
            Sair
          </Botao>
        </div>
      </div>
    </header>
  );
}
