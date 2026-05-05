import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import type { Opportunity } from "../types/tramita";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type OpportunityMapProps = {
  center?: [number, number];
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

function MapFocus({
  opportunities,
  selectedOpportunityId,
}: {
  opportunities: Opportunity[];
  selectedOpportunityId?: string;
}) {
  const map = useMap();

  useEffect(() => {
    const selected = opportunities.find(
      (opportunity) => opportunity.id === selectedOpportunityId,
    );

    if (selected) {
      map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 13), {
        duration: 0.45,
      });
      return;
    }

    if (opportunities.length > 1) {
      const bounds = L.latLngBounds(
        opportunities.map((opportunity) => [opportunity.lat, opportunity.lng]),
      );
      map.fitBounds(bounds, { maxZoom: 13, padding: [28, 28] });
    }
  }, [map, opportunities, selectedOpportunityId]);

  return null;
}

export default function OpportunityMap({
  center = [-3.735, -38.5],
  onSelectOpportunity,
  opportunities,
  selectedOpportunityId,
  zoom = 12,
}: OpportunityMapProps) {
  return (
    <div className="h-[390px] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 md:h-[440px]">
      <MapContainer
        center={center}
        className="h-full w-full"
        scrollWheelZoom
        zoom={zoom}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus
          opportunities={opportunities}
          selectedOpportunityId={selectedOpportunityId}
        />
        {opportunities.map((opportunity) => {
          const selected = opportunity.id === selectedOpportunityId;

          return (
            <Marker
              eventHandlers={{
                click: () => onSelectOpportunity?.(opportunity.id),
              }}
              key={opportunity.id}
              position={[opportunity.lat, opportunity.lng]}
            >
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
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                      <div className="text-slate-500">Fit</div>
                      <div className="font-semibold text-slate-950">
                        {opportunity.fitScore}/100
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                      <div className="text-slate-500">Dados</div>
                      <div className="font-semibold text-slate-950">
                        {dataAvailabilityLabels[opportunity.dataAvailability]}
                      </div>
                    </div>
                  </div>
                  <button
                    className={`w-full rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      selected
                        ? "bg-slate-200 text-slate-700"
                        : "bg-slate-950 text-white hover:bg-slate-800"
                    }`}
                    onClick={() => onSelectOpportunity?.(opportunity.id)}
                    type="button"
                  >
                    {selected ? "Selecionado" : "Selecionar"}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
