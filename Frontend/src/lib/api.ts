import type { Categoria, Produto, DadosProduto } from "@/types";

const URL_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export class ErroApi extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function requisitar<T>(
  caminho: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...resto } = options;

  const response = await fetch(`${URL_API}${caminho}`, {
    ...resto,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const corpoBruto = await response.text();
    let mensagem = corpoBruto;
    try {
      const parsed = JSON.parse(corpoBruto);
      mensagem = parsed?.message ?? parsed?.title ?? corpoBruto;
    } catch {
      // corpo nao era JSON, usa o texto puro mesmo
    }
    throw new ErroApi(response.status, mensagem || "Ocorreu um erro inesperado.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const texto = await response.text();
  if (!texto) return undefined as T;

  try {
    return JSON.parse(texto) as T;
  } catch {
    // resposta de sucesso em texto puro (ex: AuthController retorna Ok("mensagem"))
    return texto as T;
  }
}

export const apiAutenticacao = {
  login: (nome: string, senha: string) =>
    requisitar<{ token: string }>("/Auth/login", {
      method: "POST",
      body: JSON.stringify({ nome, senha }),
    }),

  registrar: (nome: string, senha: string) =>
    requisitar<string>("/Auth/registrar", {
      method: "POST",
      body: JSON.stringify({ nome, senha }),
    }),
};

export const apiCategoria = {
  listar: (token: string) => requisitar<Categoria[]>("/Categoria", { token }),
};

export const apiProduto = {
  listar: (token: string) => requisitar<Produto[]>("/Produto", { token }),

  criar: (token: string, dto: DadosProduto) =>
    requisitar<void>("/Produto", {
      method: "POST",
      token,
      body: JSON.stringify(dto),
    }),

  atualizar: (token: string, id: number, dto: DadosProduto) =>
    requisitar<void>(`/Produto/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(dto),
    }),

  excluir: (token: string, id: number) =>
    requisitar<void>(`/Produto/${id}`, {
      method: "DELETE",
      token,
    }),
};
