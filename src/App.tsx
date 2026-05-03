import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Radar,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import DiscoverOpportunityDetail from "./DiscoverOpportunityDetail";
import AnalyzePropertyProfile from "./AnalyzePropertyProfile";
import TransactCommandCenter from "./TransactCommandCenter";

type ActiveScreen = "discover" | "analyze" | "transact";

const navItems: Array<{
  key: ActiveScreen;
  label: string;
  description: string;
}> = [
  {
    key: "discover",
    label: "Discover",
    description: "Find opportunities",
  },
  {
    key: "analyze",
    label: "Analyze",
    description: "Value, potential, risk",
  },
  {
    key: "transact",
    label: "Transact",
    description: "Diligence and closing",
  },
];

export default function App() {
  const [active, setActive] = useState<ActiveScreen>("discover");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-4 py-3 md:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-sm">
              T
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight text-slate-950">
                Tramita
              </div>
              <div className="text-sm text-slate-500">
                Real estate intelligence platform
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-1 shadow-sm">
              {navItems.map((item) => {
                const selected = active === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => setActive(item.key)}
                    className={`min-w-[128px] rounded-xl px-4 py-2 text-left transition ${
                      selected
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white hover:text-slate-950"
                    }`}
                    type="button"
                  >
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div
                      className={`mt-0.5 text-xs ${
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
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 shadow-sm">
              <Radar className="h-4 w-4" />
              <button
                onClick={() => setActive("discover")}
                className={
                  active === "discover" ? "font-semibold text-slate-950" : ""
                }
                type="button"
              >
                Discover
              </button>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 shadow-sm">
              <SearchCheck className="h-4 w-4" />
              <button
                onClick={() => setActive("analyze")}
                className={
                  active === "analyze" ? "font-semibold text-slate-950" : ""
                }
                type="button"
              >
                Analyze
              </button>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              <button
                onClick={() => setActive("transact")}
                className={
                  active === "transact" ? "font-semibold text-slate-950" : ""
                }
                type="button"
              >
                Transact
              </button>
            </div>

            <div className="ml-auto hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 md:flex">
              <Building2 className="h-4 w-4" />
              Fortaleza pilot flow
            </div>
          </div>
        </div>
      </header>

      <main>
        {active === "discover" && (
          <DiscoverOpportunityDetail onAnalyze={() => setActive("analyze")} />
        )}
        {active === "analyze" && (
          <AnalyzePropertyProfile
            onStartDueDiligence={() => setActive("transact")}
          />
        )}
        {active === "transact" && <TransactCommandCenter />}
      </main>
    </div>
  );
}
