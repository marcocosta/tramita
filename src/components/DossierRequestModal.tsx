import { CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { tramitaMockData } from "../data/tramitaMockData";

type DossierRequestModalProps = {
  open: boolean;
  onClose: () => void;
  propertyName?: string;
  onConfirm?: () => void;
};

export default function DossierRequestModal({
  open,
  onClose,
  propertyName,
  onConfirm,
}: DossierRequestModalProps) {
  if (!open) {
    return null;
  }

  const requestPackage = tramitaMockData.dossierRequestPackage;
  const packageTitle =
    propertyName ?? `${requestPackage.propertyName} · ${requestPackage.propertyLocation}`;

  function handleConfirm() {
    if (onConfirm) {
      onConfirm();
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.22)] md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Dossiê sob demanda
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Solicitar dossiê do imóvel
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Complete a prévia gratuita com dados verificados, documentos e
              validações específicas do ativo.
            </p>
          </div>
          <button
            aria-label="Fechar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
          <div className="text-sm font-semibold text-slate-950">
            {packageTitle}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {requestPackage.name}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="font-semibold text-slate-950">
              O que será buscado
            </div>
            <div className="mt-3 space-y-2">
              {requestPackage.items.map((item) => (
                <div key={item} className="flex gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <div className="font-semibold text-slate-950">
                Fontes prováveis
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {requestPackage.sources.map((source) => (
                  <span
                    key={source}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <div className="font-semibold text-slate-950">
                Entrega estimada
              </div>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div>
                  <span className="font-medium text-slate-900">
                    Prazo estimado:
                  </span>{" "}
                  {requestPackage.estimatedDelivery}
                </div>
                <div>
                  <span className="font-medium text-slate-900">Formato:</span>{" "}
                  {requestPackage.format}
                </div>
                <div>
                  <span className="font-medium text-slate-900">
                    Status inicial:
                  </span>{" "}
                  {requestPackage.initialStatus}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
          <div className="font-semibold text-slate-950">O que desbloqueia</div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {requestPackage.unlocks.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4">
          <div className="font-semibold text-slate-950">Modelo comercial</div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {requestPackage.commercialOptions.map((option) => (
              <div
                key={option.label}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="text-sm font-semibold text-slate-950">
                  {option.label}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {option.description}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs leading-relaxed text-slate-500">
            {requestPackage.note}
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="h-11 rounded-2xl border-slate-200 bg-white px-5"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-900"
            onClick={handleConfirm}
          >
            Confirmar solicitação
          </Button>
        </div>
      </div>
    </div>
  );
}
