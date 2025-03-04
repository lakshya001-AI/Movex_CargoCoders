import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faInfoCircle , faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

function RouteSelection() {
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
              <Link
                className={Style.profileBtn}
                to="/profilePage"
              >
                Profile
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default RouteSelection;
