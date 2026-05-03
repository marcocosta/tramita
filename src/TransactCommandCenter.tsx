import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  Landmark,
  MapPin,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const stages = [
  {
    title: "Oferta aceita",
    owner: "Comprador + corretor",
    status: "Concluído",
    tone: "green" as const,
    date: "11 Abr",
    evidence: "Proposta anexada",
  },
  {
    title: "Documentação inicial",
    owner: "Vendedor",
    status: "Concluído",
    tone: "green" as const,
    date: "12 Abr",
    evidence: "Matrícula, IPTU e certidões",
  },
  {
    title: "Análise jurídica",
    owner: "Jurídico",
    status: "Concluído com ressalvas",
    tone: "blue" as const,
    date: "13 Abr",
    evidence: "Parecer preliminar emitido",
  },
  {
    title: "Financiamento",
    owner: "Comprador + banco",
    status: "Em andamento",
    tone: "amber" as const,
    date: "Hoje",
    evidence: "Aguardando comprovante complementar",
  },
  {
    title: "Assinatura",
    owner: "Partes",
    status: "Pendente",
    tone: "slate" as const,
    date: "-",
    evidence: "Ainda não iniciada",
  },
  {
    title: "Registro / fechamento",
    owner: "Cartório",
    status: "Pendente",
    tone: "slate" as const,
    date: "-",
    evidence: "Depende das etapas anteriores",
  },
];

const blockers = [
  {
    title: "Comprovante de renda complementar",
    text: "Sem esse envio, o banco não conclui a aprovação final do financiamento.",
    owner: "Comprador",
    state: "Pendente hoje",
    urgency: "Alta",
    tone: "red" as const,
    action: "Resolver agora",
  },
  {
    title: "Aprovação final do banco",
    text: "Permanece em análise até o comprador anexar o comprovante complementar.",
    owner: "Banco",
    state: "Em análise",
    urgency: "Média",
    tone: "amber" as const,
    action: "Acompanhar banco",
  },
];

const parties = [
  {
    role: "Comprador",
    name: "Alpha Invest",
    status: "1 pendência crítica",
    tone: "red" as const,
    items: ["Enviar comprovante complementar", "Revisar minuta final"],
  },
  {
    role: "Vendedor",
    name: "Carlos Almeida",
    status: "Sem pendências",
    tone: "green" as const,
    items: ["Documentação inicial concluída", "Disponível para assinatura"],
  },
  {
    role: "Jurídico",
    name: "Tramita Legal",
    status: "Atenção",
    tone: "amber" as const,
    items: ["Parecer preliminar entregue", "Minuta em revisão final"],
  },
  {
    role: "Banco",
    name: "Banco Parceiro",
    status: "Aguardando comprador",
    tone: "amber" as const,
    items: ["Análise final em curso", "Depende de comprovante complementar"],
  },
  {
    role: "Corretor",
    name: "Marina Costa",
    status: "Acompanhando",
    tone: "blue" as const,
    items: ["Coordena comunicação", "Suporte às partes"],
  },
  {
    role: "Cartório",
    name: "2º Registro",
    status: "Não iniciado",
    tone: "slate" as const,
    items: ["Aguardando assinatura", "Registro após fechamento"],
  },
];

const docs = [
  {
    name: "Matrícula atualizada",
    group: "Imóvel",
    owner: "Vendedor",
    status: "Validado",
    tone: "green" as const,
  },
  {
    name: "Certidões negativas",
    group: "Vendedor",
    owner: "Jurídico",
    status: "Validado",
    tone: "green" as const,
  },
  {
    name: "Laudo de avaliação",
    group: "Banco",
    owner: "Banco",
    status: "Em revisão",
    tone: "blue" as const,
  },
  {
    name: "Comprovante de renda complementar",
    group: "Comprador",
    owner: "Comprador",
    status: "Pendente",
    tone: "red" as const,
  },
  {
    name: "Minuta do contrato",
    group: "Transação",
    owner: "Jurídico",
    status: "Em revisão",
    tone: "amber" as const,
  },
  {
    name: "Comprovante do sinal",
    group: "Transação",
    owner: "Comprador",
    status: "Não recebido",
    tone: "slate" as const,
  },
];

const activity = [
  {
    date: "Hoje · 11:37",
    title: "Banco solicitou comprovante complementar",
    text: "Impacto: financiamento permanece em análise até novo envio.",
  },
  {
    date: "Hoje · 10:02",
    title: "Minuta atualizada enviada ao comprador",
    text: "Jurídico publicou nova versão para revisão final.",
  },
  {
    date: "Ontem · 16:15",
    title: "Parecer jurídico preliminar concluído",
    text: "Sem impedimento crítico, com ressalvas de rotina.",
  },
  {
    date: "12 Abr · 09:18",
    title: "Matrícula e IPTU anexados",
    text: "Documentação inicial recebida e validada.",
  },
];

function ShellCard({
  children,
  className = "",
}: {
  children: ReactNode;
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

function ToneBadge({
  tone,
  children,
}: {
  tone: "green" | "amber" | "red" | "slate" | "blue";
  children: ReactNode;
}) {
  const map = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <Badge className={`rounded-full border px-3 py-1 ${map[tone]}`}>
      {children}
    </Badge>
  );
}

function ScoreRow({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

export default function TransactCommandCenter() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.07),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <ShellCard className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(180,83,9,0.06),transparent_23%),radial-gradient(circle_at_90%_10%,rgba(15,23,42,0.06),transparent_25%)]" />
          <div className="relative">
            <div className="flex flex-wrap gap-2">
              <ToneBadge tone="blue">Em diligência</ToneBadge>
              <ToneBadge tone="amber">Financiamento pendente</ToneBadge>
              <ToneBadge tone="amber">Risco moderado</ToneBadge>
              <ToneBadge tone="red">Fechamento não pronto</ToneBadge>
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Compra de terreno
              <br />
              em Meireles
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
              TR-2041 · Fortaleza, CE · Comprador: Alpha Invest · Vendedor:
              Carlos Almeida
            </p>

            <div className="mt-6 rounded-[26px] border border-amber-200/70 bg-white/88 p-4 shadow-sm backdrop-blur md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700/80">Command insight</div>
                  <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                    Transação avançando, mas bloqueada por pendência financeira do comprador.
                  </div>
                  <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
                    A documentação inicial e a análise jurídica estão bem encaminhadas. O financiamento ainda depende do comprovante complementar para avançar.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["Etapa", "Financiamento"],
                ["Ação", "Comprovante de renda"],
                ["Dono", "Comprador"],
                ["Prontidão", "68%"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-slate-200 bg-white/82 p-4 shadow-sm"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {label}
                  </div>
                  <div className="mt-2 text-base font-semibold tracking-tight text-slate-950 md:text-lg">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ShellCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-6">
            <ShellCard className="p-5">
              <SectionTitle
                eyebrow="Blockers"
                title="O que está travando agora"
                description="Fricções explícitas, com dono e próxima ação."
              />

              <div className="mt-5 grid grid-cols-1 gap-3.5">
                {blockers.map((item) => (
                  <div
                    key={item.title}
                    className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-center"
                  >
                    <div className="flex min-w-0 gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                          item.tone === "red"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold text-slate-950">
                            {item.title}
                          </div>
                          <ToneBadge tone={item.tone}>{item.urgency}</ToneBadge>
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-slate-500">
                          {item.text}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 md:grid-cols-1 md:gap-2">
                      <div>
                        <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                          Dono
                        </div>
                        <div className="mt-1 font-medium text-slate-900">
                          {item.owner}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                          Status
                        </div>
                        <div className="mt-1 font-medium text-slate-900">
                          {item.state}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-slate-200 bg-white md:w-auto md:min-w-[150px] md:justify-self-end"
                    >
                      {item.action}
                    </Button>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-5">
              <SectionTitle
                eyebrow="Progress rail"
                title="Fluxo determinístico da transação"
                description="Cada etapa com estado, responsável e evidência."
              />

              <div className="mt-5 space-y-2.5">
                {stages.map((stage, index) => (
                  <div
                    key={stage.title}
                    className="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex gap-2.5">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              stage.tone === "green"
                                ? "bg-emerald-50 text-emerald-600"
                                : stage.tone === "amber"
                                  ? "bg-amber-50 text-amber-600"
                                  : stage.tone === "blue"
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {stage.tone === "green" ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : stage.tone === "amber" ? (
                              <Clock3 className="h-5 w-5" />
                            ) : stage.tone === "blue" ? (
                              <ShieldCheck className="h-5 w-5" />
                            ) : (
                              <div className="h-2.5 w-2.5 rounded-full bg-current" />
                            )}
                          </div>
                          {index < stages.length - 1 ? (
                            <div className="mt-1 h-4 w-px bg-slate-200" />
                          ) : null}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-semibold text-slate-950">
                              {stage.title}
                            </div>
                            <ToneBadge tone={stage.tone}>
                              {stage.status}
                            </ToneBadge>
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {stage.owner}
                          </div>
                          <div className="mt-1.5 text-sm text-slate-600">
                            {stage.evidence}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-1.5 text-sm text-slate-600">
                        {stage.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-5">
              <SectionTitle
                eyebrow="Responsibilities"
                title="Matriz de responsabilidades"
                description="Quem deve agir agora, e com qual status."
              />

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {parties.map((party) => (
                  <div
                    key={party.role}
                    className="rounded-[26px] border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-slate-500">
                          {party.role}
                        </div>
                        <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                          {party.name}
                        </div>
                      </div>
                      <ToneBadge tone={party.tone}>{party.status}</ToneBadge>
                    </div>

                    <div className="mt-4 space-y-2">
                      {party.items.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-5">
              <SectionTitle
                eyebrow="Documents"
                title="Prontidão documental"
                description="Evidências por grupo, dono e status."
              />

              <div className="mt-5 space-y-3">
                {docs.map((doc) => (
                  <div
                    key={doc.name}
                    className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr_140px_96px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
                        <FileText className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-950">
                          {doc.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {doc.group}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-slate-600">
                      {doc.owner}
                    </div>

                    <div className="flex items-center text-sm text-slate-500">
                      Última atualização: hoje
                    </div>

                    <div className="flex items-center">
                      <ToneBadge tone={doc.tone}>{doc.status}</ToneBadge>
                    </div>

                    <div className="flex items-center">
                      <Button variant="ghost" className="rounded-xl px-3">
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-5">
              <SectionTitle
                eyebrow="Timeline"
                title="Registro auditável"
                description="Tudo que aconteceu, quando e com qual impacto."
              />

              <div className="mt-5 space-y-4">
                {activity.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-3.5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
                      <CalendarClock className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                        {item.date}
                      </div>
                      <div className="mt-1 font-semibold text-slate-950">
                        {item.title}
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-500">
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>
          </main>

          <aside className="space-y-6 lg:sticky lg:top-8">
            <ShellCard className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Tramita transaction scorecard
                  </div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    Transação avançando
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                O negócio está bem encaminhado, mas ainda não pronto para
                fechamento. O principal ponto é a dependência do documento
                complementar para o banco.
              </p>

              <div className="mt-6 space-y-5">
                <ScoreRow
                  label="Prontidão para fechamento"
                  value="68%"
                  progress={68}
                />
                <ScoreRow label="Documentos" value="82%" progress={82} />
                <ScoreRow label="Jurídico" value="88%" progress={88} />
                <ScoreRow label="Financeiro" value="51%" progress={51} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-amber-600">
                    Risco
                  </div>
                  <div className="mt-1 font-semibold text-amber-950">
                    Médio
                  </div>
                </div>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-red-600">
                    Blockers críticos
                  </div>
                  <div className="mt-1 font-semibold text-red-950">1</div>
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                title="Próxima ação recomendada"
                description="Mover o financiamento para frente com a menor fricção."
              />

              <div className="mt-5 rounded-[26px] border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-950">
                      Solicitar comprovante complementar
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-slate-500">
                      Sem esse envio, o banco não conclui a aprovação final.
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <Button className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-900">
                    Resolver próxima pendência
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-2xl border-slate-200 bg-white"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Solicitar documento
                  </Button>
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                title="Resumo operacional"
                description="Leitura rápida do status atual."
              />

              <div className="mt-5 space-y-3">
                {[
                  {
                    icon: MapPin,
                    label: "Imóvel",
                    value: "Terreno em Meireles",
                  },
                  {
                    icon: Users,
                    label: "Partes",
                    value: "6 envolvidas",
                  },
                  {
                    icon: FileCheck2,
                    label: "Documentos validados",
                    value: "4",
                  },
                  {
                    icon: Landmark,
                    label: "Banco",
                    value: "Análise em curso",
                  },
                  {
                    icon: Building2,
                    label: "Cartório",
                    value: "Aguardando assinatura",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
                        <Icon className="h-5 w-5 text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                          {item.label}
                        </div>
                        <div className="truncate text-sm font-medium text-slate-900">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ShellCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
