import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faTimes } from "@fortawesome/free-solid-svg-icons";


function MainPage() {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleRouteSelection = (routeType) => {
    setShowOverlay(false);
    // Navigate or handle based on routeType
    console.log(`Selected Route: ${routeType}`);
    if (routeType === "domestic") {
      navigate("/domesticRoute");
    } else if (routeType === "international") {
      navigate("/internationalRoute");
    }
  };

  function logoutUser() {
    localStorage.removeItem("authToken");
    navigate("/");
  }



  let userFirstName = localStorage.getItem("userFirstName") || "John";
  let userLastName = localStorage.getItem("userLastName") || "Doe";
  let userEmailAddress =
    localStorage.getItem("userEmailAddress") || "john.doe@example.com";

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

              {showUserInfo && (
                <div className={Style.userInfoDiv}>
                  <p
                    className={Style.userInfoDivPara1}
                  >{`${userFirstName} ${userLastName}`}</p>
                  <p className={Style.userInfoDivPara2}>{userEmailAddress}</p>
                  <button className={Style.logoutBtn} onClick={logoutUser}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* section 1 Main Page */}

          <div className={Style.section1MainPage}>

            <div className={Style.section1MainPageOverlay}>

              {/* <h1>Redefining Financial Success with AI</h1> */}
              <h1>Transform Your Logistics Journey with <span class={Style.gradientText}>AI.</span></h1>
              <p>Revolutionize logistics with seamless compliance checks and optimized shipping routes. Movex combines cutting-edge technologies to ensure efficient, transparent, and sustainable cargo transportation for businesses worldwide.</p>
              <div className={Style.btnDivSection1MainPageOverlay}>
                <button className={Style.gettingStartedBtn}>Explore</button>
                <button className={Style.learnMoreBtn}>Learn More</button>
              </div>


            </div>



          </div>

          {/* section 2 Main Page */}

          {/* <div className={Style.section2MainPage}>
            <div className={Style.section2MainPageHeading}><div className={Style.borderDiv}></div>Why Choose Us?</div>
            <div className={Style.section2MainPagePara}>With our advanced AI technology, we provide unbiased, transparent, and personalized financial solutions, helping you make smarter decisions for a more secure financial future.</div>
            <div className={Style.featureDiv}>
              <div className={Style.feature}>
                <h1>Bias-Free Loan Approvals</h1>
                <p>Our AI-powered platform ensures fair and unbiased decisions for all users. Say goodbye to discrimination and hello to equal opportunities.</p>
                <a href="">learn more <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></a>
              </div>
              <div className={Style.feature}>
                <h1>Instant Loan Prediction</h1>
                <p>Get real-time insights into your loan eligibility with detailed explanations. Understand the 'why' behind every decision.</p>
                <a href="">learn more <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></a>
              </div>
              <div className={Style.feature}>
                <h1>Personalized Financial Advice</h1>
                <p>With cutting-edge AI and expert recommendations, get tailored advice that suits your financial goals and lifestyle.</p>
                <a href="">learn more <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></a>
              </div>
            </div>
 
          </div> */}

<div className={Style.section2MainPage}>
    {/* Left border with gradient */}
    <div className={Style.section2MainPageHeading}>
        <div className={Style.borderDiv}></div>Why Choose Us?
    </div>
    <div className={Style.section2MainPagePara}>
        Navigate the complexities of global shipping effortlessly with our compliance checks, route optimization, and cost-effective solutions, ensuring timely deliveries while reducing expenses.
    </div>
    {/* Gradient background and animations for each feature */}
    <div className={Style.featureDiv}>
        <div className={Style.feature}>
            <h1>Compliance Check</h1>
            <p>Ensure all your shipments meet global shipping regulations with our meticulous compliance check random forest model.</p>
            <a href="">learn more <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a>
        </div>
        <div className={Style.feature}>
            <h1>Route Optimization</h1>
            <p>Leveraging advanced algorithms like Dijkstra's to determine the most efficient and shortest route, also visualizing it on the Google Maps.</p>
            <a href="">learn more <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a>
        </div>
        <div className={Style.feature}>
            <h1>Time & Cost Efficiency</h1>
            <p>Optimize your operations by reducing delivery times and cutting costs with our innovative solutions tailored for global shipping needs.</p>
            <a href="">learn more <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a>
        </div>
    </div>
</div>


          {/* section 3 Main Page */}

          <div className={Style.section3MainPage}>
            <div className={Style.section3MainPageOverlay}>
            <div className={Style.section3MainPageHeading}><div className={Style.borderDiv}></div>Your Data, Secured and  <span class={Style.gradientText1}>Encrypted.</span></div>
            <div className={Style.section3MainPagePara}>Your privacy and security are our top priorities. Leveraging cutting-edge technologies like blockchain, we ensure your shipping data is stored in a decentralized, tamper-proof system, allowing only authorized access. Rest assured, your information is protected, and your logistics operations remain secure and efficient.</div>
            <button className={Style.learnMoreBtn1}>Learn More</button>
            </div>
          </div>

          {/* section 4 Main Page */}

          <div className={Style.section4MainPage}>

           

          <div className={Style.section4MainPageDiv2}>
  <h1 className={Style.section4MainPageHeading}>How It Works?</h1>
  <p className={Style.section4MainPagePara}>
    Getting started with our platform is easy and efficient. Follow three simple steps to streamline your logistics process: select the shipment type, ensure compliance with global shipping regulations, and find the best route using advanced algorithms and real-time visualization. Experience seamless and secure shipping like never before.
  </p>
  <div className={Style.btnDivSection1MainPageOverlay}>
    <button
      className={Style.gettingStartedBtn}
      onClick={() => setShowOverlay(true)}
    >
      Find Route
    </button>
    <button className={Style.learnMoreBtn}>Learn More</button>
  </div>
</div>


<div className={Style.section4MainPageDiv1}>
  <div className={Style.step}>
    <div className={Style.stepNumberAndHeadingDiv}>
      <p className={Style.stepNumberPara}>1</p>
      <p className={Style.stepHeading}>Select Shipment Type</p>
    </div>
    <p className={Style.stepExplanationPara}>
      Choose the type of shipment you need to handle, whether it's domestic or international, based on your logistics requirements.
    </p>
  </div>
  <div className={Style.step}>
    <div className={Style.stepNumberAndHeadingDiv}>
      <p className={Style.stepNumberPara}>2</p>
      <p className={Style.stepHeading}>Compliance Check</p>
    </div>
    <p className={Style.stepExplanationPara}>
      Ensure your shipment adheres to global shipping regulations with our seamless compliance checks using latest technologies like AI and ML.
    </p>
  </div>
  <div className={Style.step}>
    <div className={Style.stepNumberAndHeadingDiv}>
      <p className={Style.stepNumberPara}>3</p>
      <p className={Style.stepHeading}>Find the Best Route</p>
    </div>
    <p className={Style.stepExplanationPara}>
      Utilize advanced algorithms to determine the most efficient and cost-effective route, visualized on Google Maps for precision.
    </p>
  </div>
</div>



          </div>

           {/* Overlay Popup */}
           {/* {showOverlay && (
            <div className={Style.overlay}>
              <div className={Style.overlayContent}>
                <h2>Select Shipment Type</h2>
                <button
                  className={Style.overlayButton}
                  onClick={() => handleRouteSelection("domestic")}
                >
                  Domestic
                </button>
                <button
                  className={Style.overlayButton}
                  onClick={() => handleRouteSelection("international")}
                >
                  International
                </button>
                <button
                  className={Style.overlayCloseButton}
                  onClick={() => setShowOverlay(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}  */}

           {/* Overlay Popup */}
           {showOverlay && (
            <div className={Style.overlay}>
              <div className={Style.overlayContent}>
                <h2>Select Shipment Type</h2>
                <button
                  className={Style.overlayButton}
                  onClick={() => handleRouteSelection("domestic")}
                >
                  Domestic
                </button>
                <button
                  className={Style.overlayButton}
                  onClick={() => handleRouteSelection("international")}
                >
                  International
                </button>
                <div className={Style.crossBtnDiv}>
                <button
                  className={Style.overlayCloseButton}
                  onClick={() => setShowOverlay(false)}
                >
                  <FontAwesomeIcon icon={faTimes} size="xl"/>
                </button>
                </div>
              </div>
            </div>
          )}

          {/* footer section*/}

          <div className={Style.footerSection}>
  <p>&copy; {new Date().getFullYear()} FINEX. All rights reserved.</p>
</div>

       



          
        </div>
      </div>
    </>
  );
}

export default MainPage;
