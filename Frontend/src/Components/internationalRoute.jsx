import React, { useState } from "react";
import { Link } from "react-router-dom";
import Style from "../App.module.css";
import axios from "axios";

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

  // const handleComplianceCheck = async () => {
  //   try {
  //     const response = await axios.post("http://127.0.0.1:3000/predict", formData);
  //     const result = response.data;

  //     console.log(response);

  //     if (result.prediction === 1) {
  //       setComplianceResult(result);
  //       setErrorMessage(""); // Clear any previous error message
  //     } else {
  //       setComplianceResult(result);
  //       setExplanations(result.explanation);
  //       setErrorMessage("Compliance check failed. Review the conditions below.");
  //     }
  //   } catch (error) {
  //     console.error("Error during compliance check:", error);
  //     setErrorMessage("Error connecting to the ML model server.");
  //   }
  // };

  const handleComplianceCheck = async () => {
    const formattedData = {
      origin: formData.origin,
      destination: formData.destination,
      hscode: parseInt(formData.hscode, 10),
      weight: parseFloat(formData.weight),
      type: formData.type || "perishable",
    };
  
    try {
      const response = await axios.post("http://127.0.0.1:3000/predict", formattedData);
      const result = response.data;
  
      console.log(response);
  
      if (result.prediction === 1) {
        setComplianceResult(result);
      } else {
        setComplianceResult(result);
        setExplanations(Array.isArray(result.explanation) ? result.explanation : []); // Ensure explanations is an array
        setErrorMessage("Compliance check failed. Review the conditions below.");
      }
    } catch (error) {
      console.error("Error during compliance check:", error);
      setErrorMessage("Error connecting to the ML model server.");
    }
  };
  
  const renderExplanations = () => {
    return (
      <ul className={Style.explanationList}>
        {explanations.map(([rule, impact], index) => (
          <li key={index} className={impact > 0 ? Style.passRule : Style.failRule}>
            <strong>Rule:</strong> {rule} <br />
            <strong>Impact:</strong> {impact.toFixed(2)}
          </li>
        ))}
      </ul>
    );
  };

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
              {["Provide Shipment Details", "Analyze Shipment Details", "Optimize and Find the Route"].map(
                (stepTitle, index) => (
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
                )
              )}
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
            <h2>International Shipment Route</h2>
            {step === 1 && (
              <>
                <h3>Step 1: Compliance Check</h3>
                <form>
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
                  <button type="button" onClick={handleComplianceCheck}>
                    Check Compliance
                  </button>
                </form>

                {complianceResult && (
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
                <button>Find Optimized Route</button>
              </>
            )}

            <button
              className={Style.closeBtn}
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default InternationalRoute;




