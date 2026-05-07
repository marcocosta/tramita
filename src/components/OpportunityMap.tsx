import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { Opportunity } from "../types/tramita";

type OpportunityMapProps = {
  center?: [number, number];
  onAnalyzeOpportunity?: (opportunityId: string) => void;
  onSelectOpportunity?: (opportunityId: string) => void;
  opportunities: Opportunity[];
  selectedOpportunityId?: string;
  zoom?: number;
};

const dataAvailabilityLabels: Record<Opportunity["dataAvailability"], string> =
  {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  };

const riskAccent: Record<Opportunity["riskLevel"], string> = {
  low: "#059669",
  medium: "#d97706",
  high: "#dc2626",
  unknown: "#64748b",
};

function createOpportunityIcon({
  imported,
  rank,
  riskLevel,
  selected,
}: {
  imported?: boolean;
  rank: number;
  riskLevel: Opportunity["riskLevel"];
  selected: boolean;
}) {
  const size = selected ? 48 : 38;
  const accent = riskAccent[riskLevel];
  const ring = selected ? "0 0 0 6px rgba(16,185,129,0.24)" : "0 0 0 3px rgba(255,255,255,0.92)";

  return L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #020617;
        border: 3px solid ${accent};
        color: white;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: ${selected ? 16 : 14}px;
        font-weight: 800;
        line-height: 1;
        box-shadow: ${ring}, 0 14px 30px rgba(15,23,42,0.32);
      ">
        ${rank}
        ${
          imported
            ? `<span style="
                position: absolute;
                right: -4px;
                bottom: -4px;
                width: 18px;
                height: 18px;
                border-radius: 999px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #2563eb;
                border: 2px solid white;
                color: white;
                font-size: 10px;
                font-weight: 800;
              ">I</span>`
            : ""
        }
      </div>
    `,
    iconAnchor: [size / 2, size / 2],
    iconSize: [size, size],
    popupAnchor: [0, -size / 2],
    tooltipAnchor: [size / 2 + 8, -size / 2],
  });
}

function MapAutoFocus({
  center,
  opportunities,
  selectedOpportunityId,
  zoom,
}: {
  center: [number, number];
  opportunities: Opportunity[];
  selectedOpportunityId?: string;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    const selected = opportunities.find(
      (opportunity) => opportunity.id === selectedOpportunityId,
    );

    if (selected) {
      map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 13), {
        duration: 0.35,
      });
      return;
    }

    if (opportunities.length > 1) {
      const bounds = L.latLngBounds(
        opportunities.map((opportunity) => [opportunity.lat, opportunity.lng]),
      );
      map.fitBounds(bounds, { maxZoom: 13, padding: [42, 42] });
      return;
    }

    if (opportunities.length === 1) {
      map.flyTo([opportunities[0].lat, opportunities[0].lng], 13, {
        duration: 0.35,
      });
      return;
    }

    map.setView(center, zoom);
  }, [center, map, opportunities, selectedOpportunityId, zoom]);

  return null;
}

export default function OpportunityMap({
  center = [-3.735, -38.5],
  onAnalyzeOpportunity,
  onSelectOpportunity,
  opportunities,
  selectedOpportunityId,
  zoom = 12,
}: OpportunityMapProps) {
  const selectedOpportunity = opportunities.find(
    (opportunity) => opportunity.id === selectedOpportunityId,
  );
  const markerIcons = useMemo(
    () =>
      opportunities.map((opportunity, index) =>
        createOpportunityIcon({
          imported: opportunity.imported,
          rank: index + 1,
          riskLevel: opportunity.riskLevel,
          selected: opportunity.id === selectedOpportunityId,
        }),
      ),
    [opportunities, selectedOpportunityId],
  );

  return (
    <div className="relative h-[430px] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 md:h-[500px] lg:h-[520px]">
      <MapContainer
        center={center}
        className="h-full w-full"
        scrollWheelZoom
        zoom={zoom}
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapAutoFocus
          center={center}
          opportunities={opportunities}
          selectedOpportunityId={selectedOpportunityId}
          zoom={zoom}
        />
        {opportunities.map((opportunity, index) => {
          const selected = opportunity.id === selectedOpportunityId;

          return (
            <Marker
              eventHandlers={{
                click: () => onSelectOpportunity?.(opportunity.id),
              }}
              icon={markerIcons[index]}
              key={opportunity.id}
              position={[opportunity.lat, opportunity.lng]}
              zIndexOffset={selected ? 1000 : index}
            >
              {selected ? (
                <Tooltip
                  className="!max-w-[220px] !rounded-full !border-slate-200 !bg-white/95 !px-3 !py-1.5 !text-slate-900 !shadow-lg"
                  direction="top"
                  offset={[0, -24]}
                  opacity={1}
                  permanent
                >
                  <div className="truncate text-xs font-semibold">
                    {opportunity.title} · Fit {opportunity.fitScore}/100
                  </div>
                </Tooltip>
              ) : null}
              {!selected ? (
                <Popup>
                <div className="min-w-[190px] space-y-2 font-sans">
                  <div>
                    <div className="text-sm font-semibold text-slate-950">
                      {opportunity.title}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {opportunity.region} · {opportunity.city}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {[
                      ["Fit", `${opportunity.fitScore}/100`],
                      [
                        "Dados",
                        dataAvailabilityLabels[opportunity.dataAvailability],
                      ],
                      [
                        "Fonte",
                        opportunity.sourceLabel ?? opportunity.primarySourceLabel,
                      ],
                    ].map(([label, value]) => (
                      <div
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1"
                        key={label}
                      >
                        <div className="text-slate-500">{label}</div>
                        <div className="font-semibold text-slate-950">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                      onClick={() => onSelectOpportunity?.(opportunity.id)}
                      type="button"
                    >
                      Selecionar
                    </button>
                    <button
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      onClick={() => onAnalyzeOpportunity?.(opportunity.id)}
                      type="button"
                    >
                      Analisar
                    </button>
                  </div>
                </div>
                </Popup>
              ) : null}
            </Marker>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-3 right-3 z-[500] w-[150px] rounded-2xl border border-white/70 bg-white/88 p-2 text-[10px] text-slate-600 shadow-lg backdrop-blur">
        <div className="font-semibold text-slate-950">Legenda</div>
        <div className="mt-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-amber-500 bg-slate-950 shadow-sm" />
            oportunidade
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-slate-950 shadow-[0_0_0_3px_rgba(16,185,129,0.22)]" />
            selecionada
          </div>
        </div>
      </div>

      {selectedOpportunity ? (
        <div className="absolute bottom-3 left-3 z-[500] max-w-[250px] rounded-2xl border border-white/70 bg-white/94 p-3 shadow-xl backdrop-blur">
          <div className="text-sm font-semibold text-slate-950">
            {selectedOpportunity.title}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {selectedOpportunity.region} · {selectedOpportunity.city}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
              Fit {selectedOpportunity.fitScore}/100
            </span>
            {selectedOpportunity.imported ? (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                Importado
              </span>
            ) : null}
          </div>
          {onAnalyzeOpportunity ? (
            <button
              className="mt-2 w-full rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              onClick={() => onAnalyzeOpportunity(selectedOpportunity.id)}
              type="button"
            >
              Analisar
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
