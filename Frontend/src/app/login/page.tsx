"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAutenticacao } from "@/lib/contexto-autenticacao";
import { ErroApi } from "@/lib/api";
import { Campo } from "@/componentes/Campo";
import { Botao } from "@/componentes/Botao";
import { IconeEscudo } from "@/componentes/icones";

export default function LoginPage() {
  const { login } = useAutenticacao();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);

    if (!nome.trim() || !senha) {
      setErro("Preencha usuário e senha.");
      return;
    }

    setCarregando(true);
    try {
      await login(nome.trim(), senha);
      router.push("/produtos");
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-primary-light/40 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
            <IconeEscudo />
          </span>
          <h1 className="text-xl font-semibold text-text">Entrar</h1>
          <p className="text-sm text-text-muted">Acesse suas garantias com segurança.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Campo
            rotulo="Usuário"
            autoComplete="username"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="seu usuário"
          />
          <Campo
            rotulo="Senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
          />

          {erro && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erro}</p>
          )}

          <Botao type="submit" carregando={carregando} className="mt-2 w-full">
            Entrar
          </Botao>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Não tem conta?{" "}
          <Link href="/registrar" className="font-medium text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
