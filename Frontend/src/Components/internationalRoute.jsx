// import React, { useState, useEffect } from "react";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import Style from "../App.module.css";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faSignOutAlt,
//   faInfoCircle,
//   faArrowUpRightFromSquare,
// } from "@fortawesome/free-solid-svg-icons";

// function InternationalRoute() {

//   const [showPopup, setShowPopup] = useState(false);
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     origin: "",
//     destination: "",
//     hscode: "",
//     weight: "",
//     type: "",
//   });
//   const [complianceResult, setComplianceResult] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleComplianceCheck = async () => {
//     try {
//       const response = await axios.post("http://localhost:5000/compliance", formData);
//       const result = response.data;
//       setComplianceResult(result);
//       if (result.prediction === 1) {
//         setStep(2); // Move to the next step if compliance passed
//       } else {
//         setErrorMessage("Compliance check failed. Cannot proceed to route finding.");
//       }
//     } catch (error) {
//       console.error("Error during compliance check:", error);
//       setErrorMessage("Error connecting to the server.");
//     }
//   };

  

//   return (
//     <>
//       <div className={Style.mainDiv}>
//         <div className={Style.mainPageMainDiv}>
//           <div className={Style.navBarMainPage}>
//             <div className={Style.logoNavBarMainPage}>
//               <h1>MOVEX</h1>
//             </div>

//             <div className={Style.linkNavBarMainPage}>
//               <Link className={Style.linkElementNavBar} to="/mainPage">
//                 Home
//               </Link>
//               <Link className={Style.linkElementNavBar} to="/mainPage">
//                 Features
//               </Link>
//               <Link className={Style.linkElementNavBar} to="/mainPage">
//                 Contact Us
//               </Link>
//             </div>

//             <div className={Style.ProfileBtnNavBarMainPage}>
//               <Link className={Style.profileBtn} to="/profilePage">
//                 Profile
//               </Link>
//             </div>
//           </div>
//           <div className={Style.loanApprovalMainDiv}>
//             <div className={Style.loanApprovalMainDivInnerDiv}>
//               <h1 className={Style.loanApprovalHeading}>
//                 International Shipment Made Easy
//               </h1>
//               <p className={Style.loanApprovalPara}>
//                 Simplify your international shipping with our advanced platform.
//                 We leverage cutting-edge algorithms, cost-efficient models, and
//                 time optimization techniques to deliver a seamless and reliable
//                 experience for global logistics.
//               </p>

//               <div className={Style.loanApprovalStepsDiv}>
//                 <div className={Style.loanApprovalStep}>
//                   <div className={Style.stepNumberAndHeadingDiv}>
//                     <p className={Style.stepNumberPara}>1</p>
//                     <p className={Style.loanStepHeading}>
//                       Provide Shipment Details
//                     </p>
//                   </div>
//                   <p className={Style.loanStepExplanationPara}>
//                     Enter key shipment details, including type of goods, weight,
//                     dimensions, pickup location, destination country, and
//                     delivery address.
//                   </p>
//                 </div>
//                 <div className={Style.loanApprovalStep}>
//                   <div className={Style.stepNumberAndHeadingDiv}>
//                     <p className={Style.stepNumberPara}>2</p>
//                     <p className={Style.loanStepHeading}>
//                       Analyze Shipment Details
//                     </p>
//                   </div>
//                   <p className={Style.loanStepExplanationPara}>
//                     Our system validates your information, checks compliance
//                     with international trade regulations, and prepares data for
//                     optimal routing.
//                   </p>
//                 </div>
//                 <div className={Style.loanApprovalStep}>
//                   <div className={Style.stepNumberAndHeadingDiv}>
//                     <p className={Style.stepNumberPara}>3</p>
//                     <p className={Style.loanStepHeading}>
//                       Optimize and Find the Route
//                     </p>
//                   </div>
//                   <p className={Style.loanStepExplanationPara}>
//                     Using Dijkstra's algorithm and time optimization models, we
//                     identify the most efficient and cost-effective international
//                     shipping route.
//                   </p>
//                 </div>
//               </div>

//               <div className={Style.getPredictionBtnDiv}>
//                 <button className={Style.checkEligibilityBtn} onClick={() => setShowPopup(true)}>
//                   Find the Route
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showPopup && (
//         <div className={Style.popupOverlay}>
//           <div className={Style.popupContent}>
//             <h2>International Shipment Route</h2>
//             {step === 1 && (
//               <>
//                 <h3>Step 1: Compliance Check</h3>
//                 <form>
//                   <label>
//                     Origin:
//                     <input type="text" value={formData.origin} name="origin" onChange={handleInputChange} />
//                   </label>
//                   <label>
//                     Destination:
//                     <input type="text" value={formData.destination} name="destination" onChange={handleInputChange} />
//                   </label>
//                   <label>
//                     HS Code:
//                     <input type="number" value={formData.hscode} name="hscode" onChange={handleInputChange} />
//                   </label>
//                   <label>
//                     Weight (kg):
//                     <input type="number" value={formData.weight} name="weight" onChange={handleInputChange} />
//                   </label>
//                   <label>
//                     Type:
//                     <select value={formData.type} name="type" onChange={handleInputChange}>
//                       <option value="perishable">Perishable</option>
//                       <option value="non-perishable">Non-perishable</option>
//                     </select>
//                   </label>
//                   <button type="button" onClick={handleComplianceCheck}>
//                     Check Compliance
//                   </button>
//                 </form>
//                 {errorMessage && <p className={Style.error}>{errorMessage}</p>}
//               </>
//             )}

//             {step === 2 && complianceResult && (
//               <>
//                 <h3>Step 2: Route Optimization</h3>
//                 <button onClick={handleFindRoute}>Find Optimized Route</button>
//                 <div>
//                   <h4>Compliance Results:</h4>
//                   <pre>{JSON.stringify(complianceResult, null, 2)}</pre>
//                 </div>
//               </>
//             )}

//             <button className={Style.closeBtn} onClick={() => setShowPopup(false)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}



//     </>
//   );
// }

// export default InternationalRoute;


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

  const handleComplianceCheck = async () => {
    try {
      const response = await axios.post("http://localhost:5000/compliance", formData);
      const result = response.data;

      if (result.prediction === 1) {
        setComplianceResult(result);
        setStep(2); // Move to the next step if compliance passed
      } else {
        setComplianceResult(result);
        setExplanations(result.explanation);
        setErrorMessage("Compliance check failed. Review the conditions below.");
      }
    } catch (error) {
      console.error("Error during compliance check:", error);
      setErrorMessage("Error connecting to the server.");
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
        </div>

        {/* Main Content */}
        <div className={Style.loanApprovalMainDiv}>
          <div className={Style.loanApprovalMainDivInnerDiv}>
            <h1 className={Style.loanApprovalHeading}>
              International Shipment Made Easy
            </h1>
            <button
              className={Style.checkEligibilityBtn}
              onClick={() => setShowPopup(true)}
            >
              Find the Route
            </button>
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
                {errorMessage && (
                  <div className={Style.error}>
                    <p>{errorMessage}</p>
                    {renderExplanations()}
                  </div>
                )}
              </>
            )}

            {step === 2 && complianceResult && (
              <>
                <h3>Step 2: Route Optimization</h3>
                <button>Find Optimized Route</button>
                <div>
                  <h4>Compliance Results:</h4>
                  <pre>{JSON.stringify(complianceResult, null, 2)}</pre>
                </div>
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



