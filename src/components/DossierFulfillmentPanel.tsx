import type { DossierRequestItem } from "../types/tramita";

type DossierFulfillmentPanelProps = {
  items: DossierRequestItem[];
  compact?: boolean;
};

const statusLabels: Record<DossierRequestItem["status"], string> = {
  requested: "Solicitado",
  collecting: "Em coleta",
  validating: "Em validação",
  delivered: "Entregue",
  blocked: "Bloqueado",
};

const statusClasses: Record<DossierRequestItem["status"], string> = {
  requested: "border-blue-200 bg-blue-50 text-blue-700",
  collecting: "border-amber-200 bg-amber-50 text-amber-700",
  validating: "border-slate-200 bg-slate-50 text-slate-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  blocked: "border-red-200 bg-red-50 text-red-700",
};

const confidenceLabels: Record<DossierRequestItem["confidenceImpact"], string> =
  {
    low: "Baixo",
    medium: "Médio",
    high: "Alto",
  };

const confidenceClasses: Record<
  DossierRequestItem["confidenceImpact"],
  string
> = {
  low: "border-slate-200 bg-slate-50 text-slate-600",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export { statusLabels, confidenceLabels };

export default function DossierFulfillmentPanel({
  items,
  compact = false,
}: DossierFulfillmentPanelProps) {
  return (
    <div
      className={`rounded-[30px] border border-slate-200/80 bg-white/92 shadow-[0_12px_36px_rgba(15,23,42,0.07)] backdrop-blur ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Dossiê sob demanda
        </div>
        <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Pipeline do dossiê
        </div>
        <div className="mt-1 text-sm leading-relaxed text-slate-500">
          Dados solicitados viram etapas rastreáveis com fonte, prazo e impacto
          na confiança.
        </div>
      </div>

      <div className={compact ? "mt-4 space-y-3" : "mt-5 space-y-3"}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border border-slate-200 bg-slate-50/70 ${
              compact ? "p-3.5" : "p-4"
            }`}
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div className="min-w-0">
                <div className="font-semibold leading-snug text-slate-950">
                  {item.label}
                </div>
                <div className="mt-1 text-sm leading-relaxed text-slate-500">
                  {item.providerLabel}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses[item.status]}`}
                >
                  {statusLabels[item.status]}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${confidenceClasses[item.confidenceImpact]}`}
                >
                  Impacto: {confidenceLabels[item.confidenceImpact]}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[150px_minmax(0,1fr)]">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Prazo
                </div>
                <div className="mt-1 font-medium text-slate-800">
                  {item.eta}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.unlocks.map((unlock) => (
                  <span
                    key={unlock}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {unlock}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
