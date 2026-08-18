// Utilitarios de data. As datas da API vem como "yyyy-MM-dd" (DateOnly do backend).
// Evitamos `new Date("yyyy-MM-dd")` porque o JS interpreta isso como UTC e pode
// exibir o dia errado dependendo do fuso do navegador.

function converterParaData(valor: string): Date {
  const [ano, mes, dia] = valor.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

export function formatarDataBr(valor: string): string {
  const [ano, mes, dia] = valor.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function diasRestantes(dataVencimento: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const vencimento = converterParaData(dataVencimento);
  vencimento.setHours(0, 0, 0, 0);

  const diffMs = vencimento.getTime() - hoje.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function descricaoStatus(dataVencimento: string): string {
  const dias = diasRestantes(dataVencimento);

  if (dias < 0) {
    const diasAtras = Math.abs(dias);
    return `Expirou há ${diasAtras} ${diasAtras === 1 ? "dia" : "dias"}`;
  }

  if (dias === 0) {
    return "Expira hoje";
  }

  return `Vence em ${dias} ${dias === 1 ? "dia" : "dias"}`;
}
