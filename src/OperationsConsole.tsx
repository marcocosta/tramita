import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  Layers3,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { tramitaMockData } from "./data/tramitaMockData";
import type { OperationsDossierRequest } from "./types/tramita";

const requests = tramitaMockData.operationsDossierRequests;

const statusLabels: Record<OperationsDossierRequest["status"], string> = {
  new: "Novo",
  in_progress: "Em coleta",
  waiting_provider: "Aguardando provedor",
  validating: "Em validação",
  ready_to_deliver: "Pronto para entrega",
  delivered: "Entregue",
  blocked: "Bloqueado",
};

const statusClasses: Record<OperationsDossierRequest["status"], string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700",
  in_progress: "border-amber-200 bg-amber-50 text-amber-700",
  waiting_provider: "border-slate-200 bg-slate-50 text-slate-700",
  validating: "border-indigo-200 bg-indigo-50 text-indigo-700",
  ready_to_deliver: "border-emerald-200 bg-emerald-50 text-emerald-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  blocked: "border-red-200 bg-red-50 text-red-700",
};

const priorityLabels: Record<OperationsDossierRequest["priority"], string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const priorityClasses: Record<OperationsDossierRequest["priority"], string> = {
  low: "border-slate-200 bg-slate-50 text-slate-600",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-red-200 bg-red-50 text-red-700",
};

const revenueLabels: Record<OperationsDossierRequest["revenueModel"], string> =
  {
    pay_per_use: "Pay-per-use",
    b2b_credit: "Crédito B2B",
    enterprise: "Enterprise",
  };

function ShellCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[30px] border border-slate-200/80 bg-white/92 shadow-[0_12px_36px_rgba(15,23,42,0.07)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {eyebrow ? (
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {eyebrow}
        </div>
      ) : null}
      <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
        {title}
      </div>
      {description ? (
        <div className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </div>
      ) : null}
    </div>
  );
}

function StatusPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex h-auto max-w-full rounded-full border px-3 py-1 text-xs font-medium leading-tight ${className}`}
    >
      {children}
    </span>
  );
}

export default function OperationsConsole() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.07),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <ShellCard className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(180,83,9,0.06),transparent_23%),radial-gradient(circle_at_90%_10%,rgba(15,23,42,0.06),transparent_25%)]" />
          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <StatusPill className="border-slate-200 bg-white text-slate-700">
                  Operações
                </StatusPill>
                <StatusPill className="border-blue-200 bg-blue-50 text-blue-700">
                  Fila interna
                </StatusPill>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Operações de dossiê
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                Fila interna de dossiês, fontes e validações.
              </p>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white/88 p-5 shadow-sm">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Insight operacional
                  </div>
                  <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                    Tramita pode operar com parceiros e uploads agora.
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Integrações diretas com fontes oficiais podem evoluir por
                    cidade, enquanto a fila mantém dono, prazo e evidência.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["Dossiês abertos", "12"],
              ["Em validação", "4"],
              ["Prontos para entrega", "3"],
              ["SLA em risco", "2"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-slate-200 bg-white/82 p-4 shadow-sm"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {label}
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-6">
            <ShellCard className="p-5 md:p-6">
              <SectionTitle
                eyebrow="Fila"
                title="Fila de solicitações"
                description="Dossiês sob demanda organizados por status, responsável, SLA e modelo comercial."
              />

              <div className="mt-5 space-y-3.5">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-[26px] border border-slate-200 bg-white p-4"
                  >
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_230px_150px] xl:items-center">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          {request.id}
                        </div>
                        <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                          {request.propertyName}
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-slate-500">
                          {request.requestType} · {request.city} · Solicitado
                          por {request.requestedBy}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <StatusPill className={statusClasses[request.status]}>
                            {statusLabels[request.status]}
                          </StatusPill>
                          <StatusPill
                            className={priorityClasses[request.priority]}
                          >
                            Prioridade: {priorityLabels[request.priority]}
                          </StatusPill>
                          <StatusPill className="border-slate-200 bg-slate-50 text-slate-600">
                            {revenueLabels[request.revenueModel]}
                          </StatusPill>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                        <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                              Responsável
                            </div>
                            <div className="mt-1 text-sm font-medium text-slate-900">
                              {request.assignedTo}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                              ETA
                            </div>
                            <div className="mt-1 text-sm font-medium text-slate-900">
                              {request.eta}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-slate-500">Progresso</span>
                            <span className="font-semibold text-slate-900">
                              {request.progress}%
                            </span>
                          </div>
                          <Progress value={request.progress} className="h-2" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button className="h-11 rounded-2xl bg-slate-950 text-white hover:bg-slate-900">
                          Abrir fila
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="h-11 rounded-2xl border-slate-200 bg-white"
                        >
                          Marcar etapa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>
          </main>

          <aside className="space-y-6 lg:sticky lg:top-8">
            <ShellCard className="p-6">
              <SectionTitle
                title="Modelo operacional"
                description="Como a entrega funciona antes da automação completa."
              />
              <div className="mt-5 space-y-3">
                {[
                  {
                    icon: Clock3,
                    title: "Manual agora",
                    text: "Operação interna cria e acompanha solicitações por fonte.",
                  },
                  {
                    icon: Layers3,
                    title: "Parceiros quando disponível",
                    text: "Fontes parceiras aceleram coleta e comparáveis.",
                  },
                  {
                    icon: Database,
                    title: "APIs futuras",
                    text: "Integrações substituem etapas manuais por automação.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Validação antes da entrega",
                    text: "Dados são checados antes de alimentar o memorando.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-950">
                          {item.title}
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-slate-500">
                          {item.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                title="Estados da operação"
                description="Vocabulário operacional para acompanhar cada dossiê."
              />
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Novo",
                  "Em coleta",
                  "Aguardando provedor",
                  "Em validação",
                  "Pronto para entrega",
                  "Entregue",
                  "Bloqueado",
                ].map((state) => (
                  <span
                    key={state}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {state}
                  </span>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-950">
                    Por que isso importa
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Cada dossiê sob demanda vira uma fila rastreável com fonte,
                    responsável, prazo, impacto na confiança e evidência
                    entregue.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                A operação já pode funcionar com parceiros, uploads e revisão
                interna.
              </div>
            </ShellCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
