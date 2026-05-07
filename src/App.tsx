import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  FileText,
  Radar,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import HomeStoryLayer from "./HomeStoryLayer";
import DiscoverOpportunityDetail from "./DiscoverOpportunityDetail";
import AnalyzePropertyProfile from "./AnalyzePropertyProfile";
import TransactCommandCenter from "./TransactCommandCenter";
import InvestorMemoReport from "./InvestorMemoReport";
import OperationsConsole from "./OperationsConsole";
import PricingModelScreen from "./PricingModelScreen";
import PropertyIntakeScreen from "./PropertyIntakeScreen";
import { tramitaMockData } from "./data/tramitaMockData";
import { isSupabaseConfigured } from "./lib/supabaseClient";
import {
  loadDossierRequests as loadRepositoryDossierRequests,
  loadEvidenceDocuments as loadRepositoryEvidenceDocuments,
  loadImportedOpportunities as loadRepositoryImportedOpportunities,
  saveDossierRequest,
  saveEvidenceDocument,
  saveImportedOpportunity,
  saveImportedOpportunitiesBatch,
} from "./services/tramitaRepository";
import {
  dossierRequestsStorageKey,
  getPropertyForOpportunityId,
  getSelectedAnalysisSummary,
  getSelectedReportMemo,
  getSelectedTransaction,
  initialTramitaAppState,
  isDossierRequested,
  loadImportedOpportunities as loadLocalImportedOpportunities,
  loadPropertyEvidence as loadLocalPropertyEvidence,
  markDossierRequested,
  selectOpportunity,
  updateSearchThesis,
  type ActiveScreen,
  type DossierRequestStatusByPropertyId,
  type TramitaAppState,
} from "./state/tramitaAppState";
import type {
  ImportedOpportunityInput,
  Opportunity,
  PropertyEvidenceDocument,
  PropertyEvidenceDocumentInput,
} from "./types/tramita";

const validScreens: ActiveScreen[] = [
  "home",
  "discover",
  "analyze",
  "transact",
  "reports",
  "pricing",
  "intake",
  "operations",
];

function screenFromHash(hash: string): ActiveScreen | null {
  const screen = hash.replace("#", "") as ActiveScreen;
  return validScreens.includes(screen) ? screen : null;
}

function getInitialScreen(): ActiveScreen {
  if (typeof window === "undefined") {
    return "home";
  }

  return screenFromHash(window.location.hash) ?? "home";
}

function getStoredDossierRequests(): DossierRequestStatusByPropertyId {
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

function getInitialAppState(): TramitaAppState {
  return {
    ...initialTramitaAppState,
    dossierRequestStatusByPropertyId: getStoredDossierRequests(),
  };
}

const navItems: Array<{
  key: ActiveScreen;
  label: string;
  description: string;
}> = [
  {
    key: "home",
    label: "Início",
    description: "Visão geral",
  },
  {
    key: "intake",
    label: "Entrada",
    description: "Dados e uploads",
  },
  {
    key: "discover",
    label: "Descobrir",
    description: "Buscar oportunidades",
  },
  {
    key: "analyze",
    label: "Analisar",
    description: "Valor, potencial e risco",
  },
  {
    key: "transact",
    label: "Tramitar",
    description: "Diligência e fechamento",
  },
  {
    key: "reports",
    label: "Relatórios",
    description: "Memorando",
  },
  {
    key: "pricing",
    label: "Modelo",
    description: "Pricing e receita",
  },
  {
    key: "operations",
    label: "Operações",
    description: "Fila de dossiês",
  },
];

export default function App() {
  const [active, setActive] = useState<ActiveScreen>(getInitialScreen);
  const [appState, setAppState] =
    useState<TramitaAppState>(getInitialAppState);
  const [importedOpportunities, setImportedOpportunities] = useState<
    Opportunity[]
  >(loadLocalImportedOpportunities);
  const [propertyEvidenceDocuments, setPropertyEvidenceDocuments] = useState<
    PropertyEvidenceDocument[]
  >(loadLocalPropertyEvidence);

  const allDiscoverOpportunities = [
    ...tramitaMockData.discover.candidates,
    ...importedOpportunities,
  ];
  const selectedOpportunity = allDiscoverOpportunities.find(
    (opportunity) => opportunity.id === appState.selectedOpportunityId,
  );
  const selectedProperty = getPropertyForOpportunityId(
    appState.selectedOpportunityId,
    allDiscoverOpportunities,
  );
  const selectedAnalysisSummary = getSelectedAnalysisSummary(
    selectedProperty.id,
  );
  const selectedTransaction = getSelectedTransaction(
    appState.selectedTransactionId,
  );
  const selectedReportMemo = getSelectedReportMemo(selectedProperty.id);
  const selectedDossierRequested = isDossierRequested(
    appState.dossierRequestStatusByPropertyId,
    selectedProperty.id,
  );
  const selectedPropertyEvidenceDocuments = propertyEvidenceDocuments.filter(
    (document) => document.propertyId === selectedProperty.id,
  );

  function navigateTo(screen: ActiveScreen) {
    setActive(screen);

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${screen}`);
    }
  }

  function handleSearchThesisChange(searchThesisText: string) {
    setAppState((current) =>
      updateSearchThesis(current, searchThesisText),
    );
  }

  function handleSelectOpportunity(opportunityId: string) {
    setAppState((current) =>
      selectOpportunity(current, opportunityId, allDiscoverOpportunities),
    );
  }

  function handleAnalyzeOpportunity(opportunityId?: string) {
    if (opportunityId) {
      setAppState((current) =>
        selectOpportunity(current, opportunityId, allDiscoverOpportunities),
      );
    }

    navigateTo("analyze");
  }

  function handleRequestDossier(propertyId: string, opportunityId?: string) {
    setAppState((current) => {
      const selectedState = opportunityId
        ? selectOpportunity(current, opportunityId, allDiscoverOpportunities)
        : current;
      const nextState = markDossierRequested(selectedState, propertyId);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          dossierRequestsStorageKey,
          JSON.stringify(nextState.dossierRequestStatusByPropertyId),
        );
      }

      return nextState;
    });

    const opportunity = opportunityId
      ? allDiscoverOpportunities.find((item) => item.id === opportunityId)
      : selectedOpportunity;

    void saveDossierRequest({
      propertyId,
      propertyTitle: opportunity?.title ?? selectedProperty.title,
    }).catch(() => undefined);
  }

  async function handleAddImportedOpportunity(input: ImportedOpportunityInput) {
    const opportunity = await saveImportedOpportunity(input);
    const nextOpportunities = [opportunity, ...importedOpportunities];

    setImportedOpportunities(nextOpportunities);
    setAppState((current) =>
      selectOpportunity(current, opportunity.id, [
        ...tramitaMockData.discover.candidates,
        ...nextOpportunities,
      ]),
    );
  }

  async function handleImportOpportunities(inputs: ImportedOpportunityInput[]) {
    const opportunities = await saveImportedOpportunitiesBatch(inputs);
    const nextOpportunities = [...opportunities, ...importedOpportunities];

    setImportedOpportunities(nextOpportunities);
    if (opportunities[0]) {
      setAppState((current) =>
        selectOpportunity(current, opportunities[0].id, [
          ...tramitaMockData.discover.candidates,
          ...nextOpportunities,
        ]),
      );
    }
  }

  function handleGoDiscover(opportunityId?: string) {
    if (opportunityId) {
      setAppState((current) =>
        selectOpportunity(current, opportunityId, allDiscoverOpportunities),
      );
    }

    navigateTo("discover");
  }

  async function handleAddEvidenceDocument(input: PropertyEvidenceDocumentInput) {
    const document = await saveEvidenceDocument(input);
    setPropertyEvidenceDocuments([document, ...propertyEvidenceDocuments]);
  }

  useEffect(() => {
    let canceled = false;

    async function loadRepositoryState() {
      const [opportunities, evidenceDocuments, dossierRequests] =
        await Promise.all([
          loadRepositoryImportedOpportunities(),
          loadRepositoryEvidenceDocuments(),
          loadRepositoryDossierRequests(),
        ]);

      if (canceled) {
        return;
      }

      setImportedOpportunities(opportunities);
      setPropertyEvidenceDocuments(evidenceDocuments);
      setAppState((current) => ({
        ...current,
        dossierRequestStatusByPropertyId: {
          ...current.dossierRequestStatusByPropertyId,
          ...dossierRequests,
        },
      }));
    }

    void loadRepositoryState();

    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    function handleHashChange() {
      setActive(screenFromHash(window.location.hash) ?? "home");
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 py-3 md:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-sm">
              T
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-slate-950">
                Tramita
              </div>
              <div className="text-sm leading-snug text-slate-500">
                Plataforma de inteligência imobiliária
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm">
              {navItems.map((item) => {
                const selected = active === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => navigateTo(item.key)}
                    className={`min-w-[122px] rounded-xl px-3.5 py-2 text-left transition ${
                      selected
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white hover:text-slate-950"
                    }`}
                    type="button"
                  >
                    <div className="text-[15px] font-semibold leading-tight">{item.label}</div>
                    <div
                      className={`mt-1 text-[12px] leading-tight ${
                        selected ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/70 bg-white/70">
          <div className="mx-auto flex max-w-[1480px] items-center gap-2 overflow-x-auto px-4 py-2 text-sm md:px-8">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 shadow-sm">
              <Radar className="h-4 w-4" />
              <button
                onClick={() => navigateTo("discover")}
                className={
                  active === "discover" ? "font-semibold text-slate-950" : ""
                }
                type="button"
              >
                Descobrir
              </button>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 shadow-sm">
              <SearchCheck className="h-4 w-4" />
              <button
                onClick={() => navigateTo("analyze")}
                className={
                  active === "analyze" ? "font-semibold text-slate-950" : ""
                }
                type="button"
              >
                Analisar
              </button>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              <button
                onClick={() => navigateTo("transact")}
                className={
                  active === "transact" ? "font-semibold text-slate-950" : ""
                }
                type="button"
              >
                Tramitar
              </button>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 shadow-sm">
              <FileText className="h-4 w-4" />
              <button
                onClick={() => navigateTo("reports")}
                className={
                  active === "reports" ? "font-semibold text-slate-950" : ""
                }
                type="button"
              >
                Relatório
              </button>
            </div>

            <div className="ml-auto hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 md:flex">
              <span
                className={`h-2 w-2 rounded-full ${
                  isSupabaseConfigured ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {isSupabaseConfigured ? "Supabase conectado" : "Modo local"}
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 md:flex">
              <Building2 className="h-4 w-4" />
              Fluxo piloto Fortaleza
            </div>
          </div>
        </div>
      </header>

      <main>
        {active === "home" && (
          <HomeStoryLayer
            onOpenPilot={() => navigateTo("discover")}
            onViewReport={() => navigateTo("reports")}
            onViewPricing={() => navigateTo("pricing")}
            onGoAnalyze={() => navigateTo("analyze")}
            onGoTransact={() => navigateTo("transact")}
          />
        )}
        {active === "intake" && (
          <PropertyIntakeScreen
            evidenceDocuments={propertyEvidenceDocuments}
            importedOpportunities={importedOpportunities}
            onAddEvidenceDocument={handleAddEvidenceDocument}
            onAddOpportunity={handleAddImportedOpportunity}
            onGoDiscover={handleGoDiscover}
            onImportOpportunities={handleImportOpportunities}
          />
        )}
        {active === "discover" && (
          <DiscoverOpportunityDetail
            dossierRequestStatusByPropertyId={
              appState.dossierRequestStatusByPropertyId
            }
            onAnalyze={handleAnalyzeOpportunity}
            onRequestDossier={handleRequestDossier}
            onSearchThesisChange={handleSearchThesisChange}
            onSelectOpportunity={handleSelectOpportunity}
            opportunities={allDiscoverOpportunities}
            searchThesisText={appState.searchThesisText}
            selectedOpportunityId={appState.selectedOpportunityId}
          />
        )}
        {active === "analyze" && (
          <AnalyzePropertyProfile
            analysisSummary={selectedAnalysisSummary}
            dossierRequested={selectedDossierRequested}
            evidenceDocuments={selectedPropertyEvidenceDocuments}
            onRequestDossier={handleRequestDossier}
            onStartDueDiligence={() => navigateTo("transact")}
            onBackToDiscover={() => navigateTo("discover")}
            selectedOpportunity={selectedOpportunity}
            selectedProperty={selectedProperty}
          />
        )}
        {active === "transact" && (
          <TransactCommandCenter
            evidenceDocuments={selectedPropertyEvidenceDocuments}
            transactionData={selectedTransaction}
          />
        )}
        {active === "reports" && (
          <InvestorMemoReport
            evidenceDocuments={selectedPropertyEvidenceDocuments}
            onOpenTransaction={() => navigateTo("transact")}
            reportMemo={selectedReportMemo}
            selectedProperty={selectedProperty}
          />
        )}
        {active === "pricing" && <PricingModelScreen />}
        {active === "operations" && <OperationsConsole />}
      </main>
    </div>
  );
}
