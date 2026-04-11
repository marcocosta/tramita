import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  FileText,
  Home,
  ShieldCheck,
  Users,
  Building2,
  Landmark,
  Bell,
  Search,
  CalendarDays,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

const steps = [
  { id: 1, title: "Oferta aceita", owner: "Comprador + Corretor", done: true, date: "11 Abr" },
  { id: 2, title: "Documentos do imóvel", owner: "Vendedor", done: true, date: "12 Abr" },
  { id: 3, title: "Análise jurídica", owner: "Jurídico", done: true, date: "13 Abr" },
  { id: 4, title: "Financiamento", owner: "Banco", done: false, date: "Em andamento" },
  { id: 5, title: "Assinatura", owner: "Partes", done: false, date: "Pendente" },
  { id: 6, title: "Registro e fechamento", owner: "Cartório", done: false, date: "Pendente" },
];

const documents = [
  { name: "Matrícula atualizada", status: "Validado", party: "Imóvel" },
  { name: "Certidão negativa", status: "Validado", party: "Vendedor" },
  { name: "Laudo de avaliação", status: "Em revisão", party: "Banco" },
  { name: "Minuta do contrato", status: "Aguardando assinatura", party: "Jurídico" },
];

const activities = [
  { time: "09:14", text: "Banco confirmou recebimento do dossiê financeiro.", type: "info" },
  { time: "10:02", text: "Nova versão da minuta enviada para revisão jurídica.", type: "info" },
  { time: "11:37", text: "Pendência: comprovante de renda complementar do comprador.", type: "alert" },
  { time: "13:20", text: "Matrícula do imóvel validada sem restrições.", type: "success" },
];

const pipelineDeals = [
  { id: "TR-2041", property: "Apto. Jardins", city: "São Paulo", stage: "Financiamento", progress: 68, risk: "Médio" },
  { id: "TR-2038", property: "Casa Alphaville", city: "Barueri", stage: "Análise jurídica", progress: 51, risk: "Baixo" },
  { id: "TR-2033", property: "Studio Pinheiros", city: "São Paulo", stage: "Assinatura", progress: 84, risk: "Baixo" },
  { id: "TR-2027", property: "Cobertura Meireles", city: "Fortaleza", stage: "Documentos", progress: 36, risk: "Alto" },
];

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "Validado"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "Em revisão"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return <Badge className={`rounded-full border px-3 py-1 ${style}`}>{status}</Badge>;
}

function RiskBadge({ risk }: { risk: string }) {
  const style =
    risk === "Alto"
      ? "border-red-200 bg-red-50 text-red-700"
      : risk === "Médio"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return <Badge className={`rounded-full border px-3 py-1 ${style}`}>{risk}</Badge>;
}

function ShellCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[30px] border border-slate-200/80 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function SideNav({
  active,
  setActive,
}: {
  active: string;
  setActive: (v: string) => void;
}) {
  const items = [
    { key: "overview", label: "Visão da transação", icon: Home },
    { key: "timeline", label: "Linha do tempo", icon: CalendarDays },
    { key: "documents", label: "Documentos", icon: FileText },
    { key: "stakeholders", label: "Partes", icon: Users },
    { key: "manager", label: "Painel operacional", icon: BarChart3 },
  ];

  return (
    <ShellCard className="w-full lg:w-74 p-4">
      <div className="flex items-center gap-3 border-b border-slate-100 px-2 pb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-sm">
          T
        </div>
        <div>
          <div className="font-semibold tracking-tight text-slate-900">Tramita</div>
          <div className="text-sm text-slate-500">Transação imobiliária clara</div>
        </div>
      </div>

      <div className="space-y-1.5 pt-4">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition-all ${
                selected
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 ${
                  selected ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                }`}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </ShellCard>
  );
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <ShellCard className="p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
      {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
    </ShellCard>
  );
}

function OverviewScreen() {
  const completed = useMemo(() => steps.filter((s) => s.done).length, []);
  const percent = Math.round((completed / steps.length) * 100);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <ShellCard className="p-6 xl:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                Alta clareza operacional
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                Compra em andamento · TR-2041
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Apartamento · Jardins · São Paulo
              </div>
            </div>
            <Badge className="rounded-full bg-slate-950 px-3 py-1.5 text-white">
              Confiabilidade alta
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            {[
              ["Etapa atual", "Financiamento"],
              ["Próxima ação", "Enviar renda complementar"],
              ["Responsável", "Comprador"],
              ["Prazo estimado", "6 dias úteis"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[26px] border border-slate-200 bg-gradient-to-b from-white to-slate-50/70 p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-slate-500">Progresso determinístico</div>
                <div className="font-semibold text-slate-950">{percent}% concluído</div>
              </div>
              <div className="text-sm text-slate-500">
                {completed} de {steps.length} marcos completos
              </div>
            </div>

            <Progress value={percent} className="h-2.5" />

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { label: "Documentação", value: "92%" },
                { label: "Jurídico", value: "88%" },
                { label: "Fechamento", value: "41%" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm text-slate-500">{kpi.label}</div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                    {kpi.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ShellCard>

        <ShellCard className="p-6">
          <div className="text-lg font-semibold tracking-tight text-slate-950">
            Sinais de confiança
          </div>
          <div className="mt-1 text-sm text-slate-500">
            O que reduz surpresa na transação
          </div>

          <div className="mt-5 space-y-3">
            {[
              {
                icon: ShieldCheck,
                title: "Checklist verificável",
                text: "Cada etapa tem dono, prazo e evidência.",
              },
              {
                icon: Clock3,
                title: "Linha do tempo clara",
                text: "Eventos registrados em ordem e com carimbo de data.",
              },
              {
                icon: Bell,
                title: "Pendências explícitas",
                text: "Nada fica escondido em canais paralelos.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <Icon className="h-4.5 w-4.5 text-slate-700" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{item.title}</div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-500">{item.text}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ShellCard>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ShellCard className="p-6">
          <div className="text-lg font-semibold tracking-tight text-slate-950">Próximos marcos</div>
          <div className="mt-1 text-sm text-slate-500">Fluxo previsível da transação</div>

          <div className="mt-5 space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5"
              >
                <div>
                  {step.done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : step.id === 4 ? (
                    <Clock3 className="h-5 w-5 text-amber-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-900">{step.title}</div>
                  <div className="text-sm text-slate-500">{step.owner}</div>
                </div>
                <div className="text-sm text-slate-500">{step.date}</div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard className="p-6">
          <div className="text-lg font-semibold tracking-tight text-slate-950">Atividade recente</div>
          <div className="mt-1 text-sm text-slate-500">Transparência operacional em tempo real</div>

          <div className="mt-5 space-y-3">
            {activities.map((a, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${
                    a.type === "success"
                      ? "bg-emerald-500"
                      : a.type === "alert"
                        ? "bg-amber-500"
                        : "bg-slate-400"
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium leading-relaxed text-slate-900">{a.text}</div>
                  <div className="mt-1.5 text-xs text-slate-500">Hoje · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function TimelineScreen() {
  return (
    <ShellCard className="p-6">
      <div className="text-lg font-semibold tracking-tight text-slate-950">
        Linha do tempo auditável
      </div>
      <div className="mt-1 text-sm text-slate-500">
        Cada evento com data, origem e impacto na transação
      </div>

      <div className="mt-5 space-y-4">
        {[
          {
            date: "11 Abr · 08:45",
            title: "Oferta formal enviada",
            text: "Proposta registrada por corretor responsável.",
          },
          {
            date: "11 Abr · 16:22",
            title: "Oferta aceita pelo vendedor",
            text: "Etapa avançada automaticamente para documentação.",
          },
          {
            date: "12 Abr · 09:18",
            title: "Matrícula anexada",
            text: "Documento recebido e validado pelo sistema.",
          },
          {
            date: "13 Abr · 14:10",
            title: "Jurídico concluiu análise preliminar",
            text: "Sem gravames críticos identificados.",
          },
          {
            date: "Hoje · 11:37",
            title: "Pendência financeira aberta",
            text: "Solicitado comprovante complementar para aprovação bancária.",
          },
        ].map((event) => (
          <div
            key={event.title}
            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="w-32 shrink-0 text-sm text-slate-500">{event.date}</div>
            <div className="mt-1 h-5 w-5 rounded-full bg-slate-950" />
            <div>
              <div className="font-medium text-slate-900">{event.title}</div>
              <div className="mt-1 text-sm text-slate-500">{event.text}</div>
            </div>
          </div>
        ))}
      </div>
    </ShellCard>
  );
}

function DocumentsScreen() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <ShellCard className="p-6 xl:col-span-2">
        <div className="text-lg font-semibold tracking-tight text-slate-950">Central documental</div>
        <div className="mt-1 text-sm text-slate-500">
          Status explícito por documento e parte responsável
        </div>

        <div className="mt-5 space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.name}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                <FileText className="h-5 w-5 text-slate-700" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-900">{doc.name}</div>
                <div className="text-sm text-slate-500">Responsável: {doc.party}</div>
              </div>
              <StatusBadge status={doc.status} />
              <Button variant="ghost" className="rounded-xl">
                Ver
              </Button>
            </div>
          ))}
        </div>
      </ShellCard>

      <ShellCard className="p-6">
        <div className="text-lg font-semibold tracking-tight text-slate-950">Pendências abertas</div>
        <div className="mt-1 text-sm text-slate-500">O que trava o fechamento hoje</div>

        <div className="mt-5 space-y-3">
          {[
            "Comprovante de renda complementar",
            "Aprovação final do banco",
            "Agendamento de assinatura",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900"
            >
              {item}
            </div>
          ))}
        </div>
      </ShellCard>
    </div>
  );
}

function StakeholdersScreen() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {[
        { icon: Home, role: "Comprador", name: "Marina Costa", status: "Aguardando envio de renda" },
        { icon: Building2, role: "Vendedor", name: "Carlos Almeida", status: "Documentação concluída" },
        { icon: Landmark, role: "Banco", name: "Banco Parceiro", status: "Análise em andamento" },
        { icon: MessageSquare, role: "Jurídico", name: "Equipe Tramita Legal", status: "Minuta revisada" },
      ].map((person) => {
        const Icon = person.icon;
        return (
          <ShellCard key={person.role} className="p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <Icon className="h-5 w-5 text-slate-700" />
            </div>
            <div className="text-sm text-slate-500">{person.role}</div>
            <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
              {person.name}
            </div>
            <div className="mt-3 text-sm text-slate-500">{person.status}</div>
          </ShellCard>
        );
      })}
    </div>
  );
}

function ManagerScreen() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Transações ativas" value="42" />
        <MetricCard label="Risco alto" value="5" />
        <MetricCard label="Fechamentos este mês" value="18" />
        <MetricCard label="Tempo médio" value="23 dias" />
      </div>

      <ShellCard className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-950">
              Painel operacional
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Útil para gestão, mas não é o centro da proposta de valor
            </div>
          </div>
          <Button variant="outline" className="rounded-2xl border-slate-200 bg-white">
            Ver carteira
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {pipelineDeals.map((deal) => (
            <div
              key={deal.id}
              className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[1.4fr_1fr_1fr_120px_120px]"
            >
              <div>
                <div className="font-medium text-slate-900">{deal.property}</div>
                <div className="text-sm text-slate-500">
                  {deal.id} · {deal.city}
                </div>
              </div>
              <div className="text-sm text-slate-700">{deal.stage}</div>
              <div>
                <div className="mb-1 text-sm text-slate-500">{deal.progress}%</div>
                <Progress value={deal.progress} className="h-2" />
              </div>
              <RiskBadge risk={deal.risk} />
              <Button variant="outline" className="rounded-xl">
                Abrir
              </Button>
            </div>
          ))}
        </div>
      </ShellCard>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("overview");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <ShellCard className="relative overflow-hidden p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(15,23,42,0.05),transparent_22%),radial-gradient(circle_at_85%_15%,rgba(148,163,184,0.12),transparent_28%)]" />
            <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-sm text-slate-600 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Transparency · Determinism · Reliability
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                  Tramita
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Um protótipo de plataforma para tornar a transação imobiliária visível,
                  previsível e confiável — com etapas, documentos, responsáveis e pendências
                  em um único fluxo.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:items-center">
                <div className="relative min-w-[290px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="h-12 rounded-2xl border-slate-200 bg-white/95 pl-10 shadow-sm"
                    value="TR-2041 · Apartamento Jardins"
                    readOnly
                  />
                </div>
                <Button className="h-12 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-900">
                  Abrir transação
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </ShellCard>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[296px_minmax(0,1fr)]">
          <SideNav active={active} setActive={setActive} />

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {active === "overview" && <OverviewScreen />}
            {active === "timeline" && <TimelineScreen />}
            {active === "documents" && <DocumentsScreen />}
            {active === "stakeholders" && <StakeholdersScreen />}
            {active === "manager" && <ManagerScreen />}
          </motion.div>
        </div>

        <ShellCard className="p-6 md:p-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                title: "Por que existe",
                text: "Porque a maior dor não é só buscar imóvel. É atravessar a transação sem ruído, sem opacidade e sem surpresa.",
              },
              {
                title: "Diferencial",
                text: "Progresso determinístico por marcos, donos, documentos e evidências — não apenas CRM ou comunicação dispersa.",
              },
              {
                title: "Uso na demo",
                text: "Clique nas seções para mostrar ao investidor como Tramita organiza a jornada do negócio ao fechamento.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="font-semibold tracking-tight text-slate-950">{item.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}