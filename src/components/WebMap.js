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

  var logoB64 = 'data:image/png;base64,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';

  var markers = ${markersJSON};
  markers.forEach(function(m) {
    var c = m.color || '#22C55E';
    var icon = L.divIcon({
      className: '',
      html: '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="width:44px;height:44px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.3);border:3px solid ' + c + ';">' +
            '<img src="' + logoB64 + '" style="width:24px;height:26px;object-fit:contain;" />' +
            '</div>' +
            '<div style="width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:11px solid ' +
            c + ';margin-top:-2px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15));"></div></div>',
      iconSize: [44, 55],
      iconAnchor: [22, 55]
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
