import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faInfoCircle , faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

function MainPage() {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);

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
              <h1>Redefining Financial Success with <span class={Style.gradientText}>AI.</span></h1>
              <p>Leverage the power of AI to predict loan outcomes and receive expert financial advice tailored to your needs, ensuring your future is brighter.</p>
              <div className={Style.btnDivSection1MainPageOverlay}>
                <button className={Style.gettingStartedBtn}>Explore</button>
                <button className={Style.learnMoreBtn}>Learn More</button>
              </div>


            </div>



          </div>

          {/* section 2 Main Page */}

          <div className={Style.section2MainPage}>
    {/* Here give the left border with gradient color of background: linear-gradient(to right, #4776E6 0%, #8E54E9 51%, #4776E6 100%);*/}
            <div className={Style.section2MainPageHeading}><div className={Style.borderDiv}></div>Why Choose Us?</div>
            <div className={Style.section2MainPagePara}>With our advanced AI technology, we provide unbiased, transparent, and personalized financial solutions, helping you make smarter decisions for a more secure financial future.</div>
            {/* give the gradient color of background: linear-gradient(to right, #4776E6 0%, #8E54E9 51%, #4776E6 100%); to every feature div with animation , Properly arrange content inside the feature div */}
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
 
          </div>

          {/* section 3 Main Page */}

          <div className={Style.section3MainPage}>
            <div className={Style.section3MainPageOverlay}>
            <div className={Style.section3MainPageHeading}><div className={Style.borderDiv}></div>Your Data, Secured and  <span class={Style.gradientText1}>Encrypted.</span></div>
            <div className={Style.section3MainPagePara}>Your privacy and security are our top priorities. Using cutting-edge technologies, including blockchain, we store your financial data in a decentralized, tamper-proof system, ensuring only authorized access. This gives you peace of mind, knowing your information is protected and your financial journey remains secure.</div>
            <button className={Style.learnMoreBtn1}>Learn More</button>
            </div>
          </div>

          {/* section 4 Main Page */}

          <div className={Style.section4MainPage}>

           

            <div className={Style.section4MainPageDiv2}>
              <h1 className={Style.section4MainPageHeading}>How It Works?</h1>
              <p className={Style.section4MainPagePara}>Getting started with our platform is simple and quick. Just follow three easy steps, and you'll have access to personalized financial solutions and insights, all powered by AI and blockchain technology. Whether it's loan approvals or financial advice, we ensure a seamless and secure experience from start to finish.</p>
              <div className={Style.btnDivSection1MainPageOverlay}>
                <button className={Style.gettingStartedBtn}>Explore</button>
                <button className={Style.learnMoreBtn}>Learn More</button>
              </div>


            </div>


            <div className={Style.section4MainPageDiv1}>
              <div className={Style.step}>
                <div className={Style.stepNumberAndHeadingDiv}>
                  <p className={Style.stepNumberPara}>1</p>
                  <p className={Style.stepHeading}>Sign Up in Minutes</p>
                </div>
                  <p className={Style.stepExplanationPara}>Create your account quickly with just a few details and start your journey toward financial empowerment.</p>
              </div>
              <div className={Style.step}>
                <div className={Style.stepNumberAndHeadingDiv}>
                  <p className={Style.stepNumberPara}>2</p>
                  <p className={Style.stepHeading}>Provide Your Information</p>
                </div>
                  <p className={Style.stepExplanationPara}>Share essential details to receive accurate loan predictions results and personalized advice.</p>
              </div>
              <div className={Style.step}>
                <div className={Style.stepNumberAndHeadingDiv}>
                  <p className={Style.stepNumberPara}>3</p>
                  <p className={Style.stepHeading}>Get Actionable Insights</p>
                </div>
                  <p className={Style.stepExplanationPara}>Receive tailored solutions to make informed decisions for your financial success and Investment.</p>
              </div>
            </div>


          </div>

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
