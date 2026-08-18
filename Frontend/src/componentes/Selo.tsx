type Variante = "primario" | "neutro";

const CLASSES_VARIANTE: Record<Variante, string> = {
  primario: "bg-primary-light text-primary",
  neutro: "bg-slate-100 text-text-muted",
};

export function Selo({
  children,
  variante = "primario",
}: {
  children: React.ReactNode;
  variante?: Variante;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${CLASSES_VARIANTE[variante]}`}
    >
      {children}
    </span>
  );
}
