import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Style from "../App.module.css";
import axios from "axios";
import { X } from "lucide-react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InternationalRoute() {
  const [showPopup, setShowPopup] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    hscode: "",
    weight: "",
    type: "",
  });
  const [complianceResult, setComplianceResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [explanations, setExplanations] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleComplianceCheck = async () => {
    const formattedData = {
      origin: formData.origin,
      destination: formData.destination,
      hscode: parseInt(formData.hscode, 10),
      weight: parseFloat(formData.weight),
      type: formData.type || "perishable",
    };

    if (formData.origin === formData.destination) {
      alert("Origin and destination cannot be same, Please enter valid inputs");
    } else {
      try {
        const response = await axios.post(
          "http://127.0.0.1:3000/predict",
          formattedData
        );
        const result = response.data;

        console.log(response);

        if (result.prediction === 1) {
          setComplianceResult(result);
          toast.success(`Compliance Check Passed! `, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
            className: Style.customToast,
          });
        } else {
          setComplianceResult(result);
          setExplanations(
            Array.isArray(result.explanation) ? result.explanation : []
          ); // Ensure explanations is an array
          setErrorMessage(
            "Compliance check failed. Review the conditions below."
          );
        }
      } catch (error) {
        console.error("Error during compliance check:", error);
        setErrorMessage("Error connecting to the ML model server.");
      }
    }
  };

  const renderExplanations = () => {
    return (
      <ul className={Style.explanationList}>
        {explanations.map(([rule, impact], index) => (
          <li
            key={index}
            className={impact > 0 ? Style.passRule : Style.failRule}
          >
            <strong>Rule:</strong> {rule} <br />
            <strong>Impact:</strong> {impact.toFixed(2)}
          </li>
        ))}
      </ul>
    );
  };

  const [routeData, setRouteData] = useState({
    origin_country: "",
    destination_country: "",
    origin_city: "",
    destination_city: "",
    mode_within_country: "road",
    mode_between_countries: "sea",
    item_type: "perishable",
    package_weight: "", // Added package weight
    package_hscode: "", // Added HS Code
  });

  const [routeResult, setRouteResult] = useState(null);
  const [shippingCost, setShippingCost] = useState(null);
  const [shippingTime, setShippingTime] = useState(null);

  // Handlers for Route Optimization
  const handleRouteChange = (e) => {
    const { name, value } = e.target;
    setRouteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFindRoute = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/route",
        routeData
      );
      setRouteResult(response.data);
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      console.error("Error finding route:", error);
      setErrorMessage("Error connecting to the route optimization server.");
    }
  };

  const getCostAndTime = async () => {
    try {
      // Replace these placeholders with your actual APP ID and API Key
      const APP_ID = "f59b955c-4f33-4b23-9c53-76c0f10b6ac1";
      const API_KEY = "bf143db5a542b2c726da90d48191bdce";

      const payload = {
        AppID: APP_ID,
        RestApiKey: API_KEY,
        Reference: "ReferenceMumbaiDubai",
        WeightUnit: "KG", // Using KG for India/UAE shipment
        Currency: "INR", // Setting currency to AED for UAE
        DimensionUnit: "CM", // Using CM for dimensions
        Insurance: "N",
        ShipFromAddress: {
          Name: "Mumbai Logistics",
          AttentionName: "Sender Name",
          AddressLine1: "Bandra Kurla Complex",
          City: "Mumbai",
          Country: "IN", // Country code for India
          State: "MH", // State code for Maharashtra
          Zip: "400051", // Mumbai zip code
          Phone: "919999999999", // Example Indian phone number
          Email: "sender@mumbailogistics.com",
        },
        ShipToAddress: {
          Name: "Dubai Logistics",
          AttentionName: "Receiver Name",
          AddressLine1: "Business Bay",
          AddressLine2: "Downtown",
          City: "Singapore",
          State: "SG", // There are no states in Singapore, so we use the country code instead
          Country: "SG", // Country code for Singapore
          Zip: "00000", // Dubai doesn't typically use postal codes
          Phone: "971555555555", // Example UAE phone number
          Email: "receiver@dubailogistics.com",
        },
        ReasonForExport: "merchandise",
        IncludeLandedCost: true,
        Pieces: [
          {
            Quantity: 1,
            Weight: Number(`${routeData.package_weight}`), // Weight in KG
            SalePrice: 400.0, // Value in AED
            HSCode: "610910", // Example HS code for T-shirts
            OriginCountryCode: "IN", // Country of origin
            Description: "Cotton T-Shirt",
          },
        ],
        Package: {
          Weight: Number(`${routeData.package_weight}`), // Total weight in KG
        },
      };

      const response = await axios.post(
        "https://partnerapi.flavorcloud.com/Rates",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response Data:", response.data.Express.DDP.ShippingCost);
      setShippingCost(response.data.Express.DDP.ShippingCost);
      console.log("Response Data:", response.data.Express.DDP.Days);
      setShippingTime(response.data.Express.DDP.Days);
    } catch (error) {
      console.error(
        "Error fetching rates:",
        error.response?.data || error.message
      );
    }
  };

  // Google Maps

  return (
    <>
      <div className={Style.mainDiv}>
        {/* Navigation Bar */}
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

        {/* Main Content */}
        <div className={Style.loanApprovalMainDiv}>
          <div className={Style.loanApprovalMainDivInnerDiv}>
            <h1 className={Style.loanApprovalHeading}>
              International Shipment Made Easy
            </h1>
            <p className={Style.loanApprovalPara}>
              Simplify your international shipping with our advanced platform.
              We leverage cutting-edge algorithms, cost-efficient models, and
              time optimization techniques to deliver a seamless and reliable
              experience for global logistics.
            </p>
            {/* Steps Section */}
            <div className={Style.loanApprovalStepsDiv}>
              {[
                "Provide Shipment Details",
                "Analyze Shipment Details",
                "Optimize and Find the Route",
              ].map((stepTitle, index) => (
                <div key={index} className={Style.loanApprovalStep}>
                  <div className={Style.stepNumberAndHeadingDiv}>
                    <p className={Style.stepNumberPara}>{index + 1}</p>
                    <p className={Style.loanStepHeading}>{stepTitle}</p>
                  </div>
                  <p className={Style.loanStepExplanationPara}>
                    {index === 0 &&
                      "Enter key shipment details, including type of goods, weight, dimensions, pickup location, destination country, and delivery address."}
                    {index === 1 &&
                      "Our system validates your information, checks compliance with international trade regulations, and prepares data for optimal routing."}
                    {index === 2 &&
                      "Using Dijkstra's algorithm and time optimization models, we identify the most efficient and cost-effective international shipping route."}
                  </p>
                </div>
              ))}
            </div>
            <div className={Style.getPredictionBtnDiv}>
              <button
                className={Style.checkEligibilityBtn}
                onClick={() => setShowPopup(true)}
              >
                Find the Route
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup for Compliance Check */}
      {showPopup && (
        <div className={Style.popupOverlay}>
          <div className={Style.popupContent}>
            <h4>International Shipment Route</h4>
            {step === 1 && (
              <>
                <h3 className={Style.step1Compliance}>
                  Step 1: Compliance Check
                </h3>
                <form className={Style.internationalComplianceCheckForm}>
                  <label>
                    Origin:
                    <input
                      type="text"
                      value={formData.origin}
                      name="origin"
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Destination:
                    <input
                      type="text"
                      value={formData.destination}
                      name="destination"
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    HS Code:
                    <input
                      type="number"
                      value={formData.hscode}
                      name="hscode"
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Weight (kg):
                    <input
                      type="number"
                      value={formData.weight}
                      name="weight"
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Type:
                    <select
                      value={formData.type}
                      name="type"
                      onChange={handleInputChange}
                    >
                      <option value="perishable">Perishable</option>
                      <option value="non-perishable">Non-perishable</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={handleComplianceCheck}
                    className={Style.submitBtn}
                  >
                    Check Compliance
                  </button>
                </form>

                {/* {complianceResult && (
                  <div className={Style.result}>
                    <h4>Compliance Results:</h4>
                    <pre>{JSON.stringify(complianceResult, null, 2)}</pre>
                    {complianceResult.prediction === 1 && (
                      <button
                        onClick={() => setStep(2)}
                        className={Style.nextStepBtn}
                      >
                        Proceed to Next Step
                      </button>
                    )}
                  </div>
                )} */}

                {complianceResult && (
                  <div className={Style.complianceResult}>
                    <h4>Compliance Check Results</h4>
                    <div className={Style.prediction}>
                      <strong>Status:</strong>{" "}
                      {complianceResult.prediction === 1 ? (
                        <span className={Style.passed}>
                          Compliance Passed ✅
                        </span>
                      ) : (
                        <span className={Style.failed}>
                          Compliance Not Passed ❌
                        </span>
                      )}
                    </div>
                    <div className={Style.explanations}>
                      <h5>LIME Explanations:</h5>
                      <table className={Style.explanationTable}>
                        <thead>
                          <tr>
                            <th>Condition</th>
                            <th>Impact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complianceResult.explanation.map(
                            ([condition, impact], index) => (
                              <tr key={index}>
                                <td>{condition}</td>
                                <td>{(impact * 100).toFixed(2)}%</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className={Style.probability}>
                      <h5>Prediction Probability:</h5>
                      <p>
                        <strong>Not Passed:</strong>{" "}
                        {(complianceResult.probability[0] * 100).toFixed(2)}%
                        <br />
                        <strong>Passed:</strong>{" "}
                        {(complianceResult.probability[1] * 100).toFixed(2)}%
                      </p>
                    </div>
                    {complianceResult.prediction === 1 && (
                      <button
                        onClick={() => setStep(2)}
                        className={Style.submitBtn}
                      >
                        Proceed to Next Step
                      </button>
                    )}
                  </div>
                )}

                {errorMessage && (
                  <div className={Style.error}>
                    <p>{errorMessage}</p>
                    {renderExplanations()}
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <h3>Step 2: Route Optimization</h3>
                <form className={Style.internationalComplianceCheckForm}>
                  <label>
                    Origin Country:
                    <input
                      type="text"
                      value={routeData.origin_country}
                      name="origin_country"
                      onChange={handleRouteChange}
                    />
                  </label>
                  <label>
                    Destination Country:
                    <input
                      type="text"
                      value={routeData.destination_country}
                      name="destination_country"
                      onChange={handleRouteChange}
                    />
                  </label>
                  <label>
                    Origin City:
                    <input
                      type="text"
                      value={routeData.origin_city}
                      name="origin_city"
                      onChange={handleRouteChange}
                    />
                  </label>
                  <label>
                    Destination City:
                    <input
                      type="text"
                      value={routeData.destination_city}
                      name="destination_city"
                      onChange={handleRouteChange}
                    />
                  </label>
                  <label>
                    Item Type:
                    <select
                      value={routeData.item_type}
                      name="item_type"
                      onChange={handleRouteChange}
                    >
                      <option value="perishable">Perishable</option>
                      <option value="non-perishable">Non-Perishable</option>
                      <option value="fragile">Fragile</option>
                    </select>
                  </label>
                  <label>
                    Mode Within Country:
                    <select
                      value={routeData.mode_within_country}
                      name="mode_within_country"
                      onChange={handleRouteChange}
                    >
                      <option value="road">Road</option>
                      <option value="rail">Rail</option>
                      <option value="air">Air</option>
                    </select>
                  </label>
                  <label>
                    Mode Between Countries:
                    <select
                      value={routeData.mode_between_countries}
                      name="mode_between_countries"
                      onChange={handleRouteChange}
                    >
                      <option value="sea">Sea</option>
                      <option value="air">Air</option>
                    </select>
                  </label>
                  <label>
                    Package Weight (kg):
                    <input
                      type="number"
                      value={routeData.package_weight}
                      name="package_weight"
                      onChange={handleRouteChange}
                    />
                  </label>
                  <label>
                    HS Code:
                    <input
                      type="text"
                      value={routeData.package_hscode}
                      name="package_hscode"
                      onChange={handleRouteChange}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleFindRoute}
                    className={Style.submitBtn}
                  >
                    Find Optimized Route
                  </button>
                </form>

                {/* {routeResult && (
                  <div className={Style.result}>
                    <h4>Optimized Route Details:</h4>
                    <div className={Style.internationalMap}>
                      <p>Map is not loaded, Server issue</p>
                    </div>
                    <pre>{JSON.stringify(routeResult, null, 2)}</pre>
                    <button onClick={getCostAndTime}>Get the cost and time</button>
                  </div>
                )} */}

                {routeResult && (
                  <div className={Style.result}>
                    <h4>Optimized Route Details</h4>
                    <div className={Style.card}>
                      <div className={Style.cardSection}>
                        <h5>Distance Between Countries:</h5>
                        <p>{routeResult.distance_between_countries} km</p>
                      </div>
                      <div className={Style.cardSection}>
                        <h5>Distance Within Country:</h5>
                        <p>{routeResult.distance_within_country} km</p>
                      </div>
                      <div className={Style.cardSection}>
                        <h5>Route:</h5>
                        <p>{routeResult.route}</p>
                      </div>
                    </div>
                    <button
                      className={Style.submitBtn}
                      onClick={getCostAndTime}
                    >
                      Get the optimized Cost and Time
                    </button>
                  </div>
                )}

                {/* 
                {shippingCost && shippingTime && (
                  <div>
                    <p><strong>Shipping Cost:</strong>{shippingCost}</p>
                    <p><strong>Shipping Time:</strong>{shippingTime}</p>
                  </div>
                )} */}

                {shippingCost && shippingTime && (
                  <div className={Style.shippingDetails}>
                    <h4>Shipping Details</h4>
                    <div className={Style.card}>
                      <div className={Style.cardSection}>
                        <h5>Shipping Cost:</h5>
                        <p>₹{shippingCost.toFixed(2)}</p>
                      </div>
                      <div className={Style.cardSection}>
                        <h5>Shipping Time:</h5>
                        <p>{shippingTime}</p>
                      </div>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className={Style.error}>
                    <p>{errorMessage}</p>
                  </div>
                )}
              </>
            )}

            <button
              className={Style.profileBtn}
              onClick={() => setShowPopup(false)}
            >
              <X size={16} className={Style.icon} />
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default InternationalRoute;
