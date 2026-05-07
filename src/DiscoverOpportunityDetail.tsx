import React, { useState } from "react";
import {
  AlertTriangle,
  BookmarkPlus,
  Building2,
  CheckCircle2,
  LandPlot,
  Layers3,
  Radar,
  Search,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import DossierRequestModal from "./components/DossierRequestModal";
import OpportunityMap from "./components/OpportunityMap";
import { tramitaMockData } from "./data/tramitaMockData";
import type { DossierRequestStatusByPropertyId } from "./state/tramitaAppState";
import type { Opportunity } from "./types/tramita";

const defaultCandidateOptions = tramitaMockData.discover.candidates;

const searchCommand = tramitaMockData.discover.searchThesis.command;
const dossierFulfillmentItems = tramitaMockData.dossierFulfillmentItems;

const dataAvailabilityLabels: Record<Opportunity["dataAvailability"], string> =
  {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  };

const defaultFilters = {
  state: "Ceará",
  city: "Fortaleza",
  region: "Todas",
  assetType: "Terreno urbano",
  areaMin: "800",
  areaMax: "2000",
  targetUse: "Todos",
  dataAvailability: "Todas",
};

type DiscoverFilters = typeof defaultFilters;

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

function getUniqueOptions(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
}

function matchesFilters(opportunity: Opportunity, filters: DiscoverFilters) {
  const areaMin = Number(filters.areaMin) || 0;
  const areaMax = Number(filters.areaMax) || Number.POSITIVE_INFINITY;

  return (
    (filters.state === "Todos" || opportunity.state === filters.state) &&
    (filters.city === "Todas" || opportunity.city === filters.city) &&
    (filters.region === "Todas" || opportunity.region === filters.region) &&
    (filters.assetType === "Todos" ||
      opportunity.assetType === filters.assetType) &&
    opportunity.areaM2 >= areaMin &&
    opportunity.areaM2 <= areaMax &&
    (filters.targetUse === "Todos" ||
      opportunity.targetUse.includes(filters.targetUse)) &&
    (filters.dataAvailability === "Todas" ||
      opportunity.dataAvailability === filters.dataAvailability)
  );
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

function getToneClass(tone: "green" | "amber" | "red" | "slate" | "blue") {
  const map = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return map[tone];
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

function getOpportunityHeroTone(opportunity: Opportunity) {
  if (opportunity.imported) {
    return {
      badge: "border-blue-200 bg-blue-50 text-blue-700",
      line: "border-blue-300/70 bg-blue-100/25",
      surface:
        "border-blue-200/80 bg-[radial-gradient(circle_at_12%_16%,rgba(37,99,235,0.12),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f8fafc_45%,#eff6ff_100%)]",
    };
  }

  if (opportunity.riskLevel === "high") {
    return {
      badge: "border-red-200 bg-red-50 text-red-700",
      line: "border-red-300/70 bg-red-100/20",
      surface:
        "border-red-200/80 bg-[radial-gradient(circle_at_12%_16%,rgba(220,38,38,0.10),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f8fafc_48%,#fef2f2_100%)]",
    };
  }

  if (opportunity.dataAvailability === "high") {
    return {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      line: "border-emerald-300/70 bg-emerald-100/20",
      surface:
        "border-emerald-200/80 bg-[radial-gradient(circle_at_12%_16%,rgba(5,150,105,0.10),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f8fafc_45%,#ecfdf5_100%)]",
    };
  }

  return {
    badge: "border-slate-200 bg-white/80 text-slate-700",
    line: "border-slate-300/70 bg-white/20",
    surface:
      "border-slate-200/80 bg-[radial-gradient(circle_at_12%_16%,rgba(15,23,42,0.09),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f8fafc_45%,#eef2f7_100%)]",
  };
}

function getRiskTone(
  riskLevel: Opportunity["riskLevel"],
): "green" | "amber" | "red" | "slate" | "blue" {
  if (riskLevel === "low") {
    return "green";
  }
  if (riskLevel === "high") {
    return "red";
  }
  if (riskLevel === "unknown") {
    return "slate";
  }
  return "amber";
}

function getDataTone(
  dataAvailability: Opportunity["dataAvailability"],
): "green" | "amber" | "red" | "slate" | "blue" {
  if (dataAvailability === "high") {
    return "green";
  }
  if (dataAvailability === "low") {
    return "slate";
  }
  return "amber";
}

function getOpportunitySignal(opportunity: Opportunity) {
  if (opportunity.imported) {
    return "Dados importados · validação recomendada.";
  }
  if (opportunity.fitScore >= 80) {
    return "Boa combinação inicial com a tese.";
  }
  if (opportunity.riskLevel === "high") {
    return "Potencial exige validação cuidadosa.";
  }
  return "Encaixe preliminar em observação.";
}

function OpportunityCardHero({
  opportunity,
  rank,
  selected,
}: {
  opportunity: Opportunity;
  rank: number;
  selected: boolean;
}) {
  const tone = getOpportunityHeroTone(opportunity);
  const sourceLabel = opportunity.sourceLabel ?? opportunity.primarySourceLabel;

  return (
    <div className="relative min-w-0 overflow-hidden px-1 py-0.5">
      <div className="absolute right-0 top-3 h-px w-28 bg-slate-300/25" />
      <div className="absolute right-12 top-0 h-20 w-px bg-slate-300/20" />
      <div
        className={`absolute right-2 top-1 h-8 w-14 rotate-[-8deg] rounded-[12px] border opacity-60 ${tone.line}`}
      />
      <div
        className={`absolute right-14 top-9 h-7 w-12 rotate-[7deg] rounded-[10px] border opacity-50 ${tone.line}`}
      />

      <div className="relative flex min-w-0 items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">
          {rank}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            <span>{opportunity.id}</span>
            {opportunity.imported ? (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-[0] text-blue-700">
                Importado
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <div className="text-lg font-semibold leading-snug tracking-tight text-slate-950">
              {opportunity.title}
            </div>
            {selected ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Selecionado
              </span>
            ) : null}
          </div>
          <div className="mt-0.5 text-sm font-medium leading-snug text-slate-600">
            {opportunity.region} · {opportunity.city} · {opportunity.areaLabel}
          </div>
        </div>
      </div>

      <div className="relative mt-2 flex flex-wrap gap-1.5">
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone.badge}`}>
          {opportunity.assetType}
        </span>
        <span className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-700">
          {sourceLabel}
        </span>
        <span className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-700">
          Dados {dataAvailabilityLabels[opportunity.dataAvailability].toLowerCase()}
        </span>
      </div>
    </div>
  );
}

type DiscoverOpportunityDetailProps = {
  dossierRequestStatusByPropertyId?: DossierRequestStatusByPropertyId;
  onAnalyze?: (opportunityId?: string) => void;
  onRequestDossier?: (propertyId: string, opportunityId?: string) => void;
  onSearchThesisChange?: (value: string) => void;
  onSelectOpportunity?: (opportunityId: string) => void;
  opportunities?: Opportunity[];
  searchThesisText?: string;
  selectedOpportunityId?: string;
};

export default function DiscoverOpportunityDetail({
  dossierRequestStatusByPropertyId = {},
  onAnalyze,
  onRequestDossier,
  onSearchThesisChange,
  onSelectOpportunity,
  opportunities = defaultCandidateOptions,
  searchThesisText = searchCommand,
  selectedOpportunityId,
}: DiscoverOpportunityDetailProps) {
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [dossierNotice, setDossierNotice] = useState<string | null>(null);
  const [dossierTargetOpportunityId, setDossierTargetOpportunityId] = useState<
    string | null
  >(null);
  const [searchNotice, setSearchNotice] = useState<string | null>(null);
  const [draftFilters, setDraftFilters] =
    useState<DiscoverFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<DiscoverFilters>(defaultFilters);

  const candidateOptions = opportunities;
  const filteredCandidateOptions = candidateOptions.filter((candidate) =>
    matchesFilters(candidate, appliedFilters),
  );
  const selectedCandidateOutsideFilter = selectedOpportunityId
    ? candidateOptions.find(
        (candidate) =>
          candidate.id === selectedOpportunityId &&
          !filteredCandidateOptions.some((item) => item.id === selectedOpportunityId),
      )
    : undefined;
  const visibleCandidateOptions =
    filteredCandidateOptions.length > 0
      ? [
          ...(selectedCandidateOutsideFilter
            ? [selectedCandidateOutsideFilter]
            : []),
          ...filteredCandidateOptions,
        ]
      : selectedCandidateOutsideFilter
        ? [selectedCandidateOutsideFilter]
        : [];
  const effectiveSelectedOpportunityId =
    visibleCandidateOptions.some(
      (candidate) => candidate.id === selectedOpportunityId,
    )
      ? selectedOpportunityId
      : visibleCandidateOptions[0]?.id ?? selectedOpportunityId;
  const candidates = visibleCandidateOptions.map((candidate) => ({
    ...candidate,
    selected: candidate.id === effectiveSelectedOpportunityId,
  }));
  const selectedCandidate =
    candidates.find((candidate) => candidate.selected) ??
    candidateOptions.find((candidate) => candidate.id === selectedOpportunityId) ??
    candidateOptions[0];
  const stateOptions = getUniqueOptions(candidateOptions.map((item) => item.state));
  const cityOptions = getUniqueOptions(
    candidateOptions
      .filter(
        (item) => draftFilters.state === "Todos" || item.state === draftFilters.state,
      )
      .map((item) => item.city),
  );
  const regionOptions = getUniqueOptions(
    candidateOptions
      .filter(
        (item) =>
          (draftFilters.state === "Todos" || item.state === draftFilters.state) &&
          (draftFilters.city === "Todas" || item.city === draftFilters.city),
      )
      .map((item) => item.region),
  );
  const assetTypeOptions = getUniqueOptions(
    candidateOptions.map((item) => item.assetType),
  );
  const targetUseOptions = getUniqueOptions(
    candidateOptions.flatMap((item) => item.targetUse),
  );
  const resultCount = candidates.length;
  const bestFit = candidates.reduce(
    (max, candidate) => Math.max(max, candidate.fitScore),
    0,
  );
  const dynamicThesisMetrics = [
    ["Candidatos", String(resultCount)],
    ["Shortlist", String(Math.min(resultCount, 3))],
    ["Melhor fit", bestFit ? String(bestFit) : "—"],
    [
      "Importados",
      String(candidates.filter((candidate) => candidate.imported).length),
    ],
  ] as const;
  const importedCount = candidateOptions.filter((candidate) => candidate.imported)
    .length;
  const selectedDossierRequested = Boolean(
    selectedCandidate &&
      dossierRequestStatusByPropertyId[selectedCandidate.propertyId] ===
        "requested",
  );
  const showDossierSummary =
    selectedDossierRequested || Boolean(dossierNotice);
  const activeDossierItems = dossierFulfillmentItems.filter((item) =>
    ["requested", "collecting", "validating"].includes(item.status),
  );
  const deliveredDossierItems = dossierFulfillmentItems.filter(
    (item) => item.status === "delivered",
  );
  const highImpactDossierItems = dossierFulfillmentItems.filter(
    (item) => item.confidenceImpact === "high",
  );
  const nextDossierItem =
    dossierFulfillmentItems.find((item) => item.status !== "delivered") ??
    dossierFulfillmentItems[0];
  const selectedOpportunityName =
    selectedCandidate?.title.split("·").pop()?.trim() ??
    selectedCandidate?.title ??
    "ativo selecionado";

  function applySearchThesis() {
    const nextCandidates = candidateOptions.filter((candidate) =>
      matchesFilters(candidate, draftFilters),
    );

    setAppliedFilters(draftFilters);
    if (
      nextCandidates.length > 0 &&
      !nextCandidates.some((candidate) => candidate.id === selectedOpportunityId)
    ) {
      onSelectOpportunity?.(nextCandidates[0].id);
    }
    setSearchNotice(
      "Tese aplicada ao conjunto de dados disponível neste protótipo.",
    );
  }

  function selectCandidate(opportunityId: string) {
    onSelectOpportunity?.(opportunityId);
  }

  function updateDraftFilter(key: keyof DiscoverFilters, value: string) {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "state" ? { city: "Todas", region: "Todas" } : {}),
      ...(key === "city" ? { region: "Todas" } : {}),
    }));
  }

  function openDossierModal(opportunityId = selectedCandidate?.id) {
    setDossierTargetOpportunityId(opportunityId ?? null);
    setDossierModalOpen(true);
  }

  function confirmDossierRequest() {
    const targetCandidate =
      candidates.find(
        (candidate) => candidate.id === dossierTargetOpportunityId,
      ) ?? selectedCandidate;

    setDossierModalOpen(false);
    if (targetCandidate) {
      onRequestDossier?.(targetCandidate.propertyId, targetCandidate.id);
    }
    setDossierNotice(
      "Solicitação criada. O dossiê aparece como solicitado neste protótipo.",
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.07),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <ShellCard className="relative overflow-hidden p-6 md:p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(180,83,9,0.06),transparent_23%),radial-gradient(circle_at_90%_10%,rgba(15,23,42,0.06),transparent_25%)]" />
          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <ToneBadge tone="blue">Busca nacional</ToneBadge>
                <ToneBadge tone="slate">Filtro ativo: Fortaleza, CE</ToneBadge>
                <ToneBadge tone="green">3 ativos priorizados</ToneBadge>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Buscar oportunidades no Brasil
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                Digite uma tese de busca, selecione uma região no mapa e
                ranqueie imóveis ou terrenos por localização, tamanho,
                potencial urbanístico, liquidez, risco preliminar e
                disponibilidade de dados.
              </p>
              <div className="mt-5 rounded-[24px] border border-slate-200 bg-white/88 p-3 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <Input
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-700"
                    onChange={(event) =>
                      onSearchThesisChange?.(event.target.value)
                    }
                    value={searchThesisText}
                  />
                  <Button
                    className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-900"
                    onClick={applySearchThesis}
                    type="button"
                  >
                    Rodar tese
                  </Button>
                </div>
                {searchNotice ? (
                  <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                    {searchNotice}
                  </div>
                ) : null}
              </div>
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
          <main className="space-y-5">
            <ShellCard className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="flex flex-col justify-between gap-4 p-4 md:p-5">
                  <div>
                    <SectionTitle
                      eyebrow="Tese de busca"
                      title="Tese de busca"
                      description="Critérios usados para ranquear os ativos encontrados."
                    />
                    <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {[
                        {
                          key: "state" as const,
                          label: "Estado",
                          options: ["Todos", ...stateOptions],
                        },
                        {
                          key: "city" as const,
                          label: "Cidade",
                          options: ["Todas", ...cityOptions],
                        },
                        {
                          key: "region" as const,
                          label: "Região",
                          options: ["Todas", ...regionOptions],
                        },
                        {
                          key: "assetType" as const,
                          label: "Tipo",
                          options: ["Todos", ...assetTypeOptions],
                        },
                        {
                          key: "targetUse" as const,
                          label: "Uso alvo",
                          options: ["Todos", ...targetUseOptions],
                        },
                        {
                          key: "dataAvailability" as const,
                          label: "Dados",
                          options: ["Todas", "low", "medium", "high"],
                        },
                      ].map((filter) => (
                        <label
                          className="rounded-2xl border border-slate-200 bg-white p-2.5"
                          key={filter.key}
                        >
                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {filter.label}
                          </span>
                          <select
                            className="mt-2 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none"
                            onChange={(event) =>
                              updateDraftFilter(filter.key, event.target.value)
                            }
                            value={draftFilters[filter.key]}
                          >
                            {filter.options.map((option) => (
                              <option key={option} value={option}>
                                {option === "low" ||
                                option === "medium" ||
                                option === "high"
                                  ? dataAvailabilityLabels[
                                      option as Opportunity["dataAvailability"]
                                    ]
                                  : option}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                      <label className="rounded-2xl border border-slate-200 bg-white p-2.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Área min
                        </span>
                        <Input
                          className="mt-2 h-9 rounded-xl border-slate-200 bg-slate-50 text-sm"
                          onChange={(event) =>
                            updateDraftFilter("areaMin", event.target.value)
                          }
                          type="number"
                          value={draftFilters.areaMin}
                        />
                      </label>
                      <label className="rounded-2xl border border-slate-200 bg-white p-2.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Área max
                        </span>
                        <Input
                          className="mt-2 h-9 rounded-xl border-slate-200 bg-slate-50 text-sm"
                          onChange={(event) =>
                            updateDraftFilter("areaMax", event.target.value)
                          }
                          type="number"
                          value={draftFilters.areaMax}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {dynamicThesisMetrics.map(([label, value]) => (
                      <div
                        key={label}
                        className="min-w-0 rounded-2xl border border-slate-200 bg-white px-2 py-3 text-center shadow-sm"
                      >
                        <div className="break-words text-[10px] font-semibold uppercase leading-tight tracking-[0] text-slate-400">
                          {label}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-950">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative p-3">
                  <OpportunityMap
                    onAnalyzeOpportunity={onAnalyze}
                    opportunities={candidates}
                    onSelectOpportunity={selectCandidate}
                    selectedOpportunityId={selectedCandidate?.id}
                  />
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-5 md:p-6">
              <SectionTitle
                eyebrow="Ranking"
                title="Oportunidades encontradas"
                description="Ativos priorizados pela tese de busca e pelos sinais preliminares."
              />
              <div className="mt-4 space-y-2.5">
                {candidates.map((item, index) => {
                  const sourceLabel =
                    item.sourceLabel ?? item.primarySourceLabel;
                  const statusTone =
                    item.statusLabel === "Promissor"
                      ? "green"
                      : item.statusLabel === "Atenção"
                        ? "amber"
                        : item.imported
                          ? "blue"
                          : "slate";

                  return (
                    <div
                      key={item.id}
                      className={`cursor-pointer rounded-[24px] border px-3 py-3 transition ${
                        item.selected
                          ? "border-emerald-300 bg-emerald-50/35 shadow-[0_12px_30px_rgba(15,23,42,0.10)]"
                          : "border-slate-200 bg-white/95 hover:border-slate-300 hover:bg-white"
                      }`}
                      onClick={() => selectCandidate(item.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectCandidate(item.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_0.72fr] xl:grid-cols-[minmax(0,1.12fr)_210px_minmax(0,0.92fr)] xl:items-center xl:gap-0">
                        <OpportunityCardHero
                          opportunity={item}
                          rank={index + 1}
                          selected={item.selected}
                        />

                        <div className="flex min-w-0 flex-col justify-center xl:border-l xl:border-slate-200/80 xl:pl-4 xl:pr-4">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-500">Fit</span>
                            <span className="text-sm font-semibold text-slate-950">
                              {item.fitScore}/100
                            </span>
                          </div>
                          <Progress value={item.fitScore} className="h-2" />
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getToneClass(
                                getRiskTone(item.riskLevel),
                              )}`}
                            >
                              Risco {item.riskLabel.toLowerCase()}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getToneClass(
                                getDataTone(item.dataAvailability),
                              )}`}
                            >
                              Dados{" "}
                              {dataAvailabilityLabels[
                                item.dataAvailability
                              ].toLowerCase()}
                            </span>
                          </div>
                          <div className="mt-1.5 text-xs leading-snug text-slate-500">
                            {getOpportunitySignal(item)}
                          </div>
                        </div>

                        <div className="min-w-0 lg:col-span-2 xl:col-span-1 xl:border-l xl:border-slate-200/80 xl:pl-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                                Valor estimado
                              </div>
                              <div className="mt-0.5 text-base font-semibold leading-snug text-slate-950">
                                {item.valueRange}
                              </div>
                            </div>
                            <ToneBadge tone={statusTone}>
                              {item.statusLabel}
                            </ToneBadge>
                          </div>
                          <div className="mt-1 text-sm leading-snug text-slate-500">
                            {item.thesis}
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700">
                              {sourceLabel}
                            </span>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700">
                              {item.dossierLabel}
                            </span>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700">
                              {item.targetUse.join(" / ")}
                            </span>
                          </div>
                          {item.previewNote ? (
                            <div className="mt-1.5 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs leading-snug text-amber-800">
                              {item.previewNote}
                            </div>
                          ) : null}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <button
                              className="px-1 text-xs font-semibold text-slate-500 transition hover:text-slate-950"
                              onClick={(event) => {
                                event.stopPropagation();
                                selectCandidate(item.id);
                              }}
                              type="button"
                            >
                              Ver prévia
                            </button>
                            <Button
                              variant="outline"
                              className="h-8 rounded-xl border-slate-200 bg-white px-3 text-xs"
                              onClick={(event) => {
                                event.stopPropagation();
                                selectCandidate(item.id);
                                openDossierModal(item.id);
                              }}
                              type="button"
                            >
                              Dossiê
                            </Button>
                            <Button
                              className="h-8 rounded-xl bg-slate-950 px-3 text-xs text-white hover:bg-slate-900"
                              onClick={(event) => {
                                event.stopPropagation();
                                selectCandidate(item.id);
                                onAnalyze?.(item.id);
                              }}
                              type="button"
                            >
                              Analisar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ShellCard>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ShellCard className="p-6">
                <SectionTitle
                  eyebrow="Oportunidade selecionada"
                  title={`Por que ${selectedOpportunityName} foi priorizado`}
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
                  eyebrow="Validação inicial"
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
                      onClick={
                        item.title === "Analisar ativo"
                          ? () => onAnalyze?.(selectedCandidate?.id)
                          : undefined
                      }
                      onKeyDown={(event) => {
                        if (
                          item.title === "Analisar ativo" &&
                          onAnalyze &&
                          (event.key === "Enter" || event.key === " ")
                        ) {
                          event.preventDefault();
                          onAnalyze(selectedCandidate?.id);
                        }
                      }}
                      role={
                        item.title === "Analisar ativo" && onAnalyze
                          ? "button"
                          : undefined
                      }
                      tabIndex={
                        item.title === "Analisar ativo" && onAnalyze
                          ? 0
                          : undefined
                      }
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
                    Scorecard da oportunidade
                  </div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    {selectedCandidate?.title ?? "Ativo selecionado"} na shortlist
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
                    {selectedCandidate?.fitScore ?? 0}/100
                  </div>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-amber-600">
                    Risco
                  </div>
                  <div className="mt-1 font-semibold text-amber-950">
                    {selectedCandidate?.riskLabel ?? "Médio"}
                  </div>
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-5">
              <SectionTitle
                title="Oportunidade selecionada"
                description="Resumo do ativo com maior encaixe na tese."
              />
              <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <LandPlot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-950">
                      {selectedCandidate?.title ?? "Terreno · Meireles"}
                    </div>
                    <div className="mt-1 text-sm leading-snug text-slate-500">
                      {selectedCandidate?.region
                        ? `${selectedCandidate.region} · `
                        : ""}
                      {selectedCandidate?.areaLabel ?? "1.240 m²"} ·{" "}
                      {selectedCandidate?.location ?? "Fortaleza, CE"}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    className="h-10 rounded-2xl bg-slate-950 text-white hover:bg-slate-900"
                    onClick={() => onAnalyze?.(selectedCandidate?.id)}
                    type="button"
                  >
                    Analisar
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-2xl border-slate-200 bg-white"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </ShellCard>

            <ShellCard
              className={`p-5 ${
                showDossierSummary
                  ? "border-emerald-200 bg-emerald-50/70"
                  : ""
              }`}
            >
              {showDossierSummary ? (
                <>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Dossiê / modelo de dados
                  </div>
                  <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                    Dossiê solicitado
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Coleta e validação em andamento.
                  </p>
                  {dossierNotice ? (
                    <div className="mt-3 rounded-2xl border border-emerald-200 bg-white/70 px-3 py-2 text-xs leading-relaxed text-emerald-800">
                      {dossierNotice}
                    </div>
                  ) : null}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      ["Itens", dossierFulfillmentItems.length],
                      ["Em andamento", activeDossierItems.length],
                      ["Entregues", deliveredDossierItems.length],
                      ["Impacto alto", highImpactDossierItems.length],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/80 bg-white/78 px-3 py-2"
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          {label}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-950">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-white/78 px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                      Próxima etapa
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-950">
                      {nextDossierItem?.label ?? "Acompanhar coleta"}
                    </div>
                  </div>
                  <Button
                    className="mt-4 h-10 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-900"
                    onClick={() => onAnalyze?.(selectedCandidate?.id)}
                    type="button"
                  >
                    Ver em Analisar
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Pipeline do dossiê
                  </div>
                  <div className="mt-1 font-semibold text-slate-950">
                    Coleta e validação sob demanda
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Solicite o dossiê para acompanhar coleta, validação e entrega
                    dos dados.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "Prévia gratuita",
                      "Dossiê sob demanda",
                      "Dados verificados",
                      "Estimativas sinalizadas",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 h-10 w-full rounded-2xl border-slate-200 bg-white"
                    onClick={() => openDossierModal()}
                    type="button"
                  >
                    Solicitar dossiê do imóvel
                  </Button>
                </>
              )}
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
                    {candidateOptions.length}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Shortlist
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-950">
                    {Math.min(resultCount, 3)}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Melhor fit
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-950">
                    {bestFit || "—"}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Importados
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-950">
                    {importedCount}
                  </div>
                </div>
              </div>
            </ShellCard>
          </aside>
        </div>
      </div>
      <DossierRequestModal
        open={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        onConfirm={confirmDossierRequest}
        propertyName={`${selectedCandidate?.title ?? tramitaMockData.dossierRequestPackage.propertyName} · ${
          selectedCandidate?.location ??
          tramitaMockData.dossierRequestPackage.propertyLocation
        }`}
      />
    </div>
  );
}
