import React from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Landmark,
  Layers3,
  Radar,
  Search,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const problemCards = [
  {
    title: "Informação fragmentada",
    text: "Dados de imóvel, matrícula, prefeitura, jurídico, mercado e transação ficam espalhados entre atores e fontes diferentes.",
    icon: Layers3,
  },
  {
    title: "Risco oculto",
    text: "Compradores e investidores muitas vezes descobrem problemas jurídicos, fiscais, urbanísticos ou documentais tarde demais.",
    icon: ShieldCheck,
  },
  {
    title: "Responsabilidade pouco clara",
    text: "Na transação, responsabilidades se dividem entre comprador, vendedor, corretor, advogado, banco, prefeitura e cartório.",
    icon: Users,
  },
  {
    title: "Baixa confiança na decisão",
    text: "É difícil saber se vale avançar com um ativo, se o preço é defensável e se a transação pode fechar com segurança.",
    icon: Target,
  },
];

const pillars = [
  {
    title: "Descobrir",
    question: "Quais oportunidades valem ser analisadas primeiro?",
    text: "Priorize imóveis e terrenos conforme a tese de investimento, considerando localização, lote, potencial urbanístico, liquidez e risco preliminar.",
    cta: "Buscar oportunidades",
    icon: Radar,
  },
  {
    title: "Analisar",
    question: "Vale avançar com este ativo?",
    text: "Avalie faixa de valor, contexto de mercado, potencial urbanístico, dados faltantes e riscos jurídicos, fiscais e municipais.",
    cta: "Analisar imóvel",
    icon: Search,
  },
  {
    title: "Tramitar",
    question: "Esta transação pode fechar com segurança?",
    text: "Acompanhe diligência, documentos, bloqueios, responsabilidades, trilha auditável e prontidão para fechamento.",
    cta: "Controlar diligência",
    icon: CheckCircle2,
  },
];

const pilotMetrics = [
  ["Candidatos encontrados", "12"],
  ["Ativos priorizados", "3"],
  ["Melhor encaixe", "86/100"],
  ["Prontidão para fechamento", "68%"],
];

const brazilCards = [
  {
    title: "Cartórios e registros avançam na digitalização, mas ainda são fragmentados",
    icon: Landmark,
  },
  {
    title: "Regras municipais e dados de Plano Diretor criam complexidade específica por imóvel",
    icon: Building2,
  },
  {
    title: "Riscos jurídicos, fiscais, dominiais e transacionais ainda exigem coordenação manual",
    icon: ShieldCheck,
  },
  {
    title: "Investidores precisam de uma camada estruturada entre busca, análise e fechamento",
    icon: FileText,
  },
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
      <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
        {title}
      </div>
      {description ? (
        <div className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
          {description}
        </div>
      ) : null}
    </div>
  );
}

type HomeStoryLayerProps = {
  onOpenPilot?: () => void;
  onViewReport?: () => void;
};

export default function HomeStoryLayer({
  onOpenPilot,
  onViewReport,
}: HomeStoryLayerProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.07),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <ShellCard className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(180,83,9,0.07),transparent_24%),radial-gradient(circle_at_88%_4%,rgba(15,23,42,0.06),transparent_25%)]" />
          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
                  Piloto Brasil
                </Badge>
                <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                  Descobrir → Analisar → Tramitar
                </Badge>
              </div>
              <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl">
                Tramita
              </h1>
              <p className="mt-4 max-w-3xl text-xl leading-relaxed text-slate-700 md:text-2xl">
                Infraestrutura de inteligência e transação imobiliária para o
                Brasil.
              </p>
              <p className="mt-5 max-w-4xl text-base leading-relaxed text-slate-600 md:text-lg">
                Tramita ajuda investidores e profissionais do mercado
                imobiliário a ir da descoberta de oportunidades à análise do
                imóvel e à execução da transação com dados claros, riscos
                explícitos, evidências documentadas e próximos passos definidos.
              </p>
              <div className="mt-6 rounded-[26px] border border-slate-200 bg-white/86 p-4 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Tese do produto
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  Encontrar o ativo. Entender o risco. Controlar a transação.
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="h-12 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-900"
                  onClick={onOpenPilot}
                >
                  Abrir fluxo piloto
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-slate-200 bg-white px-5"
                  onClick={onViewReport}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Ver memorando
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {pilotMetrics.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-sm"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {label}
                  </div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ShellCard>

        <ShellCard className="p-6 md:p-7">
          <SectionTitle
            eyebrow="Problema"
            title="O problema que o Tramita resolve"
            description="Decisões imobiliárias costumam acontecer em sistemas fragmentados, com responsabilidades pouco claras e evidências incompletas."
          />
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {problemCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 font-semibold text-slate-950">
                    {card.title}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-500">
                    {card.text}
                  </div>
                </div>
              );
            })}
          </div>
        </ShellCard>

        <ShellCard className="p-6 md:p-7">
          <SectionTitle
            eyebrow="Plataforma"
            title="Uma plataforma, três capacidades conectadas"
            description="O piloto conecta busca de oportunidades, inteligência do ativo e controle da transação em um único fluxo operacional."
          />
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.title}
                  className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-2xl font-semibold tracking-tight text-slate-950">
                        {pillar.title}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-700">
                        {pillar.question}
                      </div>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm leading-relaxed text-slate-500">
                    {pillar.text}
                  </div>
                  <div className="mt-5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                    {pillar.cta}
                  </div>
                </div>
              );
            })}
          </div>
        </ShellCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.9fr]">
          <ShellCard className="p-6 md:p-7">
            <SectionTitle
              eyebrow="Piloto"
              title="Cenário piloto: oportunidade de terreno em Fortaleza"
              description="O protótipo atual demonstra um fluxo completo para uma oportunidade de terreno em Fortaleza: busca de ativos candidatos, análise de um terreno selecionado no Meireles e abertura de um centro de comando da transação para diligência."
            />
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {pilotMetrics.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {label}
                  </div>
                  <div className="mt-2 text-xl font-semibold text-slate-950">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </ShellCard>

          <ShellCard className="p-6 md:p-7">
            <SectionTitle
              eyebrow="Por que agora"
              title="Por que isso importa no Brasil"
              description="O Brasil é um mercado inicial forte porque a oportunidade é grande, operacionalmente complexa e ainda depende de coordenação estruturada."
            />
            <div className="mt-5 space-y-3">
              {brazilCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm leading-relaxed text-slate-700">
                      {card.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}
