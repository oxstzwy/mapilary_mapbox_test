import mapboxgl from 'mapbox-gl';

export const createMarkerElement = (isActive = false, isHovered = false) => {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.cursor = 'pointer';
  el.style.transition = 'background-color 0.3s ease';
  updateMarkerStyle(el, isActive, isHovered);
  return el;
};

export const updateMarkerStyle = (el, isActive, isHovered) => {
  if (isActive) {
    el.style.backgroundColor = '#FF0000';
  } else if (isHovered) {
    el.style.backgroundColor = '#FFA500';
  } else {
    el.style.backgroundColor = '#3FB1CE';
  }
};

export const addMarkersToMap = (map, coordinates, imageIds, viewerRef, setCurrentImageId) => {
  return coordinates.map((coord, index) => {
    const el = createMarkerElement();
    const marker = new mapboxgl.Marker(el).setLngLat(coord).addTo(map);

    el.addEventListener('click', () => {
      if (viewerRef.current && viewerRef.current.isNavigable) {
        viewerRef.current.moveTo(imageIds[index]).catch(console.error);
        setCurrentImageId(imageIds[index]);
      }
    });

    el.addEventListener('mouseenter', () => {
      updateMarkerStyle(el, imageIds[index] === setCurrentImageId, true);
    });

    el.addEventListener('mouseleave', () => {
      updateMarkerStyle(el, imageIds[index] === setCurrentImageId, false);
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
