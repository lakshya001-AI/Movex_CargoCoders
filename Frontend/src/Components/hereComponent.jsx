import React, { useEffect, useRef } from "react";

const HereMapWithRoute = ({
  sourceLat,
  sourceLng,
  destLat,
  destLng,
  apiKey,
  zoom = 6,
}) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!sourceLat || !sourceLng || !destLat || !destLng || !apiKey) {
      console.error("Source, destination coordinates, and API key are required!");
      return;
    }

    const H = window.H;

    // Initialize the platform with the API key
    const platform = new H.service.Platform({
      apikey: apiKey,
    });

    const defaultLayers = platform.createDefaultLayers();

    // Create a map instance
    const map = new H.Map(
      mapContainerRef.current,
      defaultLayers.vector.normal.map,
      {
        center: { lat: (sourceLat + destLat) / 2, lng: (sourceLng + destLng) / 2 },
        zoom: zoom,
        pixelRatio: window.devicePixelRatio || 1,
      }
    );

    // Add default behavior to the map (panning, zooming, etc.)
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Add UI controls to the map
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Add markers for source and destination
    const sourceMarker = new H.map.Marker({ lat: sourceLat, lng: sourceLng });
    const destinationMarker = new H.map.Marker({ lat: destLat, lng: destLng });

    map.addObject(sourceMarker);
    map.addObject(destinationMarker);

    // Add a route line between the source and destination
    const routingService = platform.getRoutingService();

    const routeParams = {
      routingMode: "fast",
      transportMode: "car",
      origin: `${sourceLat},${sourceLng}`,
      destination: `${destLat},${destLng}`,
      return: "polyline",
    };

    routingService.calculateRoute(routeParams, (result) => {
      if (result.routes.length) {
        const route = result.routes[0];
        const routeLineString = new H.geo.LineString();

        route.sections.forEach((section) => {
          const polyline = section.polyline;
          const decodedPolyline = H.geo.LineString.fromFlexiblePolyline(polyline);
          routeLineString.pushLineString(decodedPolyline);
        });

        const routeLine = new H.map.Polyline(routeLineString, {
          style: { strokeColor: "blue", lineWidth: 4 },
        });

        map.addObject(routeLine);
        map.getViewModel().setLookAtData({
          bounds: routeLine.getBoundingBox(),
        });
      }
    });

    // Clean up the map instance on component unmount
    return () => {
      map.dispose();
    };
  }, [sourceLat, sourceLng, destLat, destLng, apiKey, zoom]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
    ></div>
  );
};

export default HereMapWithRoute;
