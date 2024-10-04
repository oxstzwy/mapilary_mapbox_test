import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createMarkerElement, addMarkersToMap, drawPathOnMap, updateFieldOfView } from '../utils/mapUtils';

export const MapboxMap = ({ accessToken, coordinates, imageIds, viewerRef }) => {
  const mapboxContainerRef = useRef(null);
  const mapRef = useRef(null);
  const fovLayerRef = useRef(null);
  const markersRef = useRef([]);
  const [currentImageId, setCurrentImageId] = useState(null);

  useEffect(() => {
    if (!mapboxContainerRef.current) return;

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: mapboxContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinates[17],
      zoom: 21,
      bearing: 202,
      pitch: 45,
    });

    mapRef.current = map;

    map.on('load', () => {
      markersRef.current = addMarkersToMap(map, coordinates, imageIds, viewerRef, setCurrentImageId);
      drawPathOnMap(map, coordinates);

      const scale = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      });
      map.addControl(scale, 'bottom-left');

      const zoomControl = new mapboxgl.NavigationControl();
      map.addControl(zoomControl, 'top-right');

      map.addSource('fov', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: coordinates[0],
          },
        },
      });

      map.addLayer({
        id: 'fov',
        type: 'symbol',
        source: 'fov',
        layout: {
          'icon-image': 'triangle-15',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
        paint: {
          'icon-color': '#3FB1CE',
          'icon-opacity': 0.8,
        },
      });

      fovLayerRef.current = map.getSource('fov');
    });

    return () => map.remove();
  }, [accessToken, coordinates, imageIds, viewerRef]);

  useEffect(() => {
    if (viewerRef.current && mapRef.current && fovLayerRef.current) {
      const updateFOV = () => {
        const pov = viewerRef.current.getPointOfView();
        if (pov) {
          updateFieldOfView(mapRef.current, fovLayerRef.current, pov);
          viewerRef.current.getImage().then(image => {
            if (image) {
              setCurrentImageId(image.id);
            }
          }).catch(console.error);
        }
      };

      viewerRef.current.on('position', updateFOV);

      return () => {
        viewerRef.current.off('position', updateFOV);
      };
    }
  }, [viewerRef]);

  useEffect(() => {
    if (currentImageId && markersRef.current) {
      markersRef.current.forEach((marker, index) => {
        const el = marker.getElement();
        if (imageIds[index] === currentImageId) {
          el.style.backgroundColor = '#FF0000';
        } else {
          el.style.backgroundColor = '#3FB1CE';
        }
      });
    }
  }, [currentImageId, imageIds]);

  return <div ref={mapboxContainerRef} className="w-1/2 h-full" />;
};