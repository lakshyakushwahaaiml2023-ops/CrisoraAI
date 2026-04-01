"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Need, Volunteer, NGO, RiskZone } from '@/lib/types';
import { Shield, AlertTriangle, UserPlus, HeartPulse } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet-icons/marker-icon-2x.png',
  iconUrl: '/leaflet-icons/marker-icon.png',
  shadowUrl: '/leaflet-icons/marker-shadow.png',
});

// Tactical Industrial Icons
const createIcon = (color: string, iconHtml: string) => L.divIcon({
  className: 'tactical-marker',
  html: `<div style="background-color: #000; width: 34px; height: 34px; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px ${color}44; color: ${color}; position: relative;">
    <div style="position: absolute; top: -5px; left: -5px; width: 6px; height: 6px; border-top: 1.5px solid ${color}; border-left: 1.5px solid ${color};"></div>
    <div style="position: absolute; bottom: -5px; right: -5px; width: 6px; height: 6px; border-bottom: 1.5px solid ${color}; border-right: 1.5px solid ${color};"></div>
    ${iconHtml}
  </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const NeedIcon = {
  food: createIcon('#3b82f6', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'),
  water: createIcon('#0ea5e9', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>'),
  medical: createIcon('#ef4444', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>'),
  shelter: createIcon('#10b981', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>'),
  rescue: createIcon('#f97316', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>'),
  other: createIcon('#8b5cf6', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>')
};

const VolunteerIcon = createIcon('#10b981', '<span style="font-family:var(--font-mono); font-weight:900; font-size:14px; letter-spacing:-1px;">VOL</span>');
const NGOIcon = createIcon('#FF4F00', '<span style="font-family:var(--font-mono); font-weight:900; font-size:14px; letter-spacing:-1px;">HUB</span>');

// 🚨 SPECIAL PANIC ICON (FOR SOS)
const PanicIcon = L.divIcon({
  className: 'tactical-marker panic-marker-ping',
  html: `<div style="background-color: #7f1d1d; width: 38px; height: 38px; border: 3px solid #ef4444; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px #ef4444; color: #fff; position: relative; animation: pulse-red 1s infinite;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
    <div style="position: absolute; -top: 8px; -left: 8px; width: 54px; height: 54px; border: 1px solid #ef4444; border-radius: 50%; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
  </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

interface LiveMapProps {
  needs: Need[];
  volunteers: Volunteer[];
  ngos: NGO[];
  riskZones?: RiskZone[];
  center?: { lat: number, lng: number };
  zoom?: number;
  interactive?: boolean;
  showEpicenter?: { lat: number, lng: number, radius: number };
  showDispatchLines?: boolean;
  satellite?: boolean;
  showHeatmap?: boolean;
}

export default function LiveMap({ 
  needs, volunteers, ngos, riskZones = [], 
  center = { lat: 22.7196, lng: 75.8577 }, 
  zoom = 12, interactive = true,
  showEpicenter, showDispatchLines = true,
  satellite = false, showHeatmap = true
}: LiveMapProps) {
  
  return (
    <div className="w-full h-full relative z-0 rounded-none border border-[#2D3139] overflow-hidden group">
      {/* TACTICAL MAP OVERLAY GRID */}
      <div className="absolute inset-0 pointer-events-none z-[1000] opacity-10" style={{ 
        backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
        backgroundSize: '50px 50px' 
      }} />
      <div className="absolute top-2 left-10 z-[1000] font-mono-data text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] bg-black/60 px-2 py-1 border border-emerald-500/30">
        
      </div>
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', background: '#0F1117' }}
        zoomControl={interactive}
        dragging={interactive}
        scrollWheelZoom={interactive}
      >
        {satellite ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
        ) : (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          />
        )}

        {/* Risk Zones */}
        {riskZones.map(zone => (
          <Polygon 
            key={zone.id}
            positions={zone.polygon.map(p => [p.lat, p.lng])}
            color={zone.risk_level === 'red' ? '#E24B4A' : zone.risk_level === 'orange' ? '#EF9F27' : '#10B981'}
            fillOpacity={0.2}
            weight={2}
          >
            <Popup className="glass-popup">
              <div className="p-2">
                <h3 className="font-bold text-lg">{zone.region}</h3>
                <p className="text-sm">Risk Score: {zone.risk_score}/100</p>
                <div className="mt-2 text-xs opacity-70">
                  Forecast for: {new Date(zone.forecast_time).toLocaleString()}
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Incident Epicenter */}
        {showEpicenter && (
          <>
            <Circle 
              center={[showEpicenter.lat, showEpicenter.lng]}
              radius={showEpicenter.radius}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 2 }}
            />
            <Circle 
              center={[showEpicenter.lat, showEpicenter.lng]}
              radius={showEpicenter.radius * 0.4}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3, weight: 1 }}
              className="animate-pulse"
            />
          </>
        )}

        {/* Tactical Heatmap Layer */}
        {showHeatmap && needs.filter(n => n.status === 'pending' && (n.triage_score || 0) > 40).map(need => (
          <React.Fragment key={`heat_${need.id}`}>
            <Circle 
              center={[need.location.lat, need.location.lng]}
              radius={800}
              pathOptions={{ 
                fillColor: (need.triage_score || 0) >= 80 ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.1, 
                weight: 0,
                stroke: false
              }}
            />
            {(need.triage_score || 0) >= 80 && (
              <Circle 
                center={[need.location.lat, need.location.lng]}
                radius={400}
                pathOptions={{ 
                  fillColor: '#ef4444',
                  fillOpacity: 0.2, 
                  weight: 0,
                  stroke: false
                }}
                className="leaflet-pulse"
              />
            )}
          </React.Fragment>
        ))}

        {/* Dispatch Lines */}
        {showDispatchLines && needs.map(need => {
          if (['accepted', 'in_progress'].includes(need.status) && need.assigned_to && need.location) {
            const vol = volunteers.find(v => v.id === need.assigned_to);
            if (vol && vol.location) {
              return (
                <Polyline 
                  key={`dispatch_${need.id}`}
                  positions={[
                    [need.location.lat, need.location.lng],
                    [vol.location.lat, vol.location.lng]
                  ]}
                  pathOptions={{ 
                    color: '#FF4F00', 
                    weight: 1.5, 
                    dashArray: '4, 8',
                    opacity: 0.8
                  }}
                />
              );
            }
          }
          return null;
        })}

        <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
          {/* Needs */}
          {needs.map(need => (
            need.status !== 'closed' && need.location && (
              <React.Fragment key={need.id}>
                {/* High-intensity aura for panic signals */}
                {need.urgency_level >= 99 && (
                   <Circle 
                     center={[need.location.lat, need.location.lng]}
                     radius={400}
                     pathOptions={{ 
                       color: '#ef4444', 
                       fillColor: '#ef4444', 
                       fillOpacity: 0.15, 
                       weight: 2 
                     }}
                     className="leaflet-pulse"
                   />
                )}
                {need.urgency_level >= 99 && (
                   <Circle 
                     center={[need.location.lat, need.location.lng]}
                     radius={150}
                     pathOptions={{ 
                       color: '#ef4444', 
                       fillColor: '#ef4444', 
                       fillOpacity: 0.4, 
                       weight: 1 
                     }}
                   />
                )}
                <Marker 
                  position={[need.location.lat, need.location.lng]}
                  icon={need.urgency_level >= 99 ? PanicIcon : NeedIcon[need.need_type]}
                >
                  <Popup>
                    <div className="p-1 min-w-[200px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold uppercase text-xs tracking-wider opacity-60">{need.need_type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          need.urgency_label === 'critical' || need.urgency_level >= 90 ? 'bg-red-500/20 text-red-400' :
                          need.urgency_label === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {need.urgency_level >= 99 ? 'MASS PANIC' : need.urgency_label}
                        </span>
                      </div>
                      <p className="font-bold text-lg mb-1">{need.people_affected} people affected</p>
                      {need.description && <p className="text-sm opacity-80 mb-2">{need.description}</p>}
                      <div className="text-xs opacity-60">
                        Reported: {formatDistanceToNow(new Date(need.created_at))} ago
                      </div>
                      {need.triage_score && (
                        <div className="mt-2 text-xs font-mono bg-white/10 px-2 py-1 rounded inline-block text-emerald-400 border border-emerald-500/20">
                          AI SOS SIGNATURE: {need.triage_score}/100
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            )
          ))}

          {/* Volunteers */}
          {volunteers.map(vol => (
            vol.online && vol.location && (
              <Marker 
                key={vol.id}
                position={[vol.location.lat, vol.location.lng]}
                icon={VolunteerIcon}
              >
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <h3 className="font-bold">{vol.name}</h3>
                    <p className="text-xs opacity-70 mb-2">Rating: {vol.rating} ⭐</p>
                    <div className="flex flex-wrap gap-1">
                      {vol.skills.map(s => (
                        <span key={s} className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* NGOs */}
          {ngos.map(ngo => (
            <Marker
              key={ngo.id}
              position={[ngo.hq_location.lat, ngo.hq_location.lng]}
              icon={NGOIcon}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold">{ngo.org_name}</h3>
                  <p className="text-sm mb-1">{ngo.staff_count} Staff Members</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
