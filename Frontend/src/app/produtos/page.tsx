"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAutenticacao } from "@/lib/contexto-autenticacao";
import { apiCategoria, apiProduto } from "@/lib/api";
import type { Categoria, Produto, DadosProduto } from "@/types";
import { BarraNavegacao } from "@/componentes/BarraNavegacao";
import { Botao } from "@/componentes/Botao";
import { CartaoProduto } from "@/componentes/CartaoProduto";
import { ModalProduto } from "@/componentes/ModalProduto";
import { DialogoConfirmacao } from "@/componentes/DialogoConfirmacao";
import { IconeMais, IconeEscudo, IconeCaixa } from "@/componentes/icones";

export default function ProdutosPage() {
  const { token, isLoading: carregandoAutenticacao } = useAutenticacao();
  const router = useRouter();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const carregarDados = useCallback(async (token: string) => {
    setCarregando(true);
    setErro(null);
    try {
      const [listaProdutos, listaCategorias] = await Promise.all([
        apiProduto.listar(token),
        apiCategoria.listar(token),
      ]);
      setProdutos(listaProdutos);
      setCategorias(listaCategorias);
    } catch {
      setErro("Não foi possível carregar seus produtos. Verifique se a API está no ar.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (carregandoAutenticacao) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    // Busca produtos/categorias na API (sistema externo) quando o token fica disponivel.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDados(token);
  }, [carregandoAutenticacao, token, router, carregarDados]);

  function abrirModalCriar() {
    setProdutoEmEdicao(null);
    setModalAberto(true);
  }

  function abrirModalEditar(produto: Produto) {
    setProdutoEmEdicao(produto);
    setModalAberto(true);
  }

  async function salvarProduto(dto: DadosProduto) {
    if (!token) return;
    setSalvando(true);
    try {
      if (produtoEmEdicao) {
        await apiProduto.atualizar(token, produtoEmEdicao.id, dto);
      } else {
        await apiProduto.criar(token, dto);
      }
      setModalAberto(false);
      await carregarDados(token);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!token || !produtoParaExcluir) return;
    setExcluindo(true);
    try {
      await apiProduto.excluir(token, produtoParaExcluir.id);
      setProdutoParaExcluir(null);
      await carregarDados(token);
    } finally {
      setExcluindo(false);
    }
  }

  if (carregandoAutenticacao || !token) {
    return (
      <main className="flex flex-1 items-center justify-center bg-primary-light/40">
        <IconeEscudo className="h-8 w-8 animate-pulse text-primary" />
      </main>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <BarraNavegacao />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text">Meus produtos</h1>
            <p className="text-sm text-text-muted">
              {produtos.length} {produtos.length === 1 ? "produto cadastrado" : "produtos cadastrados"}
            </p>
          </div>
          <Botao onClick={abrirModalCriar}>
            <IconeMais />
            Novo produto
          </Botao>
        </div>

        {carregando && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        )}

        {!carregando && erro && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white py-16 text-center">
            <p className="text-sm text-text-muted">{erro}</p>
            <Botao variante="secundario" onClick={() => carregarDados(token)}>
              Tentar novamente
            </Botao>
          </div>
        )}

        {!carregando && !erro && produtos.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-white py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
              <IconeCaixa />
            </span>
            <p className="font-medium text-text">Nenhum produto cadastrado ainda</p>
            <p className="max-w-xs text-sm text-text-muted">
              Adicione seu primeiro produto para começar a acompanhar as garantias.
            </p>
            <Botao onClick={abrirModalCriar} className="mt-2">
              <IconeMais />
              Novo produto
            </Botao>
          </div>
        )}

        {!carregando && !erro && produtos.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto) => (
              <CartaoProduto
                key={produto.id}
                produto={produto}
                onEditar={() => abrirModalEditar(produto)}
                onExcluir={() => setProdutoParaExcluir(produto)}
              />
            ))}
          </div>
        )}
      </main>

      {modalAberto && (
        <ModalProduto
          categorias={categorias}
          produtoEmEdicao={produtoEmEdicao}
          salvando={salvando}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarProduto}
        />
      )}

      {produtoParaExcluir && (
        <DialogoConfirmacao
          titulo="Excluir produto"
          descricao={`Tem certeza que deseja excluir "${produtoParaExcluir.nome}"? Essa ação não pode ser desfeita.`}
          rotuloConfirmar="Excluir"
          carregando={excluindo}
          onConfirmar={confirmarExclusao}
          onCancelar={() => setProdutoParaExcluir(null)}
        />
      )}
    </div>
  );
}
