import React, { useState } from "react";

const GoogleMapsDirections = () => {
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const initMap = () => {
    // Initialize map
    const newMap = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
      zoom: 7,
    });

    // Initialize directions renderer
    const newDirectionsRenderer = new window.google.maps.DirectionsRenderer();
    newDirectionsRenderer.setMap(newMap);

    setMap(newMap);
    setDirectionsRenderer(newDirectionsRenderer);
  };

  const calculateRoute = () => {
    if (!source || !destination) {
      alert("Please enter both source and destination.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: source,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          alert("Directions request failed due to " + status);
        }
      }
    );
  };

  React.useEffect(() => {
    if (!window.google) {
      alert("Google Maps API is not loaded. Please check your API key.");
      return;
    }
    initMap();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ marginRight: "10px", padding: "5px", width: "200px" }}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ marginRight: "10px", padding: "5px", width: "200px" }}
        />
        <button onClick={calculateRoute} style={{ padding: "5px 10px" }}>
          Get Directions
        </button>
      </div>
      <div id="map" style={{ height: "80vh", width: "100%" }}></div>
    </div>
  );
};

export default GoogleMapsDirections;


