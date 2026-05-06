import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  FileText,
  FileSpreadsheet,
  PlusCircle,
  UploadCloud,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  ImportedOpportunityInput,
  Opportunity,
  PropertyEvidenceDocument,
  PropertyEvidenceDocumentInput,
  SourceType,
} from "./types/tramita";

const sourceTypeOptions: Array<{ value: SourceType; label: string }> = [
  { value: "corretor", label: "Corretor" },
  { value: "proprietario", label: "Proprietário" },
  { value: "incorporador", label: "Incorporador" },
  { value: "juridico", label: "Jurídico" },
  { value: "banco", label: "Banco" },
  { value: "upload", label: "Upload manual" },
  { value: "partner", label: "Parceiro" },
  { value: "future_api", label: "API futura" },
];

const sourceTypeValues = sourceTypeOptions.map((option) => option.value);

const dataAvailabilityLabels: Record<
  ImportedOpportunityInput["dataAvailability"],
  string
> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const documentTypeOptions: Array<{
  value: PropertyEvidenceDocument["documentType"];
  label: string;
}> = [
  { value: "matricula", label: "Matrícula" },
  { value: "iptu", label: "IPTU" },
  { value: "cadastro_municipal", label: "Cadastro municipal" },
  { value: "plano_diretor", label: "Plano Diretor" },
  { value: "certidao", label: "Certidão" },
  { value: "contrato", label: "Contrato" },
  { value: "foto", label: "Foto" },
  { value: "mapa", label: "Mapa" },
  { value: "laudo", label: "Laudo" },
  { value: "outro", label: "Outro" },
];

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

type IntakeFormState = {
  title: string;
  state: string;
  city: string;
  region: string;
  address: string;
  lat: string;
  lng: string;
  assetType: string;
  areaM2: string;
  estimatedValueRange: string;
  askingPrice: string;
  targetUse: string;
  sourceLabel: string;
  sourceType: SourceType;
  dataAvailability: ImportedOpportunityInput["dataAvailability"];
  notes: string;
};

const initialForm: IntakeFormState = {
  title: "",
  state: "Ceará",
  city: "Fortaleza",
  region: "",
  address: "",
  lat: "",
  lng: "",
  assetType: "Terreno urbano",
  areaM2: "",
  estimatedValueRange: "",
  askingPrice: "",
  targetUse: "Residencial|Uso misto",
  sourceLabel: "",
  sourceType: "upload",
  dataAvailability: "medium",
  notes: "",
};

type PropertyIntakeScreenProps = {
  evidenceDocuments?: PropertyEvidenceDocument[];
  importedOpportunities: Opportunity[];
  onAddEvidenceDocument?: (input: PropertyEvidenceDocumentInput) => void;
  onAddOpportunity?: (input: ImportedOpportunityInput) => void;
  onGoDiscover?: (opportunityId?: string) => void;
  onImportOpportunities?: (inputs: ImportedOpportunityInput[]) => void;
};

type EvidenceFormState = {
  propertyId: string;
  title: string;
  documentType: PropertyEvidenceDocument["documentType"];
  sourceType: SourceType;
  sourceLabel: string;
  status: PropertyEvidenceDocument["status"];
  confidence: PropertyEvidenceDocument["confidence"];
  fileName: string;
  unlocks: string;
  notes: string;
};

const initialEvidenceForm: EvidenceFormState = {
  propertyId: "",
  title: "",
  documentType: "matricula",
  sourceType: "upload",
  sourceLabel: "",
  status: "uploaded",
  confidence: "unknown",
  fileName: "",
  unlocks: "titularidade, ônus, situação fiscal",
  notes: "",
};

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
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function splitTargetUse(value: string) {
  return value
    .split(/[|,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isSourceType(value: string): value is SourceType {
  return sourceTypeValues.includes(value as SourceType);
}

function toInput(form: IntakeFormState): ImportedOpportunityInput | null {
  const lat = Number(form.lat);
  const lng = Number(form.lng);
  const areaM2 = Number(form.areaM2);

  if (
    !form.title.trim() ||
    !form.state.trim() ||
    !form.city.trim() ||
    !form.region.trim() ||
    Number.isNaN(lat) ||
    Number.isNaN(lng) ||
    !form.assetType.trim() ||
    !areaM2 ||
    !form.sourceLabel.trim()
  ) {
    return null;
  }

  return {
    title: form.title.trim(),
    state: form.state.trim(),
    city: form.city.trim(),
    region: form.region.trim(),
    address: form.address.trim() || undefined,
    lat,
    lng,
    assetType: form.assetType.trim(),
    areaM2,
    estimatedValueRange: form.estimatedValueRange.trim() || undefined,
    askingPrice: form.askingPrice.trim() || undefined,
    targetUse: splitTargetUse(form.targetUse),
    sourceLabel: form.sourceLabel.trim(),
    sourceType: form.sourceType,
    dataAvailability: form.dataAvailability,
    notes: form.notes.trim() || undefined,
  };
}

function parseCsv(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { inputs: [] as ImportedOpportunityInput[], skipped: 0 };
  }

  const headers = lines[0].split(",").map((header) => header.trim());
  const inputs: ImportedOpportunityInput[] = [];
  let skipped = 0;

  for (const line of lines.slice(1)) {
    const values = line.split(",").map((value) => value.trim());
    const row = headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});

    const sourceType = isSourceType(row.sourceType) ? row.sourceType : "upload";
    const dataAvailability = ["low", "medium", "high"].includes(
      row.dataAvailability,
    )
      ? (row.dataAvailability as ImportedOpportunityInput["dataAvailability"])
      : "medium";
    const candidate: IntakeFormState = {
      title: row.title ?? "",
      state: row.state ?? "",
      city: row.city ?? "",
      region: row.region ?? "",
      address: row.address ?? "",
      lat: row.lat ?? "",
      lng: row.lng ?? "",
      assetType: row.assetType ?? "",
      areaM2: row.areaM2 ?? "",
      estimatedValueRange: row.estimatedValueRange ?? "",
      askingPrice: row.askingPrice ?? "",
      targetUse: row.targetUse ?? "",
      sourceLabel: row.sourceLabel ?? "",
      sourceType,
      dataAvailability,
      notes: row.notes ?? "",
    };
    const input = toInput(candidate);

    if (input) {
      inputs.push(input);
    } else {
      skipped += 1;
    }
  }

  return { inputs, skipped };
}

export default function PropertyIntakeScreen({
  evidenceDocuments = [],
  importedOpportunities,
  onAddEvidenceDocument,
  onAddOpportunity,
  onGoDiscover,
  onImportOpportunities,
}: PropertyIntakeScreenProps) {
  const [form, setForm] = useState<IntakeFormState>(initialForm);
  const [evidenceForm, setEvidenceForm] =
    useState<EvidenceFormState>(initialEvidenceForm);
  const [notice, setNotice] = useState<string | null>(null);
  const [evidenceNotice, setEvidenceNotice] = useState<string | null>(null);
  const [csvText, setCsvText] = useState("");

  function updateForm<K extends keyof IntakeFormState>(
    key: K,
    value: IntakeFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateEvidenceForm<K extends keyof EvidenceFormState>(
    key: K,
    value: EvidenceFormState[K],
  ) {
    setEvidenceForm((current) => ({ ...current, [key]: value }));
  }

  function getEvidenceCount(propertyId: string) {
    return evidenceDocuments.filter((document) => document.propertyId === propertyId)
      .length;
  }

  function handleSubmit() {
    const input = toInput(form);

    if (!input) {
      setNotice("Preencha os campos obrigatórios para adicionar a oportunidade.");
      return;
    }

    onAddOpportunity?.(input);
    setForm(initialForm);
    setNotice("Oportunidade adicionada ao Descobrir.");
  }

  function handleCsvImport() {
    const { inputs, skipped } = parseCsv(csvText);

    if (inputs.length === 0) {
      setNotice("Nenhuma oportunidade válida encontrada no CSV.");
      return;
    }

    onImportOpportunities?.(inputs);
    setCsvText("");
    setNotice(
      `${inputs.length} oportunidade${
        inputs.length === 1 ? "" : "s"
      } importada${inputs.length === 1 ? "" : "s"}.${
        skipped ? ` ${skipped} linha${skipped === 1 ? "" : "s"} ignorada${skipped === 1 ? "" : "s"}.` : ""
      }`,
    );
  }

  function handleEvidenceSubmit() {
    const propertyId =
      evidenceForm.propertyId || importedOpportunities[0]?.propertyId || "";

    if (
      !propertyId ||
      !evidenceForm.title.trim() ||
      !evidenceForm.documentType ||
      !evidenceForm.sourceLabel.trim()
    ) {
      setEvidenceNotice(
        "Preencha imóvel, título, tipo de documento e fonte/provedor.",
      );
      return;
    }

    onAddEvidenceDocument?.({
      propertyId,
      title: evidenceForm.title.trim(),
      documentType: evidenceForm.documentType,
      sourceType: evidenceForm.sourceType,
      sourceLabel: evidenceForm.sourceLabel.trim(),
      status: evidenceForm.status,
      confidence: evidenceForm.confidence,
      fileName: evidenceForm.fileName.trim() || undefined,
      notes: evidenceForm.notes.trim() || undefined,
      unlocks: evidenceForm.unlocks
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
    setEvidenceForm({ ...initialEvidenceForm, propertyId });
    setEvidenceNotice("Evidência adicionada ao dossiê do imóvel.");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.07),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <ShellCard className="relative overflow-hidden p-6 md:p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(15,23,42,0.06),transparent_24%),radial-gradient(circle_at_92%_12%,rgba(20,83,45,0.06),transparent_24%)]" />
          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
                  Upload parceiro
                </Badge>
                <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                  Cadastro manual
                </Badge>
                <Badge className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">
                  Pronto para APIs futuras
                </Badge>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Entrada de dados do imóvel
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                Adicione oportunidades manualmente ou por CSV para alimentar o
                Descobrir, Analisar, dossiês e transações.
              </p>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white/86 p-5 shadow-sm">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Intake foundation
                  </div>
                  <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                    Dados recebidos viram oportunidades filtráveis.
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Cada registro importado entra no mapa, na lista de
                    candidatos e no fluxo de dossiê sob demanda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ShellCard>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <main className="space-y-6">
            <ShellCard className="p-5 md:p-6">
              <SectionTitle
                eyebrow="Cadastro manual"
                title="Adicionar oportunidade"
                description="Campos essenciais para colocar um imóvel no Descobrir e no mapa."
              />

              {notice ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  {notice}
                </div>
              ) : null}

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  ["title", "Nome/título", "Terreno · Dionísio Torres"],
                  ["state", "Estado", "Ceará"],
                  ["city", "Cidade", "Fortaleza"],
                  ["region", "Região/bairro", "Dionísio Torres"],
                  ["address", "Endereço", "Rua exemplo, 120"],
                  ["lat", "Latitude", "-3.7442"],
                  ["lng", "Longitude", "-38.5128"],
                  ["assetType", "Tipo de ativo", "Terreno urbano"],
                  ["areaM2", "Área m²", "1280"],
                  ["estimatedValueRange", "Faixa de valor estimada", "R$ 2,6M–3,1M"],
                  ["askingPrice", "Preço pedido", "R$ 2,9M"],
                  ["targetUse", "Uso alvo", "Residencial|Uso misto"],
                  ["sourceLabel", "Fonte/provedor", "Parceiro local"],
                ].map(([key, label, placeholder]) => (
                  <label
                    className="rounded-2xl border border-slate-200 bg-white p-3"
                    key={key}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {label}
                    </span>
                    <Input
                      className="mt-2 h-10 rounded-xl border-slate-200 bg-slate-50 text-sm"
                      onChange={(event) =>
                        updateForm(
                          key as keyof IntakeFormState,
                          event.target.value as IntakeFormState[keyof IntakeFormState],
                        )
                      }
                      placeholder={placeholder}
                      type={["lat", "lng", "areaM2"].includes(key) ? "number" : "text"}
                      value={String(form[key as keyof IntakeFormState])}
                    />
                  </label>
                ))}

                <label className="rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Tipo de fonte
                  </span>
                  <select
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none"
                    onChange={(event) =>
                      updateForm("sourceType", event.target.value as SourceType)
                    }
                    value={form.sourceType}
                  >
                    {sourceTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Disponibilidade de dados
                  </span>
                  <select
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none"
                    onChange={(event) =>
                      updateForm(
                        "dataAvailability",
                        event.target
                          .value as ImportedOpportunityInput["dataAvailability"],
                      )
                    }
                    value={form.dataAvailability}
                  >
                    {Object.entries(dataAvailabilityLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3 md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Observações
                  </span>
                  <textarea
                    className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none"
                    onChange={(event) => updateForm("notes", event.target.value)}
                    placeholder="Dados recebidos do parceiro, pendências conhecidas ou contexto comercial."
                    value={form.notes}
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-900"
                  onClick={handleSubmit}
                  type="button"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar oportunidade
                </Button>
                <div className="text-sm text-slate-500">
                  Obrigatórios: título, estado, cidade, região, coordenadas,
                  tipo, área e fonte.
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-5 md:p-6">
              <SectionTitle
                eyebrow="Evidências"
                title="Documentos e evidências"
                description="Adicione metadados de documentos recebidos do parceiro. Nesta versão, os arquivos não são enviados para backend; o portal registra nome, tipo, fonte, status e finalidade."
              />

              {evidenceNotice ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  {evidenceNotice}
                </div>
              ) : null}

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="rounded-2xl border border-slate-200 bg-white p-3 md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Imóvel
                  </span>
                  <select
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none"
                    disabled={importedOpportunities.length === 0}
                    onChange={(event) =>
                      updateEvidenceForm("propertyId", event.target.value)
                    }
                    value={
                      evidenceForm.propertyId ||
                      importedOpportunities[0]?.propertyId ||
                      ""
                    }
                  >
                    {importedOpportunities.length === 0 ? (
                      <option value="">Cadastre uma oportunidade primeiro</option>
                    ) : null}
                    {importedOpportunities.map((opportunity) => (
                      <option key={opportunity.propertyId} value={opportunity.propertyId}>
                        {opportunity.title} · {opportunity.region}, {opportunity.city}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Título do documento
                  </span>
                  <Input
                    className="mt-2 h-10 rounded-xl border-slate-200 bg-slate-50 text-sm"
                    onChange={(event) =>
                      updateEvidenceForm("title", event.target.value)
                    }
                    placeholder="Matrícula atualizada"
                    value={evidenceForm.title}
                  />
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Tipo de documento
                  </span>
                  <select
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none"
                    onChange={(event) =>
                      updateEvidenceForm(
                        "documentType",
                        event.target.value as PropertyEvidenceDocument["documentType"],
                      )
                    }
                    value={evidenceForm.documentType}
                  >
                    {documentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Tipo de fonte
                  </span>
                  <select
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none"
                    onChange={(event) =>
                      updateEvidenceForm("sourceType", event.target.value as SourceType)
                    }
                    value={evidenceForm.sourceType}
                  >
                    {sourceTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Fonte/provedor
                  </span>
                  <Input
                    className="mt-2 h-10 rounded-xl border-slate-200 bg-slate-50 text-sm"
                    onChange={(event) =>
                      updateEvidenceForm("sourceLabel", event.target.value)
                    }
                    placeholder="Cartório / parceiro local"
                    value={evidenceForm.sourceLabel}
                  />
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Status
                  </span>
                  <select
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none"
                    onChange={(event) =>
                      updateEvidenceForm(
                        "status",
                        event.target.value as PropertyEvidenceDocument["status"],
                      )
                    }
                    value={evidenceForm.status}
                  >
                    {Object.entries(evidenceStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Confiança
                  </span>
                  <select
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none"
                    onChange={(event) =>
                      updateEvidenceForm(
                        "confidence",
                        event.target.value as PropertyEvidenceDocument["confidence"],
                      )
                    }
                    value={evidenceForm.confidence}
                  >
                    {Object.entries(confidenceLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Nome do arquivo
                  </span>
                  <Input
                    className="mt-2 h-10 rounded-xl border-slate-200 bg-slate-50 text-sm"
                    onChange={(event) =>
                      updateEvidenceForm("fileName", event.target.value)
                    }
                    placeholder="matricula-meireles.pdf"
                    value={evidenceForm.fileName}
                  />
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    O que desbloqueia
                  </span>
                  <Input
                    className="mt-2 h-10 rounded-xl border-slate-200 bg-slate-50 text-sm"
                    onChange={(event) =>
                      updateEvidenceForm("unlocks", event.target.value)
                    }
                    placeholder="titularidade, ônus, situação fiscal"
                    value={evidenceForm.unlocks}
                  />
                </label>

                <label className="rounded-2xl border border-slate-200 bg-white p-3 md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Observações
                  </span>
                  <textarea
                    className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none"
                    onChange={(event) =>
                      updateEvidenceForm("notes", event.target.value)
                    }
                    placeholder="Registro recebido para revisão, validade, pendências ou ressalvas."
                    value={evidenceForm.notes}
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-900"
                  onClick={handleEvidenceSubmit}
                  type="button"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Adicionar evidência
                </Button>
                <div className="text-sm text-slate-500">
                  Metadados persistidos localmente; armazenamento de arquivo virá depois.
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-5 md:p-6">
              <SectionTitle
                eyebrow="CSV / parceiro"
                title="Importar planilha simples"
                description="Cole linhas CSV para simular upload de parceiro nesta versão frontend."
              />
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-500">
                Colunas esperadas:
                title,state,city,region,address,lat,lng,assetType,areaM2,estimatedValueRange,askingPrice,targetUse,sourceLabel,sourceType,dataAvailability,notes
              </div>
              <textarea
                className="mt-4 min-h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
                onChange={(event) => setCsvText(event.target.value)}
                placeholder="Terreno · Dionísio Torres,Ceará,Fortaleza,Dionísio Torres,Rua Exemplo 120,-3.7442,-38.5128,Terreno urbano,1280,R$ 2.6M–3.1M,,Residencial|Uso misto,Parceiro local,partner,medium,"
                value={csvText}
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  className="h-11 rounded-2xl border-slate-200 bg-white px-5"
                  onClick={handleCsvImport}
                  type="button"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Importar CSV
                </Button>
                <div className="text-sm text-slate-500">
                  Importação CSV simples para piloto; parser robusto será
                  adicionado depois.
                </div>
              </div>
            </ShellCard>
          </main>

          <aside className="space-y-6 xl:sticky xl:top-8">
            <ShellCard className="p-5 md:p-6">
              <SectionTitle
                eyebrow="Preview"
                title="Oportunidades importadas"
                description="Registros salvos localmente e enviados para Descobrir."
              />
              <div className="mt-5 space-y-3">
                {importedOpportunities.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-sm leading-relaxed text-slate-500">
                    Nenhuma oportunidade importada ainda. Cadastre manualmente
                    para ver o registro no Descobrir e no mapa.
                  </div>
                ) : (
                  importedOpportunities.map((opportunity) => (
                    <div
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                      key={opportunity.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold tracking-tight text-slate-950">
                            {opportunity.title}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {opportunity.region} · {opportunity.city}
                          </div>
                        </div>
                        <Badge className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">
                          Importado
                        </Badge>
                      </div>
                      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm font-medium text-slate-700">
                        Evidências: {getEvidenceCount(opportunity.propertyId)}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Tipo
                          </div>
                          <div className="mt-1 font-medium text-slate-800">
                            {opportunity.assetType}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Área
                          </div>
                          <div className="mt-1 font-medium text-slate-800">
                            {opportunity.areaLabel}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Fonte
                          </div>
                          <div className="mt-1 font-medium text-slate-800">
                            {opportunity.primarySourceLabel}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Dados
                          </div>
                          <div className="mt-1 font-medium text-slate-800">
                            {dataAvailabilityLabels[opportunity.dataAvailability]}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-4 h-10 w-full rounded-2xl border-slate-200 bg-white"
                        onClick={() => onGoDiscover?.(opportunity.id)}
                        type="button"
                      >
                        Ver em Descobrir
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ShellCard>

            <ShellCard className="p-5">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-950">
                    Portal preparado para parceiros
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    O fluxo começa com formulário e CSV simples, mantendo a
                    mesma estrutura para uploads, feeds e APIs futuras.
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  "Salvo no navegador via localStorage",
                  "Visível em Descobrir e no mapa",
                  "Selecionável para análise e dossiê",
                ].map((item) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700"
                    key={item}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </ShellCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
