import type { ReactNode } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Coins,
  CreditCard,
  FileText,
  Handshake,
  Layers3,
  Search,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const strategyCards = [
  {
    title: "Uso por oportunidade",
    text: "Muitos usuários decidem por imóvel, não por uso diário.",
    icon: Search,
  },
  {
    title: "Custo variável de dados",
    text: "Fontes, parceiros e pesquisas podem variar por cidade e tipo de dossiê.",
    icon: Layers3,
  },
  {
    title: "Valor claro por entrega",
    text: "O usuário entende melhor pagar por um dossiê, relatório ou workspace específico.",
    icon: FileText,
  },
];

const commercialPlans = [
  {
    title: "Prévia gratuita",
    subtitle: "Para gerar confiança e demanda.",
    price: "Sem cobrança inicial",
    cta: "Explorar oportunidades",
    icon: Sparkles,
    items: [
      "Busca por tese",
      "Fit preliminar",
      "Disponibilidade de dados",
      "Riscos e pendências aparentes",
    ],
  },
  {
    title: "Dossiê avulso",
    subtitle: "Para uma propriedade específica.",
    price: "Preço a definir",
    cta: "Solicitar dossiê",
    icon: CreditCard,
    items: [
      "Matrícula / cartório quando disponível",
      "IPTU / cadastro municipal",
      "Plano Diretor / parâmetros urbanísticos",
      "Comparáveis e faixa revisada",
      "Memorando do imóvel",
    ],
  },
  {
    title: "Créditos profissionais",
    subtitle: "Para advogados, corretores, investidores e incorporadores.",
    price: "Pacotes por volume",
    cta: "Ver créditos",
    icon: Coins,
    items: [
      "Pacotes de dossiês",
      "Histórico de solicitações",
      "Relatórios padronizados",
      "Fila de operações",
      "Colaboração por equipe",
    ],
  },
  {
    title: "Enterprise / Parceiros",
    subtitle: "Para empresas imobiliárias, incorporadoras, escritórios e fundos.",
    price: "Valor conforme escopo",
    cta: "Falar sobre parceria",
    icon: Handshake,
    items: [
      "Fluxo privado de oportunidades",
      "Integração de dados",
      "White-label reports",
      "SLA operacional",
      "Customização por cliente",
    ],
  },
];

const revenueFlow = [
  "Prévia gratuita",
  "Solicitar dossiê",
  "Operações / validação",
  "Memorando",
  "Workspace de transação",
  "Plano profissional / enterprise",
];

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

function BadgePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

export default function PricingModelScreen() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.07),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <ShellCard className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(180,83,9,0.07),transparent_24%),radial-gradient(circle_at_88%_8%,rgba(15,23,42,0.06),transparent_25%)]" />
          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <BadgePill>Pay-per-use</BadgePill>
                <BadgePill>Créditos B2B</BadgePill>
                <BadgePill>Enterprise</BadgePill>
                <BadgePill>Dossiê sob demanda</BadgePill>
              </div>
              <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Modelo comercial
              </div>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Modelo comercial do Tramita
              </h1>
              <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-600 md:text-lg">
                O Tramita pode começar com prévias gratuitas e dossiês sob
                demanda, evoluindo para créditos profissionais, workspaces de
                transação e integrações B2B conforme o volume e a
                disponibilidade de dados crescem.
              </p>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white/88 p-5 shadow-sm">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Recomendação inicial
                  </div>
                  <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                    Pay-per-use + créditos profissionais.
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    A prévia gratuita cria demanda. O dossiê pago transforma
                    dados difíceis em entrega clara, rastreável e monetizável.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ShellCard>

        <ShellCard className="p-6 md:p-7">
          <SectionTitle
            eyebrow="Estratégia"
            title="Por que não começar apenas com assinatura"
            description="A unidade econômica inicial fica mais clara quando a cobrança acompanha o valor entregue por ativo, dossiê ou workspace."
          />
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {strategyCards.map((card) => {
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
          <div className="mt-4 rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <div className="font-semibold">
                  Recomendação inicial: pay-per-use + créditos profissionais.
                </div>
                <div className="mt-1 text-sm leading-relaxed text-emerald-800">
                  A assinatura pode surgir depois, quando houver padrão claro de
                  recorrência e volume por equipe.
                </div>
              </div>
            </div>
          </div>
        </ShellCard>

        <ShellCard className="p-6 md:p-7">
          <SectionTitle
            eyebrow="Ofertas"
            title="Linhas comerciais possíveis"
            description="Quatro formas de capturar valor sem transformar o produto em checkout ou marketplace."
          />
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {commercialPlans.map((plan) => {
              const Icon = plan.icon;

              return (
                <div
                  key={plan.title}
                  className="flex min-h-full flex-col rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xl font-semibold tracking-tight text-slate-950">
                        {plan.title}
                      </div>
                      <div className="mt-2 text-sm leading-relaxed text-slate-500">
                        {plan.subtitle}
                      </div>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-900">
                    {plan.price}
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {plan.items.map((item) => (
                      <div key={item} className="flex gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span className="leading-relaxed text-slate-600">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-auto h-11 rounded-2xl border-slate-200 bg-white"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </ShellCard>

        <ShellCard className="p-6 md:p-7">
          <SectionTitle
            eyebrow="Receita"
            title="Fluxo de conversão"
            description="A monetização acompanha a maturidade do dado: da curiosidade inicial até operação, relatório e workspace."
          />
          <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-stretch">
            {revenueFlow.map((step, index) => (
              <div key={step} className="flex flex-1 items-center gap-3">
                <div className="flex min-h-[78px] flex-1 items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-center text-sm font-semibold leading-snug text-slate-800">
                  {step}
                </div>
                {index < revenueFlow.length - 1 ? (
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-400 xl:block" />
                ) : null}
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard className="p-6 md:p-7">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionTitle
              eyebrow="Piloto"
              title="Decisão de pricing para o piloto"
              description="No piloto, o modelo mais seguro é cobrar por dossiê ou por pacote de créditos, sem exigir assinatura antecipada. A assinatura pode vir depois, quando o padrão de uso recorrente estiver claro."
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                "Começar com dossiê avulso",
                "Oferecer créditos para profissionais",
                "Negociar enterprise caso a caso",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm font-semibold leading-snug text-slate-800"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
