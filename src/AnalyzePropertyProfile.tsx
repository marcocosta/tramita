import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  FileText,
  LandPlot,
  Layers3,
  MapPin,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DossierFulfillmentPanel from "./components/DossierFulfillmentPanel";
import DossierRequestModal from "./components/DossierRequestModal";
import { tramitaMockData } from "./data/tramitaMockData";
import type {
  AnalysisSummary,
  Opportunity,
  Property,
  PropertyEvidenceDocument,
} from "./types/tramita";

const defaultSelectedProperty = tramitaMockData.selectedProperty;
const defaultAnalysisSummary = tramitaMockData.analysisSummary;
const dossierFulfillmentItems = tramitaMockData.dossierFulfillmentItems;

const riskSignals = [
  { label: "Matrícula", status: "Pendente", tone: "amber", text: "Anexar matrícula atualizada para validar titularidade e ônus." },
  { label: "IPTU", status: "Não verificado", tone: "slate", text: "Consultar cadastro municipal e débitos vinculados." },
  { label: "Plano diretor", status: "Atenção", tone: "amber", text: "Confirmar parâmetros urbanísticos e restrições locais." },
  { label: "Liquidez", status: "Favorável", tone: "green", text: "Região com demanda ativa e comparáveis próximos." },
];

const comparables = [
  { name: "Terreno A", distance: "450 m", area: "980 m²", price: "R$ 2.650/m²", score: "Alta" },
  { name: "Terreno B", distance: "800 m", area: "1.500 m²", price: "R$ 2.420/m²", score: "Média" },
  { name: "Terreno C", distance: "1,1 km", area: "1.100 m²", price: "R$ 2.790/m²", score: "Alta" },
];

function getSourceTone(source: (typeof tramitaMockData.propertySources)[number]) {
  if (source.statusLabel === "Recebido" || source.statusLabel === "Em revisão") {
    return "green" as const;
  }

  if (source.statusLabel === "A validar") {
    return "blue" as const;
  }

  if (source.sourceType === "banco") {
    return "slate" as const;
  }

  return "amber" as const;
}

const dataSources = tramitaMockData.propertySources.map((source) => ({
  source: source.source,
  status: source.statusLabel,
  confidence: source.confidence,
  provided: source.provided,
  nextValidation: source.nextValidation,
  tone: getSourceTone(source),
}));

const documentTypeLabels: Record<
  PropertyEvidenceDocument["documentType"],
  string
> = {
  matricula: "Matrícula",
  iptu: "IPTU",
  cadastro_municipal: "Cadastro municipal",
  plano_diretor: "Plano Diretor",
  certidao: "Certidão",
  contrato: "Contrato",
  foto: "Foto",
  mapa: "Mapa",
  laudo: "Laudo",
  outro: "Outro",
};

const evidenceStatusLabels: Record<
  PropertyEvidenceDocument["status"],
  string
> = {
  uploaded: "Recebido",
  pending_review: "Em revisão",
  validated: "Validado",
  rejected: "Rejeitado",
  expired: "Desatualizado",
};

const confidenceLabels: Record<PropertyEvidenceDocument["confidence"], string> =
  {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
    unknown: "A definir",
  };

function ShellCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[30px] border border-slate-200/80 bg-white/92 shadow-[0_12px_36px_rgba(15,23,42,0.07)] backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div>
      {eyebrow ? <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{eyebrow}</div> : null}
      <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{title}</div>
      {description ? <div className="mt-1 text-sm leading-relaxed text-slate-500">{description}</div> : null}
    </div>
  );
}

function ToneBadge({ tone, children }: { tone: "green" | "amber" | "red" | "slate" | "blue"; children: React.ReactNode }) {
  const map = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  };
  return <Badge className={`rounded-full border px-3 py-1 ${map[tone]}`}>{children}</Badge>;
}

function ScoreRow({ label, value, progress }: { label: string; value: string; progress: number }) {
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

function evidenceStatusTone(status: PropertyEvidenceDocument["status"]) {
  if (status === "validated") {
    return "green" as const;
  }

  if (status === "rejected" || status === "expired") {
    return "red" as const;
  }

  if (status === "pending_review") {
    return "amber" as const;
  }

  return "blue" as const;
}

function EvidenceDocumentsSection({
  documents,
}: {
  documents: PropertyEvidenceDocument[];
}) {
  return (
    <ShellCard className="p-6">
      <SectionTitle
        eyebrow="Evidências"
        title="Documentos e evidências do imóvel"
        description="Arquivos e registros recebidos ajudam a validar dados, reduzir incerteza e alimentar o dossiê."
      />
      {documents.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-sm leading-relaxed text-slate-500">
          Nenhuma evidência adicionada para este imóvel ainda.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {documents.map((document) => (
            <div
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              key={document.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-950">
                    {document.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {documentTypeLabels[document.documentType]} · {document.sourceLabel}
                  </div>
                </div>
                <ToneBadge tone={evidenceStatusTone(document.status)}>
                  {evidenceStatusLabels[document.status]}
                </ToneBadge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  Confiança: {confidenceLabels[document.confidence]}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {new Date(document.uploadedAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              {document.fileName ? (
                <div className="mt-3 text-sm text-slate-500">
                  Arquivo: {document.fileName}
                </div>
              ) : null}
              {document.unlocks.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {document.unlocks.map((unlock) => (
                    <span
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      key={unlock}
                    >
                      {unlock}
                    </span>
                  ))}
                </div>
              ) : null}
              {document.notes ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {document.notes}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </ShellCard>
  );
}

type AnalyzePropertyProfileProps = {
  analysisSummary?: AnalysisSummary;
  dossierRequested?: boolean;
  evidenceDocuments?: PropertyEvidenceDocument[];
  onBackToDiscover?: () => void;
  onRequestDossier?: (propertyId: string) => void;
  onStartDueDiligence?: () => void;
  selectedOpportunity?: Opportunity;
  selectedProperty?: Property;
};

export default function TramitaAnalyzePropertyProfile({
  analysisSummary = defaultAnalysisSummary,
  dossierRequested = false,
  evidenceDocuments = [],
  onBackToDiscover,
  onRequestDossier,
  onStartDueDiligence,
  selectedOpportunity,
  selectedProperty = defaultSelectedProperty,
}: AnalyzePropertyProfileProps) {
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [dossierNotice, setDossierNotice] = useState<string | null>(null);
  const facts = selectedProperty.facts.map(
    ({ label, value }) => [label, value] as const,
  );
  const isImportedOpportunity =
    selectedOpportunity?.status === "Importado" ||
    selectedOpportunity?.imported === true ||
    selectedOpportunity?.id.startsWith("imported-") === true;
  const availabilityConfidence = {
    low: 38,
    medium: 58,
    high: 72,
  } as const;
  const availabilityLabels = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  } as const;
  const showDossierRequested = dossierRequested || Boolean(dossierNotice);
  const modalPropertyName = selectedOpportunity
    ? `${selectedOpportunity.title} · ${selectedOpportunity.location}`
    : `${tramitaMockData.dossierRequestPackage.propertyName} · ${tramitaMockData.dossierRequestPackage.propertyLocation}`;

  function confirmDossierRequest() {
    setDossierModalOpen(false);
    onRequestDossier?.(selectedProperty.id);
    setDossierNotice(
      "Solicitação criada. O dossiê aparece como solicitado neste protótipo.",
    );
  }

  if (isImportedOpportunity && selectedOpportunity) {
    const confidence =
      availabilityConfidence[selectedOpportunity.dataAvailability];
    const importedFacts = [
      ["Área", selectedOpportunity.areaLabel],
      ["Tipo", selectedOpportunity.assetType],
      ["Região", selectedOpportunity.region],
      ["Cidade", selectedOpportunity.city],
      ["Estado", selectedOpportunity.state],
      ["Fonte", selectedOpportunity.sourceLabel ?? selectedOpportunity.primarySourceLabel],
      ["Disponibilidade", availabilityLabels[selectedOpportunity.dataAvailability]],
      [
        "Valor",
        selectedOpportunity.value ??
          selectedOpportunity.valueRange ??
          selectedOpportunity.estimatedValueRange ??
          selectedOpportunity.askingPrice ??
          "A estimar",
      ],
      ["Matrícula", "Pendente"],
      ["IPTU", "Pendente"],
      ["Zona", "A confirmar"],
    ] as const;
    const importedSources = [
      {
        source: "Fonte principal",
        status: "Informado",
        confidence: availabilityLabels[selectedOpportunity.dataAvailability],
        provided:
          "localização, área, tipo, uso alvo e preço/faixa quando houver",
        nextValidation: "solicitar dossiê",
        tone: "blue" as const,
      },
      {
        source: "Cartório/matrícula",
        status: "Pendente",
        confidence: "A definir",
        provided: "titularidade, ônus e histórico dominial",
        nextValidation: "solicitar matrícula atualizada",
        tone: "amber" as const,
      },
      {
        source: "Prefeitura/IPTU",
        status: "Pendente",
        confidence: "A definir",
        provided: "cadastro municipal, área fiscal e débitos",
        nextValidation: "consultar cadastro municipal",
        tone: "amber" as const,
      },
      {
        source: "Plano Diretor",
        status: "A validar",
        confidence: "Média",
        provided: "uso permitido, coeficiente, recuos e altura",
        nextValidation: "confirmar parâmetros oficiais",
        tone: "slate" as const,
      },
      {
        source: "Comparáveis",
        status: "A validar",
        confidence: "Média",
        provided: "faixa revisada e liquidez",
        nextValidation: "buscar comparáveis próximos",
        tone: "slate" as const,
      },
      {
        source: "Jurídico",
        status: "Pendente",
        confidence: "A definir",
        provided: "risco documental e ressalvas",
        nextValidation: "abrir pré-diligência",
        tone: "amber" as const,
      },
    ];

    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.07),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-4 md:px-8 md:py-6">
        <div className="mx-auto max-w-[1480px] space-y-6">
          <ShellCard className="relative overflow-hidden p-5 md:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(15,23,42,0.06),transparent_24%),radial-gradient(circle_at_90%_12%,rgba(180,83,9,0.06),transparent_24%)]" />
            <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <div className="flex flex-wrap gap-2">
                  <ToneBadge tone="blue">Análise preliminar</ToneBadge>
                  <ToneBadge tone="slate">Dados importados</ToneBadge>
                  <ToneBadge tone="amber">Dossiê recomendado</ToneBadge>
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                  {selectedOpportunity.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                  {selectedOpportunity.areaLabel} · {selectedOpportunity.assetType} · {selectedOpportunity.region}, {selectedOpportunity.city} - {selectedOpportunity.state}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  [
                    "Valor estimado",
                    selectedOpportunity.value ??
                      selectedOpportunity.valueRange ??
                      selectedOpportunity.estimatedValueRange ??
                      "A estimar",
                  ],
                  ["Centro da faixa", "A definir"],
                  ["Confiança", `${confidence}%`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {label}
                    </div>
                    <div className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-5 rounded-[26px] border border-slate-200 bg-white/88 p-4 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-800">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Tramita insight
                  </div>
                  <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                    Análise preliminar baseada em dados importados.
                  </div>
                  <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
                    Este ativo foi adicionado por entrada manual, parceiro ou CSV. O Tramita usa os dados disponíveis para criar uma leitura inicial, mas matrícula, cadastro municipal, parâmetros urbanísticos e comparáveis ainda precisam ser validados.
                  </p>
                </div>
              </div>
            </div>
          </ShellCard>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <main className="space-y-6">
              <ShellCard className="p-6">
                <SectionTitle
                  eyebrow="Localização"
                  title="Localização informada"
                  description="Coordenadas e origem declaradas pela fonte importada."
                />
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                  {[
                    ["Região", selectedOpportunity.region],
                    ["Cidade", selectedOpportunity.city],
                    ["Estado", selectedOpportunity.state],
                    ["Latitude", String(selectedOpportunity.lat)],
                    ["Longitude", String(selectedOpportunity.lng)],
                    ["Fonte", selectedOpportunity.sourceLabel ?? selectedOpportunity.primarySourceLabel],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
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
                <div className="mt-5 rounded-[26px] border border-amber-200 bg-amber-50 p-5">
                  <div className="font-semibold text-amber-950">
                    Perímetro ainda não validado
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-amber-800">
                    A localização foi informada pelo parceiro ou por entrada manual. O dossiê deve confirmar perímetro, titularidade, cadastro municipal e parâmetros urbanísticos.
                  </p>
                </div>
              </ShellCard>

              <ShellCard className="p-6">
                <SectionTitle
                  eyebrow="Dados importados"
                  title="Dados principais"
                  description="Informações disponíveis para a primeira leitura do ativo."
                />
                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {importedFacts.map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
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
              </ShellCard>

              <ShellCard className="p-6">
                <SectionTitle
                  eyebrow="Proveniência"
                  title="Fontes e confiabilidade dos dados"
                  description="A prévia separa dado informado, dado pendente e validação necessária."
                />
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {importedSources.map((source) => (
                    <div
                      key={source.source}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-semibold text-slate-950">
                          {source.source}
                        </div>
                        <ToneBadge tone={source.tone}>{source.status}</ToneBadge>
                      </div>
                      <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Confiança: {source.confidence}
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-600">
                        Dados fornecidos: {source.provided}
                      </div>
                      <div className="mt-2 text-sm leading-relaxed text-slate-500">
                        Próxima validação: {source.nextValidation}
                      </div>
                    </div>
                  ))}
                </div>
                {showDossierRequested ? (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-800">
                    {dossierNotice ??
                      "Dossiê solicitado para este ativo. O pipeline abaixo mostra a simulação de coleta e validação."}
                  </div>
                ) : null}
              </ShellCard>

              <EvidenceDocumentsSection documents={evidenceDocuments} />

              <DossierFulfillmentPanel items={dossierFulfillmentItems} compact />
            </main>

            <aside className="space-y-6 lg:sticky lg:top-8">
              <ShellCard className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Tramita scorecard
                    </div>
                    <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                      Prévia importada
                    </div>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Leitura inicial baseada em dados informados. A confiança sobe com validações oficiais e comparáveis.
                </p>
                <div className="mt-6 space-y-5">
                  <ScoreRow
                    label="Fit"
                    value={`${selectedOpportunity.fitScore}/100`}
                    progress={selectedOpportunity.fitScore}
                  />
                  <ScoreRow
                    label="Confiança"
                    value={`${confidence}%`}
                    progress={confidence}
                  />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-amber-600">
                      Risco
                    </div>
                    <div className="mt-1 font-semibold text-amber-950">
                      {selectedOpportunity.riskLabel}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      Dados
                    </div>
                    <div className="mt-1 font-semibold text-slate-950">
                      {availabilityLabels[selectedOpportunity.dataAvailability]}
                    </div>
                  </div>
                </div>
              </ShellCard>

              <ShellCard className="p-6">
                <SectionTitle
                  title="Dados necessários"
                  description="Itens que transformam a prévia em análise verificável."
                />
                <div className="mt-5 space-y-3">
                  {[
                    ["Matrícula atualizada", "Alto"],
                    ["Cadastro/IPTU municipal", "Médio"],
                    ["Parâmetros urbanísticos", "Alto"],
                    ["Comparáveis revisados", "Médio"],
                  ].map(([label, impact]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-slate-950">
                          {label}
                        </div>
                        <ToneBadge tone={impact === "Alto" ? "amber" : "slate"}>
                          Impacto: {impact}
                        </ToneBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </ShellCard>

              <ShellCard className="p-6">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-950">
                      Recomendação Tramita
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      Vale solicitar dossiê antes de avançar. A prévia indica possível encaixe com a tese, mas os principais dados ainda dependem de validação.
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <Button
                    className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-900"
                    onClick={() => setDossierModalOpen(true)}
                  >
                    Solicitar dossiê
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {onBackToDiscover ? (
                    <Button
                      variant="outline"
                      className="h-12 w-full rounded-2xl border-slate-200 bg-white"
                      onClick={onBackToDiscover}
                    >
                      Voltar para Descobrir
                    </Button>
                  ) : null}
                </div>
              </ShellCard>

              <ShellCard className="p-6">
                <SectionTitle
                  title="Histórico"
                  description="Eventos relevantes da análise preliminar."
                />
                <div className="mt-5 space-y-4">
                  {[
                    ["Hoje", "Ativo importado por entrada manual, parceiro ou CSV."],
                    ["Hoje", "Prévia criada com os dados disponíveis."],
                    ["Pendente", "Aguardando dossiê para validação documental."],
                  ].map(([date, text]) => (
                    <div key={text} className="flex gap-3">
                      <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div>
                        <div className="text-xs font-medium text-slate-500">
                          {date}
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-slate-700">
                          {text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ShellCard>
            </aside>
          </div>
        </div>
        <DossierRequestModal
          open={dossierModalOpen}
          onClose={() => setDossierModalOpen(false)}
          onConfirm={confirmDossierRequest}
          propertyName={modalPropertyName}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.07),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <ShellCard className="relative overflow-hidden p-5 md:p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(180,83,9,0.06),transparent_23%),radial-gradient(circle_at_90%_10%,rgba(15,23,42,0.06),transparent_25%)]" />
          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <ToneBadge tone="blue">Análise preliminar</ToneBadge>
                <ToneBadge tone="green">Confiança média-alta</ToneBadge>
                <ToneBadge tone="amber">Potencial de incorporação</ToneBadge>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">{selectedProperty.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                {selectedProperty.areaLabel} · Zona urbana consolidada · Próximo à Av. Santos Dumont · {selectedProperty.city}, {selectedProperty.state}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Valor estimado", analysisSummary.estimatedValueRange],
                ["Centro da faixa", analysisSummary.valueCenter],
                ["Confiança", analysisSummary.confidenceLabel],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</div>
                  <div className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-5 rounded-[26px] border border-slate-200 bg-white/88 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-800">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Tramita insight</div>
                <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">Oportunidade promissora, com validação documental pendente.</div>
                <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
                  Valor e potencial urbanístico parecem defensáveis, mas matrícula, IPTU e parâmetros oficiais ainda precisam ser confirmados antes de uma oferta vinculante.
                </p>
              </div>
            </div>
          </div>
        </ShellCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-6">
            <ShellCard className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_0.55fr]">
                <div className="relative min-h-[350px] overflow-hidden bg-slate-900">
                  <div className="absolute inset-0 opacity-95 bg-[linear-gradient(135deg,#dbeafe_0%,#f8fafc_34%,#e2e8f0_35%,#f8fafc_40%,#bfdbfe_100%)]" />
                  <div className="absolute left-0 top-[34%] h-4 w-full rotate-[-7deg] bg-white/55 shadow-sm" />
                  <div className="absolute bottom-[22%] left-[6%] h-3 w-[92%] rotate-[8deg] bg-slate-200/65" />
                  <div className="absolute left-[64%] top-0 h-full w-4 rotate-[15deg] bg-blue-100/70" />
                  <div className="absolute left-[18%] top-[14%] h-[70%] w-[58%] rotate-[-8deg] rounded-[36px] border-2 border-slate-950/60 bg-white/25 shadow-[0_0_0_999px_rgba(15,23,42,0.05)]" />
                  <div className="absolute left-[42%] top-[45%] flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="absolute left-[22%] top-[19%] rounded-full border border-slate-300 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">Perímetro preliminar</div>
                  <div className="absolute right-[9%] top-[31%] rounded-full border border-blue-100 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">Eixo comercial próximo</div>
                  <div className="absolute left-[10%] bottom-[28%] rounded-full border border-amber-100 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">Zona a confirmar</div>
                  <div className="absolute right-[12%] bottom-[18%] rounded-full border border-emerald-100 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">Comparáveis próximos</div>
                  <div className="absolute bottom-5 left-5 rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
                    <div className="text-sm font-semibold text-slate-950">Meireles · Fortaleza</div>
                    <div className="text-xs text-slate-500">Mapa conceitual · perímetro aproximado</div>
                  </div>
                  <div className="absolute right-5 top-5 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">Camada urbana preliminar</div>
                </div>

                <div className="space-y-3 p-4">
                  {[
                    { icon: LandPlot, title: "Perímetro do lote", text: "Leitura preliminar, sujeita à matrícula" },
                    { icon: Building2, title: "Entorno ativo", text: "Eixo comercial e novos empreendimentos" },
                    { icon: Layers3, title: "Plano Diretor", text: "Coeficiente, uso e recuos a confirmar" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                            <Icon className="h-5 w-5 text-slate-700" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                            <div className="mt-1 text-sm text-slate-500">{item.text}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle eyebrow="Dados do imóvel" title="Dados principais" description="Informações base para leitura de valor, potencial e risco." />
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {facts.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-none">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-950">{value}</div>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                eyebrow="Proveniência"
                title="Fontes e confiabilidade dos dados"
                description="Cada dado usado na análise mantém origem, status e confiança. Informação desconhecida não é tratada como problema; ela vira pendência explícita."
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {["Verificado", "Estimado", "Pendente", "Divergente"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {dataSources.map((source) => (
                  <div
                    key={source.source}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-slate-950">
                        {source.source}
                      </div>
                      <ToneBadge tone={source.tone}>{source.status}</ToneBadge>
                    </div>
                    <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Confiança: {source.confidence}
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-slate-600">
                      Dados fornecidos: {source.provided}
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-slate-500">
                      Próxima validação: {source.nextValidation}
                    </div>
                  </div>
                ))}
              </div>
              {showDossierRequested ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-800">
                  {dossierNotice ??
                    "Dossiê solicitado para este ativo. O pipeline abaixo mostra a simulação de coleta e validação."}
                </div>
              ) : null}
              <Button
                variant="outline"
                className="mt-5 h-11 rounded-2xl border-slate-200 bg-white px-5"
                onClick={() => setDossierModalOpen(true)}
              >
                Solicitar dossiê
              </Button>
            </ShellCard>

            <EvidenceDocumentsSection documents={evidenceDocuments} />

            <DossierFulfillmentPanel items={dossierFulfillmentItems} compact />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ShellCard className="p-6">
                <SectionTitle eyebrow="Insight principal" title="Valor estimado" description="Faixa defensável, não número absoluto." />
                <div className="mt-6 rounded-[26px] border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 p-5">
                  <div className="text-sm text-slate-500">Faixa estimada</div>
                  <div className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">R$ 2,8M – R$ 3,4M</div>
                  <div className="mt-2 text-sm text-slate-500">Centro da faixa: <span className="font-semibold text-slate-800">R$ 3,1M</span></div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">R$/m²</div>
                      <div className="mt-1 text-lg font-semibold text-slate-950">R$ 2.500</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Comparáveis</div>
                      <div className="mt-1 text-lg font-semibold text-slate-950">12 ativos</div>
                    </div>
                  </div>
                </div>
              </ShellCard>

              <ShellCard className="p-6">
                <SectionTitle eyebrow="Contexto" title="Contexto de mercado" description="Leitura rápida de liquidez e referência de preço." />
                <div className="mt-5 space-y-3">
                  {comparables.map((item) => (
                    <div key={item.name} className="grid grid-cols-[1fr_auto] gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <div>
                        <div className="font-semibold text-slate-950">{item.name}</div>
                        <div className="mt-1 text-sm text-slate-500">{item.distance} · {item.area} · {item.price}</div>
                      </div>
                      <ToneBadge tone={item.score === "Alta" ? "green" : "slate"}>{item.score}</ToneBadge>
                    </div>
                  ))}
                </div>
              </ShellCard>
            </div>

            <ShellCard className="p-6">
              <SectionTitle eyebrow="Insight principal" title="Potencial urbanístico" description="O que o ativo pode se tornar, sujeito à confirmação urbanística." />
              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[26px] border border-emerald-200 bg-emerald-50 p-5">
                  <div className="text-sm text-emerald-700">Potencial preliminar</div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight text-emerald-950">Alto</div>
                  <p className="mt-3 text-sm leading-relaxed text-emerald-800">
                    Compatível com tese de incorporação residencial ou uso misto, sujeito à confirmação do Plano Diretor e dos parâmetros municipais.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    "Lote compatível com incorporação em área urbana consolidada, sujeito à confirmação de uso permitido.",
                    "Entorno indica demanda por verticalização residencial e serviços, com liquidez acima da média local.",
                    "Validar coeficiente de aproveitamento, taxa de ocupação, recuos e altura máxima antes de precificar uma tese vinculante.",
                  ].map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div className="text-sm leading-relaxed text-slate-700">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle eyebrow="Risco" title="Sinais de risco e validação" description="Separando problema encontrado, dado pendente e sinal favorável." />
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {riskSignals.map((risk) => (
                  <div key={risk.label} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-slate-950">{risk.label}</div>
                      <ToneBadge tone={risk.tone as "green" | "amber" | "slate"}>{risk.status}</ToneBadge>
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-slate-500">{risk.text}</div>
                  </div>
                ))}
              </div>
            </ShellCard>
          </main>

          <aside className="space-y-6 lg:sticky lg:top-8">
            <ShellCard className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Tramita scorecard</div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Oportunidade promissora</div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">Boa combinação de valor, localização e potencial. Validação documental ainda é necessária.</p>
              <div className="mt-6 space-y-5">
                <ScoreRow
                  label="Valor"
                  value={`${analysisSummary.valueScore}/100`}
                  progress={analysisSummary.valueScore}
                />
                <ScoreRow
                  label="Potencial"
                  value={`${analysisSummary.potentialScore}/100`}
                  progress={analysisSummary.potentialScore}
                />
                <ScoreRow
                  label="Confiança"
                  value={`${analysisSummary.confidenceScore}%`}
                  progress={analysisSummary.confidenceScore}
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-amber-600">Risco</div>
                  <div className="mt-1 font-semibold text-amber-950">Médio</div>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-emerald-600">Liquidez</div>
                  <div className="mt-1 font-semibold text-emerald-950">Média-alta</div>
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle title="Dados necessários" description="Itens que aumentam a confiança da análise." />
              <div className="mt-5 space-y-3">
                {[
                  { icon: FileText, label: "Matrícula atualizada", subtitle: "Valida titularidade, ônus e histórico dominial", impact: "Alto", tone: "amber" as const, action: "Anexar" },
                  { icon: Building2, label: "Cadastro/IPTU municipal", subtitle: "Confirma situação fiscal e vínculo cadastral", impact: "Médio", tone: "slate" as const, action: "Consultar" },
                  { icon: Layers3, label: "Parâmetros urbanísticos", subtitle: "Confirma coeficiente, uso permitido, recuos e altura", impact: "Alto", tone: "amber" as const, action: "Validar" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="flex items-start gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                        <Icon className="h-5 w-5 text-slate-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-950">{item.label}</div>
                        <div className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.subtitle}</div>
                        <div className="mt-2">
                          <ToneBadge tone={item.tone}>Impacto: {item.impact}</ToneBadge>
                        </div>
                      </div>
                      <Button variant="ghost" className="shrink-0 rounded-xl px-2.5 text-xs">{item.action}</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-950">Recomendação Tramita</div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">Vale aprofundar a diligência. O ativo parece defensável, mas matrícula, IPTU e parâmetros urbanísticos devem ser confirmados antes de oferta vinculante.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <Button
                  className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-900"
                  onClick={onStartDueDiligence}
                >
                  Iniciar due diligence
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-12 w-full rounded-2xl border-slate-200 bg-white">
                  <Upload className="mr-2 h-4 w-4" />
                  Anexar documentos
                </Button>
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle title="Histórico" description="Eventos relevantes da análise." />
              <div className="mt-5 space-y-4">
                {[
                  ["Hoje", "Perfil criado a partir de endereço e dados manuais."],
                  ["Hoje", "Comparáveis preliminares identificados."],
                  ["Pendente", "Aguardando matrícula e IPTU para validação."],
                ].map(([date, text]) => (
                  <div key={text} className="flex gap-3">
                    <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <div className="text-xs font-medium text-slate-500">{date}</div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-700">{text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>
          </aside>
        </div>
      </div>
      <DossierRequestModal
        open={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        onConfirm={confirmDossierRequest}
        propertyName={modalPropertyName}
      />
    </div>
  );
}
