"use client";

import { useState, type FormEvent } from "react";
import type { Categoria, Produto, DadosProduto } from "@/types";
import { Campo } from "@/componentes/Campo";
import { Seletor } from "@/componentes/Seletor";
import { Botao } from "@/componentes/Botao";

interface ModalProdutoProps {
  categorias: Categoria[];
  produtoEmEdicao: Produto | null;
  salvando: boolean;
  onFechar: () => void;
  onSalvar: (dto: DadosProduto) => Promise<void>;
}

function categoriaIdInicial(produto: Produto | null, categorias: Categoria[]): string {
  if (!produto) return categorias[0]?.id.toString() ?? "";
  const match = categorias.find((c) => c.nome === produto.categoriaNome);
  return match?.id.toString() ?? categorias[0]?.id.toString() ?? "";
}

export function ModalProduto({
  categorias,
  produtoEmEdicao,
  salvando,
  onFechar,
  onSalvar,
}: ModalProdutoProps) {
  const [nome, setNome] = useState(produtoEmEdicao?.nome ?? "");
  const [codCategoria, setCodCategoria] = useState(
    categoriaIdInicial(produtoEmEdicao, categorias)
  );
  const [dataCompra, setDataCompra] = useState(produtoEmEdicao?.dataCompra ?? "");
  const [dataVencimento, setDataVencimento] = useState(produtoEmEdicao?.dataVencimento ?? "");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);

  function validar(): boolean {
    const novosErros: Record<string, string> = {};

    if (!nome.trim()) novosErros.nome = "Informe o nome do produto.";
    if (!codCategoria) novosErros.categoria = "Selecione uma categoria.";
    if (!dataCompra) novosErros.dataCompra = "Informe a data de compra.";
    if (!dataVencimento) novosErros.dataVencimento = "Informe a data de vencimento.";
    if (dataCompra && dataVencimento && dataVencimento < dataCompra) {
      novosErros.dataVencimento = "A data de vencimento deve ser após a data de compra.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErroFormulario(null);

    if (!validar()) return;

    try {
      await onSalvar({
        nome: nome.trim(),
        codCategoria: Number(codCategoria),
        dataCompra,
        dataVencimento,
      });
    } catch {
      setErroFormulario("Não foi possível salvar o produto. Tente novamente.");
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-base font-semibold text-text">
          {produtoEmEdicao ? "Editar produto" : "Novo produto"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <Campo
            rotulo="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            erro={erros.nome}
            placeholder="Ex: Notebook Dell"
          />

          <Seletor
            rotulo="Categoria"
            value={codCategoria}
            onChange={(e) => setCodCategoria(e.target.value)}
            erro={erros.categoria}
          >
            {categorias.length === 0 && <option value="">Nenhuma categoria disponível</option>}
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </Seletor>

          <div className="grid grid-cols-2 gap-4">
            <Campo
              rotulo="Data de compra"
              type="date"
              value={dataCompra}
              onChange={(e) => setDataCompra(e.target.value)}
              erro={erros.dataCompra}
            />
            <Campo
              rotulo="Vencimento"
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
              erro={erros.dataVencimento}
            />
          </div>

          {erroFormulario && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erroFormulario}</p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <Botao type="button" variante="fantasma" onClick={onFechar} disabled={salvando}>
              Cancelar
            </Botao>
            <Botao type="submit" carregando={salvando}>
              {produtoEmEdicao ? "Salvar alterações" : "Adicionar"}
            </Botao>
          </div>
        </form>
      </div>
    </div>
  );
}
