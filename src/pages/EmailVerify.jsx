import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import FormPanelEmailVerify from "../components/FormPanelEmailVerify";

const EmailVerify = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContent);
  const navigate = useNavigate();

  // Redirect if already verified
  useEffect(() => {
    if (userData && userData.isAccountVerified) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  return (
    <div
      className="relative min-h-screen flex flex-col md:flex-row font-sans overflow-hidden"
      style={{
        background: `url(${assets.login_bg}) no-repeat center center`,
        backgroundSize: "cover",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/100 via-blue-950/50 to-blue-950/100"></div>

      {/* Left Panel */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center text-white px-6 pt-12 md:px-10 md:py-16">
        <div className="relative z-10 max-w-md text-center md:text-left">
          <img
            src={assets.logo_white}
            alt="E-Alerto Logo"
            className="w-44 mb-8 mx-auto md:mx-0 cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/")}
          />
          <h1 className="text-5xl font-bold mb-4 leading-tight tracking-tight drop-shadow-lg">
            Verify Your Email
          </h1>
          <p className="opacity-90 text-base leading-relaxed">
            A 6-digit code has been sent to your email. Enter it below to verify
            your account and unlock access.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <FormPanelEmailVerify
          backendUrl={backendUrl}
          userData={userData}
          getUserData={getUserData}
        />
      </div>
    </div>
  );
};

export default EmailVerify;
