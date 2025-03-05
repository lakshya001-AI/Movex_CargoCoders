import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faInfoCircle,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

function DomesticRoute() {
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
          <p className={Style.loanStepHeading}>Provide Shipment Details</p>
        </div>
        <p className={Style.loanStepExplanationPara}>
          Enter the essential shipment information, including the type of goods, weight, dimensions, pickup location, and delivery address.
        </p>
      </div>
      <div className={Style.loanApprovalStep}>
        <div className={Style.stepNumberAndHeadingDiv}>
          <p className={Style.stepNumberPara}>2</p>
          <p className={Style.loanStepHeading}>Analyze Shipment Details</p>
        </div>
        <p className={Style.loanStepExplanationPara}>
          Our platform validates your input and ensures compliance with domestic regulations while preparing the data for route optimization.
        </p>
      </div>
      <div className={Style.loanApprovalStep}>
        <div className={Style.stepNumberAndHeadingDiv}>
          <p className={Style.stepNumberPara}>3</p>
          <p className={Style.loanStepHeading}>Find the Best Route</p>
        </div>
        <p className={Style.loanStepExplanationPara}>
          Using advanced algorithms, we calculate the most cost-effective and efficient route for your shipment.
        </p>
      </div>
    </div>

    <div className={Style.getPredictionBtnDiv}>
      <button className={Style.checkEligibilityBtn}>
        Find the Route
      </button>
    </div>
  </div>
</div>

          
        </div>
      </div>
    </>
  );
}

export default DomesticRoute;
