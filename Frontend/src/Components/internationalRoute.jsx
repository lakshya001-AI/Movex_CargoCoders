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

function InternationalRoute() {
  return <>
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
      International Shipment Made Easy
    </h1>
    <p className={Style.loanApprovalPara}>
      Simplify your international shipping with our advanced platform. We leverage cutting-edge algorithms, cost-efficient models, and time optimization techniques to deliver a seamless and reliable experience for global logistics.
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
          Enter key shipment details, including type of goods, weight, dimensions, pickup location, destination country, and delivery address.
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
          Our system validates your information, checks compliance with international trade regulations, and prepares data for optimal routing.
        </p>
      </div>
      <div className={Style.loanApprovalStep}>
        <div className={Style.stepNumberAndHeadingDiv}>
          <p className={Style.stepNumberPara}>3</p>
          <p className={Style.loanStepHeading}>
            Optimize and Find the Route
          </p>
        </div>
        <p className={Style.loanStepExplanationPara}>
          Using Dijkstra's algorithm and time optimization models, we identify the most efficient and cost-effective international shipping route.
        </p>
      </div>
    </div>

    <div className={Style.getPredictionBtnDiv}>
      <button
        className={Style.checkEligibilityBtn}
      >
        Find the Route
      </button>
    </div>
  </div>
</div>

          </div>
        </div>
  </>
}

export default InternationalRoute;


