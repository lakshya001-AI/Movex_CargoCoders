// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import Style from "../App.module.css";
// import HereMapWithDottedRoute from "./hereComponent";
// import HereMapWithRoute from "./hereComponent";

// function DomesticRoute() {
//   const [isOverlayVisible, setOverlayVisible] = useState(false);

//   const handleFindRouteClick = () => {
//     setOverlayVisible(true);
//   };

//   const handleCloseOverlay = () => {
//     setOverlayVisible(false);
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
//                 Domestic Shipment Simplified
//               </h1>
//               <p className={Style.loanApprovalPara}>
//                 Manage your domestic shipments with ease and efficiency. Our
//                 platform streamlines the process, ensuring compliance, accuracy,
//                 and cost-effective solutions for all your logistics needs.
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
//                     Enter the essential shipment information, including the type
//                     of goods, weight, dimensions, pickup location, and delivery
//                     address.
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
//                     Our platform validates your input and ensures compliance
//                     with domestic regulations while preparing the data for route
//                     optimization.
//                   </p>
//                 </div>
//                 <div className={Style.loanApprovalStep}>
//                   <div className={Style.stepNumberAndHeadingDiv}>
//                     <p className={Style.stepNumberPara}>3</p>
//                     <p className={Style.loanStepHeading}>Find the Best Route</p>
//                   </div>
//                   <p className={Style.loanStepExplanationPara}>
//                     Using advanced algorithms, we calculate the most
//                     cost-effective and efficient route for your shipment.
//                   </p>
//                 </div>
//               </div>

//               <div className={Style.getPredictionBtnDiv}>
//                 <button
//                   className={Style.checkEligibilityBtn}
//                   onClick={handleFindRouteClick}
//                 >
//                   Find the Route
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isOverlayVisible && (
//         <div className={Style.overlay}>
//           <div className={Style.popup}>
//             <h2>Enter Shipment Details</h2>
//             <form className={Style.popupForm}>
//               <label>
//                 Origin:
//                 <input type="text" name="origin" />
//               </label>
//               <label>
//                 Destination:
//                 <input type="text" name="destination" />
//               </label>
//               <label>
//                 Mode of Transport:
//                 <select name="mode">
//                   <option value="air">Air</option>
//                   <option value="road">Road</option>
//                 </select>
//               </label>
//               <label>
//                 Package Details:
//                 <input type="number" name="weight" placeholder="Weight (kg)" />
//                 <input type="text" name="hscode" placeholder="HS Code" />
//                 <select name="shipmentType">
//                   <option value="Perishable">Perishable</option>
//                   <option value="nonPerishable">Non-Perishable</option>
//                 </select>
//               </label>
//               <label>
//                 Special Instructions:
//                 <textarea name="instructions" rows="3"></textarea>
//               </label>
//               <div className={Style.popupButtons}>
//                 <button type="submit" className={Style.submitBtn}>
//                   Submit
//                 </button>
//                 <button
//                   type="button"
//                   className={Style.closeBtn}
//                   onClick={handleCloseOverlay}
//                 >
//                   Close
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default DomesticRoute;



import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Style from "../App.module.css";

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
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSaveResponse = () => {
    // Logic to save response in the user's profile or local storage
    console.log("Saving response:", routeDetails);
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
              <button className={Style.checkEligibilityBtn} onClick={handleFindRouteClick}>
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
              <form className={Style.popupForm} onSubmit={handleFormSubmit}>
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
                  <select name="mode" value={formData.mode} onChange={handleInputChange}>
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
                    className={Style.closeBtn}
                    onClick={handleCloseOverlay}
                  >
                    Close
                  </button>
                </div>
              </form>
            ) : (
              // <div>
              //   <h2>Route Details</h2>
              //   <p><strong>Best Route:</strong> {routeDetails.best_route}</p>
              //   <p><strong>Cost:</strong> ₹{routeDetails.cost}</p>
              //   <p><strong>Estimated Time:</strong> {routeDetails.time}</p>
              //   <div className={Style.popupButtons}>
              //     <button className={Style.submitBtn} onClick={handleSaveResponse}>
              //       Save Response
              //     </button>
              //     <button className={Style.closeBtn} onClick={handleCloseOverlay}>
              //       Close
              //     </button>
              //   </div>
              // </div>
              <div>
  <h2>Route Details</h2>
  {routeDetails.best_route && routeDetails.cost && routeDetails.time ? (
    <>
      <p><strong>Best Route:</strong> {routeDetails.best_route}</p>
      <p><strong>Cost:</strong> ₹{routeDetails.cost}</p>
      <p><strong>Estimated Time:</strong> {routeDetails.time}</p>
      <div className={Style.popupButtons}>
        <button className={Style.submitBtn} onClick={handleSaveResponse}>
          Save Response
        </button>
        <button className={Style.closeBtn} onClick={handleCloseOverlay}>
          Close
        </button>
      </div>
    </>
  ) : (
    <div>
         <p>Data limit: No route is available</p>
    <button className={Style.closeBtn} onClick={handleCloseOverlay}>
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
