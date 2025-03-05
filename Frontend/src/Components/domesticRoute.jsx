import React, { useState } from "react";
import { Link } from "react-router-dom";
import Style from "../App.module.css";

function DomesticRoute() {
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const handleFindRouteClick = () => {
    setOverlayVisible(true);
  };

  const handleCloseOverlay = () => {
    setOverlayVisible(false);
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
                Manage your domestic shipments with ease and efficiency. Our platform streamlines the process, ensuring compliance, accuracy, and cost-effective solutions for all your logistics needs.
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
                    Enter the essential shipment information, including the type of goods, weight, dimensions, pickup location, and delivery address.
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
                    Our platform validates your input and ensures compliance with domestic regulations while preparing the data for route optimization.
                  </p>
                </div>
                <div className={Style.loanApprovalStep}>
                  <div className={Style.stepNumberAndHeadingDiv}>
                    <p className={Style.stepNumberPara}>3</p>
                    <p className={Style.loanStepHeading}>
                      Find the Best Route
                    </p>
                  </div>
                  <p className={Style.loanStepExplanationPara}>
                    Using advanced algorithms, we calculate the most cost-effective and efficient route for your shipment.
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
            <h2>Enter Shipment Details</h2>
            <form className={Style.popupForm}>
              <label>
                Origin:
                <input type="text" name="origin" />
              </label>
              <label>
                Destination:
                <input type="text" name="destination" />
              </label>
              <label>
                Mode of Transport:
                <select name="mode">
                  <option value="air">Air</option>
                  <option value="road">Road</option>
                </select>
              </label>
              <label>
                Package Details:
                <input type="number" name="weight" placeholder="Weight (kg)" />
                <input type="text" name="hscode" placeholder="HS Code" />
                <select name="shipmentType">
                  <option value="fragile">Fragile</option>
                  <option value="nonFragile">Non-Fragile</option>
                </select>
              </label>
              <label>
                Special Instructions:
                <textarea name="instructions" rows="3"></textarea>
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
          </div>
        </div>
      )}
    </>
  );
}

export default DomesticRoute;

