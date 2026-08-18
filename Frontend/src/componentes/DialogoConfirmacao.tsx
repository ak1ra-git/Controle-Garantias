"use client";

import { Botao } from "@/componentes/Botao";

interface DialogoConfirmacaoProps {
  titulo: string;
  descricao: string;
  rotuloConfirmar?: string;
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function DialogoConfirmacao({
  titulo,
  descricao,
  rotuloConfirmar = "Confirmar",
  carregando,
  onConfirmar,
  onCancelar,
}: DialogoConfirmacaoProps) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-base font-semibold text-text">{titulo}</h2>
        <p className="mt-2 text-sm text-text-muted">{descricao}</p>

        <div className="mt-6 flex justify-end gap-3">
          <Botao variante="fantasma" onClick={onCancelar} disabled={carregando}>
            Cancelar
          </Botao>
          <Botao variante="perigo" onClick={onConfirmar} carregando={carregando}>
            {rotuloConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  );
}
