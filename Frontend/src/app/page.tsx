"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAutenticacao } from "@/lib/contexto-autenticacao";
import { IconeEscudo } from "@/componentes/icones";

export default function Home() {
  const { token, isLoading } = useAutenticacao();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(token ? "/produtos" : "/login");
  }, [isLoading, token, router]);

  return (
    <main className="flex flex-1 items-center justify-center bg-primary-light/40">
      <IconeEscudo className="h-8 w-8 animate-pulse text-primary" />
    </main>
  );
}
