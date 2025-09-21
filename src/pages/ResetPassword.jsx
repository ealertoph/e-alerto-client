// src/pages/ResetPassword.jsx
import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import FormPanelResetPassword from "../components/FormPanelResetPassword";

const ResetPassword = () => {
  const { backendUrl, isLoggedIn, userData } = useContext(AppContent);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  // --- State ---
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  // --- Validation functions ---
  const validateEmail = () => {
    const errs = {};
    if (!email) errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      errs.email = "Please enter a valid email address.";
    return errs;
  };

  const validatePassword = () => {
    const errs = {};
    if (!newPassword) errs.newPassword = "Password is required.";
    else if (newPassword.length < 8)
      errs.newPassword = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(newPassword))
      errs.newPassword = "Password must contain at least one uppercase letter.";
    else if (!/[a-z]/.test(newPassword))
      errs.newPassword = "Password must contain at least one lowercase letter.";
    else if (!/[0-9]/.test(newPassword))
      errs.newPassword = "Password must contain at least one number.";
    else if (!/[^\w\s]/.test(newPassword))
      errs.newPassword =
        "Password must contain at least one special character.";

    if (!confirmPassword)
      errs.confirmPassword = "Please confirm your password.";
    else if (newPassword !== confirmPassword)
      errs.confirmPassword = "Passwords do not match.";

    return errs;
  };

  // --- Handlers ---
  const onSubmitEmail = async (e) => {
    e.preventDefault(); // <- prevent default form submission

    const validationErrors = validateEmail();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    if (
      isLoggedIn &&
      userData?.email &&
      email.toLowerCase() !== userData.email.toLowerCase()
    ) {
      return setErrors({ email: "Email mismatch. Please try again." });
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOTP = async (e, enteredOtp) => {
    e.preventDefault(); // <- prevent default form submission

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-reset-otp`,
        { email, otp: enteredOtp }
      );
      if (data.success) {
        toast.success(data.message);
        setOtp(enteredOtp);
        setIsOtpSubmitted(true);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault(); // <- prevent default form submission

    const validationErrors = validatePassword();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onOtpVerified = (enteredOtp) => {
    setOtp(enteredOtp);
    setIsOtpSubmitted(true);
  };

  // --- Render ---
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
            Reset Password
          </h1>
          <p className="opacity-90 text-base leading-relaxed">
            No worries! Enter your email and follow the steps to securely reset
            your password.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <FormPanelResetPassword
          backendUrl={backendUrl}
          isLoggedIn={isLoggedIn}
          userData={userData}
          email={email}
          setEmail={setEmail}
          errors={errors}
          setErrors={setErrors}
          submitted={submitted}
          setSubmitted={setSubmitted}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          otp={otp}
          setOtp={setOtp}
          isEmailSent={isEmailSent}
          setIsEmailSent={setIsEmailSent}
          isOtpSubmitted={isOtpSubmitted}
          setIsOtpSubmitted={setIsOtpSubmitted}
          onOtpVerified={onOtpVerified}
          onSubmitNewPassword={onSubmitNewPassword}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
