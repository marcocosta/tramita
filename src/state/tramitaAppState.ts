import { tramitaMockData } from "../data/tramitaMockData";
import type {
  AnalysisSummary,
  ImportedOpportunityInput,
  Opportunity,
  Property,
  PropertyEvidenceDocument,
  PropertyEvidenceDocumentInput,
  ReportMemo,
  RiskLevel,
  Transaction,
} from "../types/tramita";

export type ActiveScreen =
  | "home"
  | "discover"
  | "analyze"
  | "transact"
  | "reports"
  | "pricing"
  | "intake"
  | "operations";

export type ActiveSearchFilter = {
  label: string;
  value: string;
};

export type DossierRequestStatus = "requested";

export type DossierRequestStatusByPropertyId = Record<
  string,
  DossierRequestStatus
>;

export type TramitaAppState = {
  selectedPropertyId: string;
  selectedOpportunityId: string;
  searchThesisText: string;
  activeSearchFilters: ActiveSearchFilter[];
  dossierRequestStatusByPropertyId: DossierRequestStatusByPropertyId;
  selectedTransactionId: string;
};

export const dossierRequestsStorageKey = "tramita.dossierRequests.v1";
export const importedOpportunitiesStorageKey =
  "tramita.importedOpportunities.v1";
export const propertyEvidenceStorageKey = "tramita.propertyEvidence.v1";

const defaultOpportunity =
  tramitaMockData.discover.candidates.find((candidate) => candidate.selected) ??
  tramitaMockData.discover.candidates[0];

export const initialTramitaAppState: TramitaAppState = {
  selectedPropertyId:
    defaultOpportunity?.propertyId ?? tramitaMockData.selectedProperty.id,
  selectedOpportunityId: defaultOpportunity?.id ?? "",
  searchThesisText: tramitaMockData.discover.searchThesis.command,
  activeSearchFilters: tramitaMockData.discover.searchThesis.filters,
  dossierRequestStatusByPropertyId: {},
  selectedTransactionId: tramitaMockData.transaction.id,
};

export function updateSearchThesis(
  state: TramitaAppState,
  searchThesisText: string,
): TramitaAppState {
  return {
    ...state,
    searchThesisText,
  };
}

export function selectOpportunity(
  state: TramitaAppState,
  selectedOpportunityId: string,
  opportunities = tramitaMockData.discover.candidates,
): TramitaAppState {
  const opportunity = getOpportunityById(selectedOpportunityId, opportunities);

  return {
    ...state,
    selectedOpportunityId,
    selectedPropertyId: opportunity?.propertyId ?? state.selectedPropertyId,
  };
}

export function selectProperty(
  state: TramitaAppState,
  selectedPropertyId: string,
): TramitaAppState {
  return {
    ...state,
    selectedPropertyId,
  };
}

export function markDossierRequested(
  state: TramitaAppState,
  propertyId: string,
): TramitaAppState {
  return {
    ...state,
    selectedPropertyId: propertyId,
    dossierRequestStatusByPropertyId: {
      ...state.dossierRequestStatusByPropertyId,
      [propertyId]: "requested",
    },
  };
}

export function isDossierRequested(
  statusByPropertyId: DossierRequestStatusByPropertyId,
  propertyId: string,
) {
  return statusByPropertyId[propertyId] === "requested";
}

export function getOpportunityById(
  opportunityId: string,
  opportunities = tramitaMockData.discover.candidates,
): Opportunity | undefined {
  return opportunities.find((candidate) => candidate.id === opportunityId);
}

export function getPropertyForOpportunityId(
  opportunityId: string,
  opportunities = tramitaMockData.discover.candidates,
): Property {
  const opportunity = getOpportunityById(opportunityId, opportunities);
  const baseProperty = tramitaMockData.selectedProperty;

  if (!opportunity || opportunity.propertyId === baseProperty.id) {
    return baseProperty;
  }

  const [, neighborhoodFromTitle] = opportunity.title
    .split("·")
    .map((part) => part.trim());
  const neighborhood =
    opportunity.region || neighborhoodFromTitle || baseProperty.neighborhood;
  const [city, state] = opportunity.location
    .split(",")
    .map((part) => part.trim());

  return {
    ...baseProperty,
    id: opportunity.propertyId,
    title: opportunity.title,
    city: city || baseProperty.city,
    state: state || baseProperty.state,
    neighborhood,
    locationLabel: `${neighborhood}, ${opportunity.location}`,
    areaLabel: opportunity.areaLabel,
    facts: baseProperty.facts.map((fact) =>
      fact.label === "Área" ? { ...fact, value: opportunity.areaLabel } : fact,
    ),
  };
}

export function loadImportedOpportunities(): Opportunity[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(importedOpportunitiesStorageKey);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveImportedOpportunities(opportunities: Opportunity[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    importedOpportunitiesStorageKey,
    JSON.stringify(opportunities),
  );
}

export function loadPropertyEvidence(): PropertyEvidenceDocument[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(propertyEvidenceStorageKey);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePropertyEvidence(records: PropertyEvidenceDocument[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(propertyEvidenceStorageKey, JSON.stringify(records));
}

export function createEvidenceDocument(
  input: PropertyEvidenceDocumentInput,
): PropertyEvidenceDocument {
  return {
    ...input,
    id: `evidence-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    uploadedAt: new Date().toISOString(),
  };
}

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

function calculateImportedFit(input: ImportedOpportunityInput) {
  let score = 62;

  if (input.areaM2 >= 800 && input.areaM2 <= 2000) {
    score += 10;
  }

  if (
    input.targetUse.some((use) =>
      ["residencial", "uso misto"].includes(use.toLowerCase()),
    )
  ) {
    score += 8;
  }

  if (input.dataAvailability === "high") {
    score += 8;
  }

  if (input.dataAvailability === "low") {
    score -= 6;
  }

  return Math.max(45, Math.min(score, 88));
}

export function createOpportunityFromInput(
  input: ImportedOpportunityInput,
): Opportunity {
  const normalizedTargetUse =
    input.targetUse.map((item) => item.trim()).filter(Boolean).length > 0
      ? input.targetUse.map((item) => item.trim()).filter(Boolean)
      : ["Uso a validar"];
  const id = `imported-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const fitScore = calculateImportedFit(input);
  const riskLevel: RiskLevel =
    input.dataAvailability === "low" ? "unknown" : "medium";
  const valueRange =
    input.askingPrice?.trim() ||
    input.estimatedValueRange?.trim() ||
    "A estimar";

  return {
    id,
    propertyId: `prop-${id}`,
    title: input.title.trim(),
    location: `${input.city.trim()}, ${input.state.trim()}`,
    state: input.state.trim(),
    city: input.city.trim(),
    region: input.region.trim(),
    lat: input.lat,
    lng: input.lng,
    assetType: input.assetType.trim(),
    areaM2: input.areaM2,
    areaLabel: formatArea(input.areaM2),
    fitScore,
    fit: fitScore,
    valueRange,
    value: valueRange,
    thesis: `${input.assetType.trim()} · ${normalizedTargetUse.join(" / ")}`,
    targetUse: normalizedTargetUse,
    riskLevel,
    risk: riskLevel,
    riskLabel: riskLabelFromLevel(riskLevel),
    statusLabel: "Importado",
    status: "Importado",
    dataAvailability: input.dataAvailability,
    primarySourceLabel: input.sourceLabel.trim(),
    sourceLabel: input.sourceLabel.trim(),
    sourceType: input.sourceType,
    dossierStatus: "on_demand",
    dossierLabel: "Sob demanda",
    selected: false,
    address: input.address?.trim(),
    askingPrice: input.askingPrice?.trim(),
    estimatedValueRange: input.estimatedValueRange?.trim(),
    imported: true,
    notes: input.notes?.trim(),
    previewNote:
      "Oportunidade importada por formulário, parceiro ou CSV. Dossiê sob demanda recomendado para validação.",
  };
}

export function getSelectedAnalysisSummary(propertyId: string): AnalysisSummary {
  return {
    ...tramitaMockData.analysisSummary,
    propertyId,
  };
}

export function getSelectedTransaction(
  transactionId: string,
): Transaction {
  if (transactionId === tramitaMockData.transaction.id) {
    return tramitaMockData.transaction;
  }

  return tramitaMockData.transaction;
}

export function getSelectedReportMemo(_propertyId: string): ReportMemo {
  return tramitaMockData.reportMemo;
}

