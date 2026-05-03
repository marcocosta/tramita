import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BookmarkPlus,
  Building2,
  CheckCircle2,
  Filter,
  LandPlot,
  Layers3,
  MapPin,
  Radar,
  Search,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

const candidates = [
  {
    id: "OP-1187",
    title: "Terreno · Meireles",
    location: "Fortaleza, CE",
    area: "1.240 m²",
    fit: 86,
    value: "R$ 2,8M–3,4M",
    thesis: "Residencial vertical / uso misto",
    risk: "Médio",
    status: "Promissor",
    selected: true,
  },
  {
    id: "OP-1179",
    title: "Lote · Aldeota",
    location: "Fortaleza, CE",
    area: "940 m²",
    fit: 78,
    value: "R$ 2,1M–2,6M",
    thesis: "Serviços / clínica",
    risk: "Médio",
    status: "Analisar",
    selected: false,
  },
  {
    id: "OP-1168",
    title: "Terreno · Cocó",
    location: "Fortaleza, CE",
    area: "1.760 m²",
    fit: 74,
    value: "R$ 3,6M–4,2M",
    thesis: "Incorporação residencial",
    risk: "Alto",
    status: "Atenção",
    selected: false,
  },
];

const filters = [
  ["Cidade", "Fortaleza"],
  ["Área", "800–2.000 m²"],
  ["Uso alvo", "Residencial / misto"],
  ["Liquidez", "Média-alta"],
  ["Risco", "Sem bloqueio crítico"],
];

const signals = [
  { label: "Localização", value: "88/100", progress: 88 },
  { label: "Tamanho do lote", value: "84/100", progress: 84 },
  { label: "Potencial urbano", value: "82/100", progress: 82 },
  { label: "Valor relativo", value: "71/100", progress: 71 },
  { label: "Risco preliminar", value: "Médio", progress: 58 },
];

const quickFlags = [
  {
    title: "Plano Diretor",
    status: "Validar",
    text: "Confirmar uso permitido, coeficiente, recuos e altura máxima.",
    tone: "amber" as const,
  },
  {
    title: "Matrícula",
    status: "Pendente",
    text: "Matrícula ainda não anexada para validação dominial.",
    tone: "slate" as const,
  },
  {
    title: "Entorno",
    status: "Favorável",
    text: "Eixo comercial e verticalização próximos ao ativo.",
    tone: "green" as const,
  },
  {
    title: "Liquidez",
    status: "Média-alta",
    text: "Comparáveis próximos e demanda ativa na região.",
    tone: "green" as const,
  },
];

const thesisChecks = [
  "Área compatível com tese de incorporação residencial ou uso misto.",
  "Localização em zona urbana consolidada com serviços e circulação próximos.",
  "Potencial depende de confirmação de parâmetros urbanísticos oficiais.",
];

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

function ToneBadge({
  tone,
  children,
}: {
  tone: "green" | "amber" | "red" | "slate" | "blue";
  children: React.ReactNode;
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

export default function DiscoverOpportunityDetail() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.07),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-sm">
              T
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-slate-950">
                Tramita
              </div>
              <div className="text-sm text-slate-500">
                Opportunity sourcing cockpit
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-11 rounded-2xl border-slate-200 bg-white/95 pl-10 shadow-sm"
                value="Terrenos 800–2.000 m² · Fortaleza"
                readOnly
              />
            </div>
            <Button
              variant="outline"
              className="h-11 rounded-2xl border-slate-200 bg-white"
            >
              <Filter className="mr-2 h-4 w-4" />
              Ajustar tese
            </Button>
            <Button className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-900">
              Nova busca
            </Button>
          </div>
        </motion.header>

        <ShellCard className="relative overflow-hidden p-6 md:p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(180,83,9,0.06),transparent_23%),radial-gradient(circle_at_90%_10%,rgba(15,23,42,0.06),transparent_25%)]" />
          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <ToneBadge tone="blue">Discover</ToneBadge>
                <ToneBadge tone="green">3 ativos priorizados</ToneBadge>
                <ToneBadge tone="amber">
                  Validação documental pendente
                </ToneBadge>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Oportunidades em Fortaleza
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                Busca inteligente de terrenos para incorporação residencial ou
                uso misto, priorizando área, localização, potencial urbanístico,
                liquidez e risco preliminar.
              </p>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white/86 p-5 shadow-sm">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Radar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Tramita sourcing insight
                  </div>
                  <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                    Meireles aparece como o melhor encaixe inicial.
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    O ativo combina tamanho, localização, liquidez e potencial
                    urbano, mas ainda precisa de confirmação de matrícula, IPTU
                    e parâmetros do Plano Diretor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ShellCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-6">
            <ShellCard className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="flex flex-col justify-between gap-5 p-5 md:p-6">
                  <div>
                    <SectionTitle
                      eyebrow="Search thesis"
                      title="Tese de busca"
                      description="Critérios usados para ranquear os ativos encontrados."
                    />
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {filters.map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5"
                        >
                          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {label}
                          </div>
                          <div className="mt-2 text-sm font-semibold text-slate-950">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 rounded-[24px] border border-slate-200 bg-white p-3">
                    {[
                      ["Candidatos", "12"],
                      ["Shortlist", "3"],
                      ["Melhor fit", "86"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          {label}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-950">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-[360px] overflow-hidden bg-slate-900">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#dbeafe_0%,#f8fafc_32%,#e2e8f0_33%,#f8fafc_39%,#bfdbfe_100%)] opacity-95" />
                  <div className="absolute left-[15%] top-[20%] h-[42%] w-[32%] rotate-[-7deg] rounded-[28px] border-2 border-emerald-700/70 bg-emerald-100/30" />
                  <div className="absolute right-[18%] top-[18%] h-[34%] w-[24%] rotate-[10deg] rounded-[24px] border-2 border-amber-700/60 bg-amber-100/25" />
                  <div className="absolute bottom-[18%] left-[42%] h-[30%] w-[28%] rotate-[4deg] rounded-[24px] border-2 border-slate-700/60 bg-white/20" />

                  <div className="absolute left-[29%] top-[39%] flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="absolute right-[27%] top-[31%] flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white shadow-xl">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-[27%] left-[52%] flex h-10 w-10 items-center justify-center rounded-full bg-slate-600 text-white shadow-xl">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                    Mapa conceitual · Fortaleza
                  </div>
                  <div className="absolute right-5 top-5 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                    Camada de sourcing ativa
                  </div>
                  <div className="absolute bottom-5 left-5 rounded-2xl border border-white/60 bg-white/86 px-4 py-3 shadow-sm backdrop-blur">
                    <div className="text-sm font-semibold text-slate-950">
                      3 oportunidades ranqueadas
                    </div>
                    <div className="text-xs text-slate-500">
                      Fit score · potencial · risco preliminar
                    </div>
                  </div>
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-5 md:p-6">
              <SectionTitle
                eyebrow="Ranked candidates"
                title="Oportunidades encontradas"
                description="Ativos priorizados pela tese de busca e pelos sinais preliminares."
              />
              <div className="mt-5 space-y-3">
                {candidates.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-[24px] border p-4 transition ${
                      item.selected
                        ? "border-slate-200 bg-slate-50/70 shadow-sm"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.75fr_0.9fr] lg:items-center">
                      <div className="flex min-w-0 gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                            item.selected
                              ? "bg-slate-950 text-white"
                              : "bg-slate-50 text-slate-600"
                          }`}
                        >
                          <LandPlot className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                            {item.id}
                          </div>
                          <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                            {item.title}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {item.location} · {item.area}
                          </div>
                        </div>
                      </div>

                      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-500">Fit score</span>
                          <span className="font-semibold text-slate-950">
                            {item.fit}/100
                          </span>
                        </div>
                        <Progress value={item.fit} className="h-2" />
                      </div>

                      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="text-sm font-semibold leading-snug text-slate-900">
                          {item.value}
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-slate-500">
                          {item.thesis}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <ToneBadge tone={item.risk === "Alto" ? "red" : "amber"}>
                            {item.risk}
                          </ToneBadge>
                          <ToneBadge
                            tone={
                              item.status === "Promissor"
                                ? "green"
                                : item.status === "Atenção"
                                  ? "amber"
                                  : "blue"
                            }
                          >
                            {item.status}
                          </ToneBadge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ShellCard className="p-6">
                <SectionTitle
                  eyebrow="Selected opportunity"
                  title="Por que Meireles foi priorizado"
                  description="Leitura inicial da tese de investimento."
                />
                <div className="mt-5 space-y-3">
                  {thesisChecks.map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div className="text-sm leading-relaxed text-slate-700">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </ShellCard>

              <ShellCard className="p-6">
                <SectionTitle
                  eyebrow="Early validation"
                  title="Sinais preliminares"
                  description="O que já parece favorável e o que ainda precisa ser validado."
                />
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {quickFlags.map((flag) => (
                    <div
                      key={flag.title}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-semibold text-slate-950">
                          {flag.title}
                        </div>
                        <ToneBadge tone={flag.tone}>{flag.status}</ToneBadge>
                      </div>
                      <div className="mt-2 text-sm leading-relaxed text-slate-500">
                        {flag.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ShellCard>
            </div>

            <ShellCard className="p-5 md:p-6">
              <SectionTitle
                eyebrow="Pipeline"
                title="Próximos passos sugeridos"
                description="Transforme oportunidade em análise ou descarte com base em evidência."
              />
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  {
                    icon: Search,
                    title: "Analisar ativo",
                    text: "Criar Property Intelligence Profile para o terreno de Meireles.",
                  },
                  {
                    icon: BookmarkPlus,
                    title: "Salvar no pipeline",
                    text: "Acompanhar oportunidade e dados pendentes.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Pré-diligência",
                    text: "Solicitar matrícula, IPTU e parâmetros urbanísticos oficiais.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[24px] border border-slate-200 bg-white p-5"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <div className="mt-4 font-semibold text-slate-950">
                        {item.title}
                      </div>
                      <div className="mt-2 text-sm leading-relaxed text-slate-500">
                        {item.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ShellCard>
          </main>

          <aside className="space-y-6 lg:sticky lg:top-8">
            <ShellCard className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Opportunity fit scorecard
                  </div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    Meireles lidera a shortlist
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Target className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Melhor combinação inicial entre tamanho, localização, potencial
                urbanístico e liquidez. Risco permanece médio até validação
                documental.
              </p>
              <div className="mt-6 space-y-5">
                {signals.map((signal) => (
                  <ScoreRow
                    key={signal.label}
                    label={signal.label}
                    value={signal.value}
                    progress={signal.progress}
                  />
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-emerald-600">
                    Fit
                  </div>
                  <div className="mt-1 font-semibold text-emerald-950">
                    86/100
                  </div>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-amber-600">
                    Risco
                  </div>
                  <div className="mt-1 font-semibold text-amber-950">Médio</div>
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                title="Oportunidade selecionada"
                description="Resumo do ativo com maior encaixe na tese."
              />
              <div className="mt-5 rounded-[26px] border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <LandPlot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-950">
                      Terreno · Meireles
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      1.240 m² · Fortaleza, CE
                    </div>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <Button className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-900">
                    Analisar este ativo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-2xl border-slate-200 bg-white"
                  >
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Salvar no pipeline
                  </Button>
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-5 md:p-6">
              <SectionTitle
                title="Validações antes de avançar"
                description="Checagens necessárias antes de aprofundar análise ou proposta."
              />
              <div className="mt-5 space-y-3">
                {[
                  {
                    icon: Layers3,
                    title: "Parâmetros oficiais",
                    text: "Confirmar Plano Diretor e regras urbanísticas.",
                  },
                  {
                    icon: Building2,
                    title: "Cadastro municipal",
                    text: "Consultar IPTU e vínculo cadastral.",
                  },
                  {
                    icon: AlertTriangle,
                    title: "Matrícula",
                    text: "Validar titularidade, ônus e restrições.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
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
                title="O que Tramita encontrou"
                description="Resumo do sourcing preliminar."
              />
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Candidatos
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-950">
                    12
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Shortlist
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-950">
                    3
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Melhor fit
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-950">
                    86
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Dados pendentes
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-950">
                    3
                  </div>
                </div>
              </div>
            </ShellCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
