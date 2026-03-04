import React, { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

/**
 * WebMap - Leaflet tabanlı gerçek harita bileşeni (sadece web).
 * Props:
 *   markers: [{ id, lat, lng, label, color }]
 *   center: { lat, lng }
 *   zoom: number
 *   onMarkerPress: (marker) => void
 */
export default function WebMap({ markers = [], center = { lat: 39.925, lng: 32.836 }, zoom = 13, onMarkerPress }) {
  const iframeRef = useRef(null);

  const handleMessage = useCallback((e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.type === 'markerClick' && onMarkerPress) {
        onMarkerPress(data.marker);
      }
    } catch {}
  }, [onMarkerPress]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  if (Platform.OS !== 'web') {
    return <View style={styles.fallback} />;
  }

  const markersJSON = JSON.stringify(markers);

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
  *{margin:0;padding:0}
  html,body,#map{width:100%;height:100%}
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([${center.lat}, ${center.lng}], ${zoom});

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  var markers = ${markersJSON};
  markers.forEach(function(m) {
    var c = m.color || '#22C55E';
    var icon = L.divIcon({
      className: '',
      html: '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="width:42px;height:42px;border-radius:50%;background:' + c +
            ';display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.3);border:3px solid #fff;">' +
            '<svg width="20" height="22" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="4" y="2" width="14" height="66" rx="4" fill="#fff"/>' +
            '<path d="M18 2 H38 C50 2 58 12 58 24 C58 36 50 46 38 46 H18 V2Z" fill="none" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>' +
            '<rect x="8" y="6" width="8" height="58" rx="2" fill="' + c + '"/>' +
            '<path d="M16 8 H36 C46 8 52 16 52 24 C52 32 46 40 36 40 H16 V8Z" fill="' + c + '"/>' +
            '<rect x="8" y="6" width="8" height="58" rx="2" fill="#fff" opacity="0.15"/>' +
            '</svg></div>' +
            '<div style="width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:11px solid ' +
            c + ';margin-top:-2px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15));"></div></div>',
      iconSize: [42, 53],
      iconAnchor: [21, 53]
    });

    L.marker([m.lat, m.lng], { icon: icon })
      .addTo(map)
      .on('click', function() {
        window.parent.postMessage(JSON.stringify({ type: 'markerClick', marker: m }), '*');
      });
  });
<\/script>
</body>
</html>`;

  return (
    <View style={styles.container}>
      <iframe
        ref={iframeRef}
        srcDoc={html}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Ankara Harita"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    backgroundColor: '#E8EAE6',
  },
});
