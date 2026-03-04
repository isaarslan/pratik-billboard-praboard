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
export default function WebMap({ markers = [], center = { lat: 39.925, lng: 32.836 }, zoom = 13, onMarkerPress, theme = 'light' }) {
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

  // OpenStreetMap — açık lisans, attribution gerekli
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

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
  .leaflet-attribution-flag { display: none !important; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', {
    zoomControl: false,
    attributionControl: true
  }).setView([${center.lat}, ${center.lng}], ${zoom});

  map.attributionControl.setPrefix('');

  L.tileLayer('${tileUrl}', {
    maxZoom: 19,
    attribution: '${attribution}'
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  var markers = ${markersJSON};
  markers.forEach(function(m) {
    var icon = L.divIcon({
      className: '',
      html: '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="width:38px;height:38px;border-radius:50%;background:' + (m.color || '#FF4B4B') +
            ';display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:3px solid #fff;">' +
            '<span style="color:#fff;font-weight:800;font-size:15px;">P</span></div>' +
            '<div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid ' +
            (m.color || '#FF4B4B') + ';margin-top:-2px;"></div></div>',
      iconSize: [38, 48],
      iconAnchor: [19, 48]
    });

    var popup = L.popup({ closeButton: false, offset: [0, -50] })
      .setContent(
        '<div style="font-family:system-ui,sans-serif;min-width:120px;">' +
        '<div style="font-size:13px;font-weight:700;color:#111;margin-bottom:4px;">' + m.label + '</div>' +
        '<div style="display:inline-block;background:' + (m.color || '#1B8A4A') + '22;border:1px solid ' + (m.color || '#1B8A4A') + '55;color:' + (m.color || '#1B8A4A') + ';font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;">' +
        (m.color === '#999999' ? 'Dolu' : 'Aktif') + '</div>' +
        '</div>'
      );

    L.marker([m.lat, m.lng], { icon: icon })
      .addTo(map)
      .bindPopup(popup)
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
