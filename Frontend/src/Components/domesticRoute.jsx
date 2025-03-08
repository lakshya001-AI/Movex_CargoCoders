import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Style from "../App.module.css";
import {
  GoogleMap,
  LoadScript,
  Polyline,
  Marker,
} from "@react-google-maps/api";
import { X } from "lucide-react";

// Replace with your actual API key
const GOOGLE_MAPS_API_KEY = "AIzaSyAmyeWi4SPcXM7dkR1hduoIqL5uyMXtqUk";

// Polyline decoder function for Google's encoded polyline format
function decodePolyline(encoded) {
  if (!encoded) {
    return [];
  }

  const poly = [];
  let index = 0,
    lat = 0,
    lng = 0;

  while (index < encoded.length) {
    let b,
      shift = 0,
      result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push({
      lat: lat / 1e5,
      lng: lng / 1e5,
    });
  }

  return poly;
}

function DomesticRoute() {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [routeDetails, setRouteDetails] = useState(null);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    mode: "Air",
    weight: "",
    hscode: "",
    shipment_type: "Perishable",
    instructions: "",
  });

  const handleFindRouteClick = () => {
    setOverlayVisible(true);
  };

  const handleCloseOverlay = () => {
    setOverlayVisible(false);
    setRouteDetails(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData.origin === formData.destination) {
      alert("Please enter the valid inputs");
    } else {
      try {
        // Ensure the ML model endpoint matches
        const response = await axios.post("http://127.0.0.1:5001/predict", {
          source: formData.origin,
          destination: formData.destination,
          mode_of_transportation: formData.mode,
          weight: parseFloat(formData.weight), // Ensure weight is a number
          hscode: formData.hscode,
          shipment_type: formData.shipment_type,
          instructions: formData.instructions,
        });

        console.log("ML Model Response:", response.data);
        setRouteDetails(response.data);
        getMapDetails();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  const handleSaveResponse = () => {
    // Logic to save response in the user's profile or local storage
    console.log("Saving response:", routeDetails);
  };

  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    marginTop: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const center = {
    lat: 20.5937, // Center of India as default
    lng: 78.9629,
  };

  async function getMapDetails() {
    let origin = formData.origin;
    let destination = formData.destination;

    try {
      // Call your backend API
      const apiUrl = "http://localhost:5000/api/directions";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ origin, destination }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch directions");
      }

      const data = await response.json();
      setDirections(data);

      // Now fetch polyline data directly from the Google Routes API
      await fetchRoutePolyline();
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const fetchRoutePolyline = async () => {
    let origin = formData.origin;
    let destination = formData.destination;

    try {
      // First, get coordinates for origin and destination from backend
      const geocodeOrigin = await fetch(
        `http://localhost:5000/api/geocode?address=${encodeURIComponent(
          origin
        )}`
      );
      const originData = await geocodeOrigin.json();

      const geocodeDest = await fetch(
        `http://localhost:5000/api/geocode?address=${encodeURIComponent(
          destination
        )}`
      );
      const destData = await geocodeDest.json();

      if (originData.status !== "OK" || destData.status !== "OK") {
        throw new Error("Failed to geocode addresses");
      }

      const originLocation = originData.results[0].geometry.location;
      const destLocation = destData.results[0].geometry.location;

      // Set start and end points for markers
      setStartPoint({
        lat: originLocation.lat,
        lng: originLocation.lng,
      });

      setEndPoint({
        lat: destLocation.lat,
        lng: destLocation.lng,
      });

      // Make direct request to Google Routes API to get polyline
      const requestBody = {
        origin: {
          location: {
            latLng: {
              latitude: originLocation.lat,
              longitude: originLocation.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destLocation.lat,
              longitude: destLocation.lng,
            },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: "en-US",
        units: "IMPERIAL",
      };

      const routesResponse = await fetch(
        "http://localhost:5000/api/route-proxy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!routesResponse.ok) {
        throw new Error("Failed to fetch route polyline");
      }

      const routesData = await routesResponse.json();

      if (
        routesData.routes &&
        routesData.routes.length > 0 &&
        routesData.routes[0].polyline
      ) {
        const decodedPath = decodePolyline(
          routesData.routes[0].polyline.encodedPolyline
        );
        setRoutePath(decodedPath);

        // Calculate bounds for the map
        if (decodedPath.length > 0) {
          let bounds = {
            north: -90,
            south: 90,
            east: -180,
            west: 180,
          };

          decodedPath.forEach((point) => {
            bounds.north = Math.max(bounds.north, point.lat);
            bounds.south = Math.min(bounds.south, point.lat);
            bounds.east = Math.max(bounds.east, point.lng);
            bounds.west = Math.min(bounds.west, point.lng);
          });

          // Add some padding
          bounds.north += 0.05;
          bounds.south -= 0.05;
          bounds.east += 0.05;
          bounds.west -= 0.05;

          setMapBounds(bounds);
        }
      } else {
        throw new Error("No route data found");
      }
    } catch (err) {
      console.error("Error fetching route polyline:", err);
      setError("Failed to display route on map: " + err.message);
    }
  };

  // Format instructions to handle HTML content safely
  const formatInstructions = (instruction) => {
    if (typeof instruction === "string") {
      return instruction;
    } else if (instruction && instruction.instructions) {
      return instruction.instructions;
    }
    return "";
  };

  const onMapLoad = (map) => {
    if (mapBounds) {
      map.fitBounds(mapBounds);
    }
  };

  return (
    <>
      <div className={Style.mainDiv}>
        <div className={Style.mainPageMainDiv}>
          <div className={Style.navBarMainPage}>
            <div className={Style.logoNavBarMainPage}>
              <h1>MOVEX</h1>
            </div>

            <div className={Style.linkNavBarMainPage}>
              <Link className={Style.linkElementNavBar} to="/mainPage">
                Home
              </Link>
              <Link className={Style.linkElementNavBar} to="/mainPage">
                Features
              </Link>
              <Link className={Style.linkElementNavBar} to="/mainPage">
                Contact Us
              </Link>
            </div>

            <div className={Style.ProfileBtnNavBarMainPage}>
              <Link className={Style.profileBtn} to="/profilePage">
                Profile
              </Link>
            </div>
          </div>

          <div className={Style.loanApprovalMainDiv}>
            <div className={Style.loanApprovalMainDivInnerDiv}>
              <h1 className={Style.loanApprovalHeading}>
                Domestic Shipment Simplified
              </h1>
              <p className={Style.loanApprovalPara}>
                Manage your domestic shipments with ease and efficiency. Our
                platform streamlines the process, ensuring compliance, accuracy,
                and cost-effective solutions for all your logistics needs.
              </p>

              <div className={Style.loanApprovalStepsDiv}>
                <div className={Style.loanApprovalStep}>
                  <div className={Style.stepNumberAndHeadingDiv}>
                    <p className={Style.stepNumberPara}>1</p>
                    <p className={Style.loanStepHeading}>
                      Provide Shipment Details
                    </p>
                  </div>
                  <p className={Style.loanStepExplanationPara}>
                    Enter the essential shipment information, including the type
                    of goods, weight, dimensions, pickup location, and delivery
                    address.
                  </p>
                </div>
                <div className={Style.loanApprovalStep}>
                  <div className={Style.stepNumberAndHeadingDiv}>
                    <p className={Style.stepNumberPara}>2</p>
                    <p className={Style.loanStepHeading}>
                      Analyze Shipment Details
                    </p>
                  </div>
                  <p className={Style.loanStepExplanationPara}>
                    Our platform validates your input and ensures compliance
                    with domestic regulations while preparing the data for route
                    optimization.
                  </p>
                </div>
                <div className={Style.loanApprovalStep}>
                  <div className={Style.stepNumberAndHeadingDiv}>
                    <p className={Style.stepNumberPara}>3</p>
                    <p className={Style.loanStepHeading}>Find the Best Route</p>
                  </div>
                  <p className={Style.loanStepExplanationPara}>
                    Using advanced algorithms, we calculate the most
                    cost-effective and efficient route for your shipment.
                  </p>
                </div>
              </div>

              <div className={Style.getPredictionBtnDiv}>
                <button
                  className={Style.checkEligibilityBtn}
                  onClick={handleFindRouteClick}
                >
                  Find the Route
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOverlayVisible && (
        <div className={Style.overlay}>
          <div className={Style.popup}>
            {!routeDetails ? (
              // <form className={Style.popupForm} onSubmit={handleFormSubmit}>
              //   <label>
              //     Origin:
              //     <input
              //       type="text"
              //       name="origin"
              //       value={formData.origin}
              //       onChange={handleInputChange}
              //     />
              //   </label>
              //   <label>
              //     Destination:
              //     <input
              //       type="text"
              //       name="destination"
              //       value={formData.destination}
              //       onChange={handleInputChange}
              //     />
              //   </label>
              //   <label>
              //     Mode of Transport:
              //     <select
              //       name="mode"
              //       value={formData.mode}
              //       onChange={handleInputChange}
              //     >
              //       <option value="Air">Air</option>
              //       <option value="Road">Road</option>
              //     </select>
              //   </label>
              //   <label>
              //     Package Details:
              //     <input
              //       type="number"
              //       name="weight"
              //       value={formData.weight}
              //       placeholder="Weight (kg)"
              //       onChange={handleInputChange}
              //     />
              //     <input
              //       type="text"
              //       name="hscode"
              //       value={formData.hscode}
              //       placeholder="HS Code"
              //       onChange={handleInputChange}
              //     />
              //     <select
              //       name="shipment_type"
              //       value={formData.shipment_type}
              //       onChange={handleInputChange}
              //     >
              //       <option value="Perishable">Perishable</option>
              //       <option value="Non-Perishable">Non-Perishable</option>
              //     </select>
              //   </label>
              //   <label>
              //     Special Instructions:
              //     <textarea
              //       name="instructions"
              //       value={formData.instructions}
              //       rows="3"
              //       onChange={handleInputChange}
              //     ></textarea>
              //   </label>
              //   <div className={Style.popupButtons}>
              //     <button type="submit" className={Style.submitBtn}>
              //       Submit
              //     </button>
              //     <button
              //       type="button"
              //       className={Style.closeBtn}
              //       onClick={handleCloseOverlay}
              //     >
              //       Close
              //     </button>
              //   </div>
              // </form>

              <form className={Style.popupForm} onSubmit={handleFormSubmit}>
                <div className={Style.pleaseEnterDetailsDiv}>
                  <h3>Please enter the details</h3>
                </div>
                <label>
                  Origin:
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Destination:
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Mode of Transport:
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                  >
                    <option value="Air">Air</option>
                    <option value="Road">Road</option>
                  </select>
                </label>
                <label>
                  Package Details:
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    placeholder="Weight (kg)"
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="hscode"
                    value={formData.hscode}
                    placeholder="HS Code"
                    onChange={handleInputChange}
                  />
                  <select
                    name="shipment_type"
                    value={formData.shipment_type}
                    onChange={handleInputChange}
                  >
                    <option value="Perishable">Perishable</option>
                    <option value="Non-Perishable">Non-Perishable</option>
                  </select>
                </label>
                <label>
                  Special Instructions:
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    rows="3"
                    onChange={handleInputChange}
                  ></textarea>
                </label>
                <div className={Style.popupButtons}>
                  <button type="submit" className={Style.submitBtn}>
                    Submit
                  </button>
                  <button
                    type="button"
                    className={Style.profileBtn}
                    onClick={handleCloseOverlay}
                  >
                    <X size={16} className={Style.icon} />
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {routeDetails.best_route &&
                routeDetails.cost &&
                routeDetails.time ? (
                  <>
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={5}
                        onLoad={onMapLoad}
                      >
                        {/* Display the route path using Polyline */}
                        {routePath.length > 0 && (
                          <Polyline
                            path={routePath}
                            options={{
                              strokeColor: "#2196F3",
                              strokeOpacity: 0.75,
                              strokeWeight: 5,
                            }}
                          />
                        )}

                        {/* Display markers for start and end points */}
                        {startPoint && (
                          <Marker
                            position={startPoint}
                            label="A"
                            title={formData.origin}
                          />
                        )}

                        {endPoint && (
                          <Marker
                            position={endPoint}
                            label="B"
                            title={formData.destination}
                          />
                        )}
                      </GoogleMap>
                    </LoadScript>
                    <p className={Style.domesticRouteDetailsPara}>
                      <strong>Best Route:</strong> {routeDetails.best_route}
                    </p>
                    <p className={Style.domesticRouteDetailsPara}>
                      <strong>Cost:</strong> ₹{routeDetails.cost}
                    </p>
                    <p className={Style.domesticRouteDetailsPara}>
                      <strong>Estimated Time:</strong> {routeDetails.time}
                    </p>
                    <div className={Style.popupButtons}>
                      <button
                        className={Style.submitBtn}
                        onClick={handleSaveResponse}
                      >
                        Save Response
                      </button>
                      <button
                        className={Style.profileBtn}
                        onClick={handleCloseOverlay}
                      >
                        <X size={16} className={Style.icon} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <p>Data limit: No route is available</p>
                    <button
                      className={Style.closeBtn}
                      onClick={handleCloseOverlay}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DomesticRoute;
