import React from "react";
import { motion } from "framer-motion";
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
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

const facts = [
  ["Área", "1.240 m²"],
  ["Frente", "28 m"],
  ["Tipo", "Terreno urbano"],
  ["Uso atual", "Residencial baixo"],
  ["Zona", "A confirmar"],
  ["IPTU", "Pendente"],
  ["Matrícula", "Não anexada"],
  ["Liquidez", "Média-alta"],
];

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

export default function TramitaAnalyzePropertyProfile() {
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-sm">T</div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-slate-950">Tramita</div>
              <div className="text-sm text-slate-500">Property intelligence profile</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="h-11 rounded-2xl border-slate-200 bg-white/95 pl-10 shadow-sm" value="Terreno em Meireles, Fortaleza" readOnly />
            </div>
            <Button variant="outline" className="h-11 rounded-2xl border-slate-200 bg-white">Salvar análise</Button>
            <Button className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-900">Iniciar due diligence</Button>
          </div>
        </motion.header>

        <ShellCard className="relative overflow-hidden p-5 md:p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(180,83,9,0.06),transparent_23%),radial-gradient(circle_at_90%_10%,rgba(15,23,42,0.06),transparent_25%)]" />
          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <ToneBadge tone="blue">Análise preliminar</ToneBadge>
                <ToneBadge tone="green">Confiança média-alta</ToneBadge>
                <ToneBadge tone="amber">Potencial de incorporação</ToneBadge>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">Terreno em Meireles</h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                1.240 m² · Zona urbana consolidada · Próximo à Av. Santos Dumont · Fortaleza, CE
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Valor estimado", "R$ 2,8M–3,4M"],
                ["Centro da faixa", "R$ 3,1M"],
                ["Confiança", "74%"],
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
              <SectionTitle eyebrow="Property facts" title="Dados principais" description="Informações base para leitura de valor, potencial e risco." />
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {facts.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-none">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-950">{value}</div>
                  </div>
                ))}
              </div>
            </ShellCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ShellCard className="p-6">
                <SectionTitle eyebrow="Primary insight" title="Valor estimado" description="Faixa defensável, não número absoluto." />
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
                <SectionTitle eyebrow="Market context" title="Contexto de mercado" description="Leitura rápida de liquidez e referência de preço." />
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
              <SectionTitle eyebrow="Primary insight" title="Potencial urbanístico" description="O que o ativo pode se tornar, sujeito à confirmação urbanística." />
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
              <SectionTitle eyebrow="Risk" title="Sinais de risco e validação" description="Separando problema encontrado, dado pendente e sinal favorável." />
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
                <ScoreRow label="Valor" value="74/100" progress={74} />
                <ScoreRow label="Potencial" value="82/100" progress={82} />
                <ScoreRow label="Confiança" value="68%" progress={68} />
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
                <Button className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-900">
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
    </div>
  );
}
