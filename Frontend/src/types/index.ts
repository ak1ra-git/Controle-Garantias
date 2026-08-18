export interface Categoria {
  id: number;
  nome: string;
}

export interface Produto {
  id: number;
  nome: string;
  categoriaNome: string;
  dataCompra: string; // yyyy-MM-dd
  dataVencimento: string; // yyyy-MM-dd
  garantiaValida: boolean;
}

export interface DadosProduto {
  nome: string;
  codCategoria: number;
  dataCompra: string; // yyyy-MM-dd
  dataVencimento: string; // yyyy-MM-dd
}
