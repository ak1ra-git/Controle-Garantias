import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variante = "primario" | "secundario" | "perigo" | "fantasma";

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  carregando?: boolean;
}

const CLASSES_VARIANTE: Record<Variante, string> = {
  primario:
    "bg-primary text-white hover:bg-primary-hover disabled:hover:bg-primary",
  secundario:
    "bg-white text-primary border border-primary/30 hover:bg-primary-light",
  perigo:
    "bg-white text-red-600 border border-red-200 hover:bg-red-50",
  fantasma: "bg-transparent text-text-muted hover:bg-slate-100",
};

export const Botao = forwardRef<HTMLButtonElement, BotaoProps>(
  ({ variante = "primario", carregando, disabled, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || carregando}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${CLASSES_VARIANTE[variante]} ${className}`}
        {...props}
      >
        {carregando && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Botao.displayName = "Botao";
