import type { Produto } from "@/types";
import { formatarDataBr, descricaoStatus } from "@/lib/data";
import { Selo } from "@/componentes/Selo";
import { Botao } from "@/componentes/Botao";
import { IconeLapis, IconeLixeira } from "@/componentes/icones";

interface CartaoProdutoProps {
  produto: Produto;
  onEditar: () => void;
  onExcluir: () => void;
}

export function CartaoProduto({ produto, onEditar, onExcluir }: CartaoProdutoProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-text">{produto.nome}</h3>
          <Selo variante="neutro">{produto.categoriaNome}</Selo>
        </div>
        <Selo variante={produto.garantiaValida ? "primario" : "neutro"}>
          {produto.garantiaValida ? "Válida" : "Expirada"}
        </Selo>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-text-muted">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted/70">Compra</p>
          <p className="text-text">{formatarDataBr(produto.dataCompra)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted/70">Vencimento</p>
          <p className="text-text">{formatarDataBr(produto.dataVencimento)}</p>
        </div>
      </div>

      <p className="text-sm font-medium text-primary">{descricaoStatus(produto.dataVencimento)}</p>

      <div className="mt-1 flex justify-end gap-2 border-t border-border pt-3">
        <Botao variante="fantasma" onClick={onEditar}>
          <IconeLapis />
          Editar
        </Botao>
        <Botao variante="fantasma" onClick={onExcluir} className="text-red-600 hover:bg-red-50">
          <IconeLixeira />
          Excluir
        </Botao>
      </div>
    </div>
  );
}
