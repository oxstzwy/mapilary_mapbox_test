import mapboxgl from 'mapbox-gl';

export const createMarkerElement = (isActive = false) => {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.cursor = 'pointer';
  el.style.transition = 'background-color 0.3s ease';
  updateMarkerStyle(el, isActive);
  return el;
};

export const updateMarkerStyle = (el, isActive) => {
  el.style.backgroundColor = isActive ? '#FF0000' : '#3FB1CE';
};

export const addMarkersToMap = (map, coordinates, imageIds, viewerRef, setActiveMarkers) => {
  return coordinates.map((coord, index) => {
    const isFirstMarker = index === 0;
    const el = createMarkerElement(isFirstMarker);
    const marker = new mapboxgl.Marker(el).setLngLat(coord).addTo(map);

    el.addEventListener('click', () => {
      if (viewerRef.current && viewerRef.current.isNavigable) {
        viewerRef.current.moveTo(imageIds[index]).catch(console.error);
        setActiveMarkers(prevActiveMarkers => {
          const newActiveMarkers = new Set(prevActiveMarkers);
          newActiveMarkers.add(index);
          return newActiveMarkers;
        });
      }
    });

    return marker;
  });
};

export const drawPathOnMap = (map, coordinates) => {
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates,
      },
    },
  });
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#888',
      'line-width': 8,
    },
  });
};

export const updateFieldOfView = (map, fovLayer, pov) => {
  if (pov && pov.lat && pov.lng) {
    fovLayer.setData({
      type: 'Feature',
      properties: {
        bearing: pov.bearing,
      },
      geometry: {
        type: 'Point',
        coordinates: [pov.lng, pov.lat],
      },
    });

    map.easeTo({
      center: [pov.lng, pov.lat],
      bearing: pov.bearing,
      pitch: pov.pitch,
    });
  }
};
