"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAutenticacao } from "@/lib/contexto-autenticacao";
import { ErroApi } from "@/lib/api";
import { Campo } from "@/componentes/Campo";
import { Botao } from "@/componentes/Botao";
import { IconeEscudo } from "@/componentes/icones";

export default function RegistrarPage() {
  const { registrar, login } = useAutenticacao();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);

    if (!nome.trim() || !senha) {
      setErro("Preencha usuário e senha.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      await registrar(nome.trim(), senha);
      await login(nome.trim(), senha);
      router.push("/produtos");
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Não foi possível criar sua conta. Tente novamente.");
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
          <h1 className="text-xl font-semibold text-text">Criar conta</h1>
          <p className="text-sm text-text-muted">Comece a controlar suas garantias.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Campo
            rotulo="Usuário"
            autoComplete="username"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="escolha um usuário"
          />
          <Campo
            rotulo="Senha"
            type="password"
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="mínimo 6 caracteres"
          />
          <Campo
            rotulo="Confirmar senha"
            type="password"
            autoComplete="new-password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="repita a senha"
          />

          {erro && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erro}</p>
          )}

          <Botao type="submit" carregando={carregando} className="mt-2 w-full">
            Criar conta
          </Botao>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
