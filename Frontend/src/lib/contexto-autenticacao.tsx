"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiAutenticacao } from "@/lib/api";

const CHAVE_TOKEN_STORAGE = "garantias_token";
const CLAIM_NOME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

interface ValorContextoAutenticacao {
  token: string | null;
  nome: string | null;
  isLoading: boolean;
  login: (nome: string, senha: string) => Promise<void>;
  registrar: (nome: string, senha: string) => Promise<void>;
  logout: () => void;
}

const ContextoAutenticacao = createContext<ValorContextoAutenticacao | undefined>(undefined);

function extrairNomeDoToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json[CLAIM_NOME] ?? null;
  } catch {
    return null;
  }
}

export function ProvedorAutenticacao({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sincroniza o estado do React com o localStorage (sistema externo) uma vez,
    // apos a hidratacao — nao da pra ler isso durante o render sem quebrar o SSR.
    /* eslint-disable react-hooks/set-state-in-effect */
    const armazenado = localStorage.getItem(CHAVE_TOKEN_STORAGE);
    if (armazenado) {
      setToken(armazenado);
      setNome(extrairNomeDoToken(armazenado));
    }
    setIsLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const login = useCallback(async (nomeInformado: string, senha: string) => {
    const { token: novoToken } = await apiAutenticacao.login(nomeInformado, senha);
    localStorage.setItem(CHAVE_TOKEN_STORAGE, novoToken);
    setToken(novoToken);
    setNome(extrairNomeDoToken(novoToken));
  }, []);

  const registrar = useCallback(async (nomeInformado: string, senha: string) => {
    await apiAutenticacao.registrar(nomeInformado, senha);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CHAVE_TOKEN_STORAGE);
    setToken(null);
    setNome(null);
  }, []);

  const value = useMemo(
    () => ({ token, nome, isLoading, login, registrar, logout }),
    [token, nome, isLoading, login, registrar, logout]
  );

  return <ContextoAutenticacao.Provider value={value}>{children}</ContextoAutenticacao.Provider>;
}

export function useAutenticacao() {
  const context = useContext(ContextoAutenticacao);
  if (!context) {
    throw new Error("useAutenticacao precisa ser usado dentro de um ProvedorAutenticacao");
  }
  return context;
}
