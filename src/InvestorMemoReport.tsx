import React from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  Layers3,
  Landmark,
  Share2,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const summaryMetrics = [
  ["Encaixe da oportunidade", "86/100"],
  ["Valor estimado", "R$ 2,8M–3,4M"],
  ["Potencial urbanístico", "Alto / sujeito à confirmação"],
  ["Prontidão da transação", "68%"],
  ["Nível de risco", "Médio"],
];

const sourcingReasons = [
  "Forte encaixe de localização",
  "Tamanho do lote compatível com a tese",
  "Potencial urbanístico parece atrativo",
  "Sinal de liquidez favorável",
  "Requer validação documental",
];

const propertyFacts = [
  ["Área", "1.240 m²"],
  ["Frente", "28 m"],
  ["Uso atual", "Residencial baixo"],
  ["Zona", "A confirmar"],
  ["Matrícula", "Não anexada"],
  ["IPTU", "Pendente"],
];

const validationItems = [
  "Plano Diretor",
  "Coeficiente de aproveitamento",
  "Taxa de ocupação",
  "Recuos",
  "Altura máxima",
  "Uso permitido",
];

const risks = [
  ["Matrícula", "Pendente", "amber"],
  ["IPTU/cadastro municipal", "Não verificado", "slate"],
  ["Plano Diretor", "Atenção", "amber"],
  ["Liquidez", "Favorável", "green"],
  ["Financiamento/documentação", "Documento do comprador pendente", "red"],
] as const;

const readiness = [
  ["Documentos", "82%", 82],
  ["Jurídico", "88%", 88],
  ["Financeiro", "51%", 51],
  ["Prontidão para fechamento", "68%", 68],
] as const;

const nextSteps = [
  "Obter matrícula atualizada",
  "Verificar IPTU/cadastro municipal",
  "Confirmar parâmetros urbanísticos oficiais",
  "Solicitar documento financeiro do comprador",
  "Recalcular confiança após dados oficiais",
  "Decidir se avança para oferta vinculante",
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

function ReadinessRow({
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

export default function InvestorMemoReport() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.07),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <ShellCard className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(180,83,9,0.06),transparent_23%),radial-gradient(circle_at_90%_10%,rgba(15,23,42,0.06),transparent_25%)]" />
          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <ToneBadge tone="blue">Memorando gerado</ToneBadge>
                <ToneBadge tone="green">Vale aprofundar diligência</ToneBadge>
                <ToneBadge tone="amber">Risco médio</ToneBadge>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Memorando Tramita
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600 md:text-xl">
                Terreno em Meireles · Fortaleza, CE
              </p>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white/88 p-5 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Recomendação principal
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Vale aprofundar diligência
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                A oportunidade de terreno no Meireles mostra forte encaixe com
                a tese-alvo com base em localização, tamanho do lote, valor
                estimado de mercado e potencial urbanístico preliminar.
              </p>
            </div>
          </div>
        </ShellCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-6">
            <ShellCard className="p-6">
              <SectionTitle
                eyebrow="Sumário executivo"
                title="Recomendação e contexto de decisão"
                description="Os principais riscos seguem ligados à confirmação de parâmetros urbanísticos oficiais, validação da matrícula, IPTU/cadastro municipal e documentação da etapa de financiamento."
              />
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {summaryMetrics.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {label}
                    </div>
                    <div className="mt-2 text-sm font-semibold leading-snug text-slate-950">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                eyebrow="Busca de oportunidade"
                title="Resumo da busca"
                description="Tese de busca: Fortaleza · 800–2.000 m² · potencial residencial/uso misto."
              />
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Candidatos encontrados", "12"],
                    ["Shortlist", "3"],
                    ["Ativo selecionado", "Terreno · Meireles"],
                    ["Melhor encaixe", "86/100"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        {label}
                      </div>
                      <div className="mt-2 text-sm font-semibold leading-snug text-slate-950">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {sourcingReasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div className="text-sm leading-relaxed text-slate-700">
                        {reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                eyebrow="Análise do imóvel"
                title="Valor, confiança e contexto de mercado"
                description="Faixa estimada de valor: R$ 2,8M–3,4M. Centro da faixa: R$ 3,1M. Confiança: 74%."
              />
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                {propertyFacts.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {label}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-950">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="font-semibold text-slate-950">
                  Contexto de mercado
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Terrenos comparáveis próximos ao Meireles indicam liquidez
                  média-alta e uma faixa de valor defensável, sujeita à
                  validação documental oficial.
                </p>
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                eyebrow="Potencial urbanístico"
                title="Plano Diretor e tese de desenvolvimento"
                description="O uso potencial inclui residencial vertical, uso misto e serviços, sujeito à confirmação oficial."
              />
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
                  <div className="text-sm text-emerald-700">
                    Potencial preliminar
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-emerald-950">
                    Alto
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-emerald-800">
                    Tese atrativa, mas ainda não vinculante. As premissas
                    urbanísticas devem ser confirmadas por parâmetros oficiais
                    municipais.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {validationItems.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                eyebrow="Risco e dados faltantes"
                title="Risco verificado versus desconhecidos"
                description="Desconhecido não significa negativo. O Tramita separa risco verificado de dados faltantes para evitar falsa certeza."
              />
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {risks.map(([label, status, tone]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-slate-950">
                        {label}
                      </div>
                      <ToneBadge tone={tone}>{status}</ToneBadge>
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                eyebrow="Próximos passos recomendados"
                title="Ações de diligência antes de uma oferta vinculante"
                description="Os próximos passos convertem dados faltantes em evidência explícita e confiança atualizada."
              />
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {nextSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div className="text-sm font-medium leading-relaxed text-slate-700">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>
          </main>

          <aside className="space-y-6 lg:sticky lg:top-8">
            <ShellCard className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Status da transação
                  </div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    Etapa de financiamento
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Etapa", "Financiamento"],
                  ["Bloqueio principal", "Comprovante de renda complementar do comprador"],
                  ["Responsável atual", "Comprador"],
                  ["Prontidão para fechamento", "68%"],
                  ["Bloqueios críticos", "1"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {label}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-950">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-5">
                {readiness.map(([label, value, progress]) => (
                  <ReadinessRow
                    key={label}
                    label={label}
                    value={value}
                    progress={progress}
                  />
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-6">
              <SectionTitle
                title="Artefatos do memorando"
                description="Saída preparada a partir dos sinais de Descobrir, Analisar e Tramitar."
              />
              <div className="mt-5 space-y-3">
                {[
                  {
                    icon: FileText,
                    title: "Memorando pronto para investidor",
                    text: "Sumário executivo, riscos, contexto de valuation e próximos passos.",
                  },
                  {
                    icon: Layers3,
                    title: "Estrutura de evidências",
                    text: "Separa sinais verificados de premissas e dados faltantes.",
                  },
                  {
                    icon: Building2,
                    title: "Contexto específico do Brasil",
                    text: "Plano Diretor, cadastro municipal, matrícula, IPTU e fluxo de cartório.",
                  },
                  {
                    icon: Landmark,
                    title: "Handoff para transação",
                    text: "Conecta decisão de investimento com responsabilidade da diligência.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
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
                title="Ações de exportação"
                description="Ações estáticas do protótipo para um futuro fluxo de relatórios."
              />
              <div className="mt-5 space-y-3">
                <Button className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-900">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-slate-200 bg-white"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar memorando
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-slate-200 bg-white"
                >
                  Abrir transação
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </ShellCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
