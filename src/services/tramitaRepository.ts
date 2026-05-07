import { supabase } from "../lib/supabaseClient";
import {
  createEvidenceDocument,
  createOpportunityFromInput,
  dossierRequestsStorageKey,
  loadImportedOpportunities as loadLocalImportedOpportunities,
  loadPropertyEvidence as loadLocalPropertyEvidence,
  saveImportedOpportunities as saveLocalImportedOpportunities,
  savePropertyEvidence as saveLocalPropertyEvidence,
  type DossierRequestStatusByPropertyId,
} from "../state/tramitaAppState";
import type {
  ImportedOpportunityInput,
  Opportunity,
  PropertyEvidenceDocument,
  PropertyEvidenceDocumentInput,
  RiskLevel,
  SourceType,
} from "../types/tramita";

type PropertyRow = {
  id: string;
  title: string;
  state: string;
  city: string;
  region: string;
  address: string | null;
  lat: number;
  lng: number;
  asset_type: string;
  area_m2: number | string;
  estimated_value_range: string | null;
  asking_price: string | null;
  target_use: string[] | null;
  source_label: string | null;
  source_type: string | null;
  data_availability: string | null;
  status: string | null;
};

type EvidenceRow = {
  id: string;
  property_id: string;
  title: string;
  document_type: PropertyEvidenceDocument["documentType"];
  source_type: SourceType;
  source_label: string;
  status: PropertyEvidenceDocument["status"];
  confidence: PropertyEvidenceDocument["confidence"];
  file_name: string | null;
  notes: string | null;
  unlocks: string[] | null;
  uploaded_at: string | null;
};

type DossierRequestRow = {
  property_id: string;
  status: string;
};

export type DossierRequestInput = {
  commercialModel?: "pay_per_use" | "b2b_credit" | "enterprise";
  notes?: string;
  propertyId: string;
  propertyTitle?: string;
};

function formatArea(areaM2: number) {
  return `${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(areaM2)} m²`;
}

function riskLabelFromLevel(riskLevel: RiskLevel) {
  const labels: Record<RiskLevel, string> = {
    low: "Baixo",
    medium: "Médio",
    high: "Alto",
    unknown: "A definir",
  };

  return labels[riskLevel];
}

function normalizeDataAvailability(
  value: string | null,
): Opportunity["dataAvailability"] {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return "medium";
}

function normalizeSourceType(value: string | null): SourceType | undefined {
  const sourceTypes: SourceType[] = [
    "cartorio",
    "matricula",
    "prefeitura",
    "iptu",
    "plano_diretor",
    "corretor",
    "proprietario",
    "incorporador",
    "juridico",
    "banco",
    "upload",
    "partner",
    "future_api",
    "tramita_estimate",
  ];

  return sourceTypes.includes(value as SourceType)
    ? (value as SourceType)
    : undefined;
}

function propertyInputToRow(input: ImportedOpportunityInput) {
  return {
    title: input.title,
    state: input.state,
    city: input.city,
    region: input.region,
    address: input.address ?? null,
    lat: input.lat,
    lng: input.lng,
    asset_type: input.assetType,
    area_m2: input.areaM2,
    estimated_value_range: input.estimatedValueRange ?? null,
    asking_price: input.askingPrice ?? null,
    target_use: input.targetUse,
    source_label: input.sourceLabel,
    source_type: input.sourceType,
    data_availability: input.dataAvailability,
    status: "imported",
  };
}

function propertyRowToOpportunity(row: PropertyRow): Opportunity {
  const areaM2 = Number(row.area_m2);
  const targetUse =
    row.target_use && row.target_use.length > 0
      ? row.target_use
      : ["Uso a validar"];
  const dataAvailability = normalizeDataAvailability(row.data_availability);
  const riskLevel: RiskLevel =
    dataAvailability === "low" ? "unknown" : "medium";
  const valueRange =
    row.estimated_value_range || row.asking_price || "A estimar";
  const fitScore =
    dataAvailability === "high" ? 72 : dataAvailability === "low" ? 56 : 62;
  const sourceLabel = row.source_label || "Fonte a confirmar";

  return {
    id: `imported-${row.id}`,
    propertyId: row.id,
    title: row.title,
    location: `${row.city}, ${row.state}`,
    state: row.state,
    city: row.city,
    region: row.region,
    lat: row.lat,
    lng: row.lng,
    assetType: row.asset_type,
    areaM2,
    areaLabel: formatArea(areaM2),
    fitScore,
    fit: fitScore,
    valueRange,
    value: valueRange,
    thesis: `${row.asset_type} · ${targetUse.join(" / ")}`,
    targetUse,
    riskLevel,
    risk: riskLevel,
    riskLabel: riskLabelFromLevel(riskLevel),
    statusLabel: "Importado",
    status: "Importado",
    dataAvailability,
    primarySourceLabel: sourceLabel,
    sourceLabel,
    sourceType: normalizeSourceType(row.source_type),
    dossierStatus: "on_demand",
    dossierLabel: "Sob demanda",
    selected: false,
    address: row.address ?? undefined,
    askingPrice: row.asking_price ?? undefined,
    estimatedValueRange: row.estimated_value_range ?? undefined,
    imported: true,
    previewNote:
      "Oportunidade importada por formulário, parceiro ou CSV. Dossiê sob demanda recomendado para validação.",
  };
}

function evidenceInputToRow(input: PropertyEvidenceDocumentInput) {
  return {
    property_id: input.propertyId,
    title: input.title,
    document_type: input.documentType,
    source_type: input.sourceType,
    source_label: input.sourceLabel,
    status: input.status,
    confidence: input.confidence,
    file_name: input.fileName ?? null,
    notes: input.notes ?? null,
    unlocks: input.unlocks,
  };
}

function evidenceRowToDocument(row: EvidenceRow): PropertyEvidenceDocument {
  return {
    id: row.id,
    propertyId: row.property_id,
    title: row.title,
    documentType: row.document_type,
    sourceType: row.source_type,
    sourceLabel: row.source_label,
    status: row.status,
    confidence: row.confidence,
    fileName: row.file_name ?? undefined,
    notes: row.notes ?? undefined,
    uploadedAt: row.uploaded_at ?? new Date().toISOString(),
    unlocks: row.unlocks ?? [],
  };
}

function loadLocalDossierRequests(): DossierRequestStatusByPropertyId {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(dossierRequestsStorageKey);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveLocalDossierRequest(propertyId: string) {
  if (typeof window === "undefined") {
    return {};
  }

  const current = loadLocalDossierRequests();
  const next: DossierRequestStatusByPropertyId = {
    ...current,
    [propertyId]: "requested",
  };

  window.localStorage.setItem(dossierRequestsStorageKey, JSON.stringify(next));
  return next;
}

export async function loadImportedOpportunities(): Promise<Opportunity[]> {
  if (!supabase) {
    return loadLocalImportedOpportunities();
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return loadLocalImportedOpportunities();
  }

  return (data as PropertyRow[]).map(propertyRowToOpportunity);
}

export async function saveImportedOpportunity(
  input: ImportedOpportunityInput,
): Promise<Opportunity> {
  if (!supabase) {
    const opportunity = createOpportunityFromInput(input);
    saveLocalImportedOpportunities([
      opportunity,
      ...loadLocalImportedOpportunities(),
    ]);
    return opportunity;
  }

  const { data, error } = await supabase
    .from("properties")
    .insert(propertyInputToRow(input))
    .select("*")
    .single();

  if (error || !data) {
    const opportunity = createOpportunityFromInput(input);
    saveLocalImportedOpportunities([
      opportunity,
      ...loadLocalImportedOpportunities(),
    ]);
    return opportunity;
  }

  return propertyRowToOpportunity(data as PropertyRow);
}

export async function saveImportedOpportunitiesBatch(
  inputs: ImportedOpportunityInput[],
): Promise<Opportunity[]> {
  if (!supabase) {
    const opportunities = inputs.map(createOpportunityFromInput);
    saveLocalImportedOpportunities([
      ...opportunities,
      ...loadLocalImportedOpportunities(),
    ]);
    return opportunities;
  }

  const { data, error } = await supabase
    .from("properties")
    .insert(inputs.map(propertyInputToRow))
    .select("*");

  if (error || !data) {
    const opportunities = inputs.map(createOpportunityFromInput);
    saveLocalImportedOpportunities([
      ...opportunities,
      ...loadLocalImportedOpportunities(),
    ]);
    return opportunities;
  }

  return (data as PropertyRow[]).map(propertyRowToOpportunity);
}

export async function loadEvidenceDocuments(): Promise<
  PropertyEvidenceDocument[]
> {
  if (!supabase) {
    return loadLocalPropertyEvidence();
  }

  const { data, error } = await supabase
    .from("property_evidence_documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return loadLocalPropertyEvidence();
  }

  return (data as EvidenceRow[]).map(evidenceRowToDocument);
}

export async function saveEvidenceDocument(
  input: PropertyEvidenceDocumentInput,
): Promise<PropertyEvidenceDocument> {
  if (!supabase) {
    const document = createEvidenceDocument(input);
    saveLocalPropertyEvidence([document, ...loadLocalPropertyEvidence()]);
    return document;
  }

  const { data, error } = await supabase
    .from("property_evidence_documents")
    .insert(evidenceInputToRow(input))
    .select("*")
    .single();

  if (error || !data) {
    const document = createEvidenceDocument(input);
    saveLocalPropertyEvidence([document, ...loadLocalPropertyEvidence()]);
    return document;
  }

  return evidenceRowToDocument(data as EvidenceRow);
}

export async function loadDossierRequests(): Promise<DossierRequestStatusByPropertyId> {
  if (!supabase) {
    return loadLocalDossierRequests();
  }

  const { data, error } = await supabase
    .from("dossier_requests")
    .select("property_id,status");

  if (error || !data) {
    return loadLocalDossierRequests();
  }

  return (data as DossierRequestRow[]).reduce<DossierRequestStatusByPropertyId>(
    (requests, row) =>
      row.status === "requested"
        ? { ...requests, [row.property_id]: "requested" }
        : requests,
    {},
  );
}

export async function saveDossierRequest(
  input: DossierRequestInput,
): Promise<DossierRequestStatusByPropertyId> {
  if (!supabase) {
    return saveLocalDossierRequest(input.propertyId);
  }

  const { error } = await supabase.from("dossier_requests").insert({
    property_id: input.propertyId,
    property_title: input.propertyTitle ?? null,
    status: "requested",
    commercial_model: input.commercialModel ?? "pay_per_use",
    notes: input.notes ?? null,
  });

  if (error) {
    return saveLocalDossierRequest(input.propertyId);
  }

  return {
    ...loadLocalDossierRequests(),
    [input.propertyId]: "requested",
  };
}
