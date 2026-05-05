export type DataStatus =
  | "verified"
  | "reported"
  | "estimated"
  | "pending"
  | "requested"
  | "conflicting"
  | "expired";

export type SourceType =
  | "cartorio"
  | "matricula"
  | "prefeitura"
  | "iptu"
  | "plano_diretor"
  | "corretor"
  | "proprietario"
  | "incorporador"
  | "juridico"
  | "banco"
  | "upload"
  | "partner"
  | "future_api"
  | "tramita_estimate";

export type RiskLevel = "low" | "medium" | "high" | "unknown";

export type DossierStatus =
  | "available"
  | "on_demand"
  | "requested"
  | "in_progress"
  | "delivered";

export type Property = {
  id: string;
  title: string;
  assetType: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  locationLabel: string;
  areaM2: number;
  areaLabel: string;
  frontageM: number;
  frontageLabel: string;
  currentUse: string;
  zone: string;
  iptuStatus: string;
  matriculaStatus: string;
  liquidity: string;
  facts: Array<{
    label: string;
    value: string;
  }>;
};

export type PropertySource = {
  id: string;
  sourceType: SourceType;
  source: string;
  status: DataStatus;
  statusLabel: string;
  confidence: string;
  provided: string;
  nextValidation: string;
  owner?: string;
};

export type PropertyDataPoint = {
  id: string;
  label: string;
  value: string;
  status: DataStatus;
  sourceId: string;
  confidence: string;
};

export type Opportunity = {
  id: string;
  propertyId: string;
  title: string;
  location: string;
  state: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  assetType: string;
  areaM2: number;
  areaLabel: string;
  fitScore: number;
  valueRange: string;
  thesis: string;
  targetUse: string[];
  riskLevel: RiskLevel;
  riskLabel: string;
  statusLabel: string;
  dataAvailability: "low" | "medium" | "high";
  primarySourceLabel: string;
  sourceLabel?: string;
  sourceType?: SourceType;
  dossierStatus: DossierStatus;
  dossierLabel: string;
  selected: boolean;
  address?: string;
  askingPrice?: string;
  estimatedValueRange?: string;
  imported?: boolean;
  notes?: string;
  fit?: number;
  risk?: RiskLevel;
  status?: string;
  value?: string;
  previewNote?: string;
};

export type ImportedOpportunityInput = {
  title: string;
  state: string;
  city: string;
  region: string;
  address?: string;
  lat: number;
  lng: number;
  assetType: string;
  areaM2: number;
  estimatedValueRange?: string;
  askingPrice?: string;
  targetUse: string[];
  sourceLabel: string;
  sourceType: SourceType;
  dataAvailability: "low" | "medium" | "high";
  notes?: string;
};

export type AnalysisSummary = {
  propertyId: string;
  estimatedValueRange: string;
  valueCenter: string;
  confidence: number;
  confidenceLabel: string;
  valueScore: number;
  potentialScore: number;
  confidenceScore: number;
  potentialLevel: string;
  liquidity: string;
  comparableCount: number;
  marketContext: string;
};

export type RiskSignal = {
  id: string;
  label: string;
  status: DataStatus;
  statusLabel: string;
  riskLevel: RiskLevel;
  text: string;
};

export type DataRequest = {
  id: string;
  label: string;
  subtitle: string;
  impact: "Alto" | "Médio" | "Baixo";
  status: DataStatus;
  sourceType: SourceType;
  owner: string;
  action: string;
};

export type DocumentItem = {
  id: string;
  name: string;
  group: string;
  owner: string;
  status: DataStatus;
  statusLabel: string;
};

export type Party = {
  id: string;
  role: string;
  name: string;
  status: DataStatus;
  statusLabel: string;
  items: string[];
};

export type TransactionTask = {
  id: string;
  title: string;
  owner: string;
  status: DataStatus;
  statusLabel: string;
  date: string;
  evidence: string;
  impact?: string;
  actionLabel?: string;
  usedBy?: string;
  urgencyLabel?: string;
};

export type Transaction = {
  id: string;
  title: string;
  location: string;
  buyer: string;
  seller: string;
  stage: string;
  stageLabel: string;
  readiness: number;
  documentsReadiness: number;
  legalReadiness: number;
  financialReadiness: number;
  criticalBlockers: number;
  mainBlockerId: string;
  parties: Party[];
  tasks: TransactionTask[];
  documents: DocumentItem[];
};

export type ReportMemo = {
  id: string;
  title: string;
  subtitle: string;
  recommendation: string;
  summaryText: string;
  summaryMetrics: Array<{
    label: string;
    value: string;
  }>;
  dataReliability: Array<{
    label: string;
    value: string;
  }>;
  pendingSources: string[];
  sourcingReasons: string[];
  transactionReadiness: Array<{
    label: string;
    value: string;
    progress: number;
  }>;
  nextSteps: string[];
};

export type DossierRequestPackage = {
  id: string;
  name: string;
  propertyName: string;
  propertyLocation: string;
  estimatedDelivery: string;
  format: string;
  initialStatus: string;
  status: DossierStatus;
  items: string[];
  sources: string[];
  unlocks: string[];
  commercialOptions: Array<{
    label: string;
    description: string;
  }>;
  note: string;
};

export type DossierRequestItem = {
  id: string;
  label: string;
  sourceType: SourceType;
  providerLabel: string;
  status: "requested" | "collecting" | "validating" | "delivered" | "blocked";
  eta: string;
  confidenceImpact: "low" | "medium" | "high";
  unlocks: string[];
};

export type OperationsDossierRequest = {
  id: string;
  propertyName: string;
  city: string;
  requestedBy: string;
  requestType: string;
  status:
    | "new"
    | "in_progress"
    | "waiting_provider"
    | "validating"
    | "ready_to_deliver"
    | "delivered"
    | "blocked";
  priority: "low" | "medium" | "high";
  eta: string;
  assignedTo: string;
  progress: number;
  revenueModel: "pay_per_use" | "b2b_credit" | "enterprise";
  items: DossierRequestItem[];
};
