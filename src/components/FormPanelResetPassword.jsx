// src/components/FormPanelResetPassword.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import axios from "axios";

const FormPanelResetPassword = ({
  backendUrl,
  isLoggedIn,
  userData,
  email,
  setEmail,
  errors,
  setErrors,
  submitted,
  setSubmitted,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onOtpVerified,
  onSubmitNewPassword,
  isEmailSent,
  isOtpSubmitted,
  setIsEmailSent,
  setIsOtpSubmitted,
}) => {
  const navigate = useNavigate();
  const [otpTimer, setOtpTimer] = useState(15 * 60);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const [resetOtpTimerTrigger, setResetOtpTimerTrigger] = useState(0);

  // OTP Countdown
  useEffect(() => {
    if (!isEmailSent || isOtpSubmitted) return;

    setOtpTimer(15 * 60); // reset timer whenever resend
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error("OTP expired. Please request a new one.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isEmailSent, isOtpSubmitted, resetOtpTimerTrigger]);

  // Resend cooldown countdown
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  // Resend OTP at expiry or after cooldown
  const onResendOtp = async () => {
    if (resendCooldown > 0) return; // prevent spam
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        toast.success("A new OTP has been sent to your email.");
        setOtpTimer(15 * 60);
        setResendCooldown(30); // 30 seconds cooldown
        inputRefs.current.forEach((input) => (input.value = ""));
        setOtpError("");
        setIsOtpSubmitted(false);
        inputRefs.current[0]?.focus();
        setResetOtpTimerTrigger((prev) => prev + 1); // trigger OTP timer reset
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // OTP input handlers
  const handleInput = (e, index) => {
    e.target.value = e.target.value.replace(/\D/, ""); // allow only digits
    if (e.target.value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").split("");
    paste.forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char;
    });
  };

  // Step 1: Send OTP
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!email) return setErrors({ email: "Email is required." });
    else if (!/^\S+@\S+\.\S+$/.test(email))
      return setErrors({ email: "Please enter a valid email address." });

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
        setOtpTimer(15 * 60);
        setResendCooldown(30); // 30 seconds cooldown before resend
        setOtpError("");
        setIsEmailSent(true);
        inputRefs.current[0]?.focus();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Step 2: Verify OTP
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el.value);
    const enteredOtp = otpArray.join("");

    if (enteredOtp.length !== 6 || otpArray.some((d) => !d)) {
      return setOtpError("Please enter the 6-digit code.");
    }
    setOtpError("");

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-reset-otp`,
        {
          email,
          otp: enteredOtp,
        }
      );
      if (data.success) {
        toast.success(data.message);
        onOtpVerified(enteredOtp);
        setIsOtpSubmitted(true);
      } else setOtpError(data.message);
    } catch (error) {
      setOtpError(error.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/50 relative">
      <button
        onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
        className="absolute top-5 left-6 flex items-center text-gray-300 hover:text-white text-sm font-medium transition"
      >
        <ArrowBackIcon fontSize="large" className="mr-1" />
      </button>

      <div className="flex justify-center mb-6">
        <img
          src={assets.qcde_logo}
          alt="QCDE Logo"
          className="h-24 md:h-28 object-contain"
        />
      </div>

      {/* STEP 1: EMAIL */}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="space-y-6" noValidate>
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Enter Your Email
          </h2>
          <p className="text-center text-gray-200 text-sm">
            We’ll send you a one-time code to reset your password.
          </p>
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                errors.email ? "border-red-400" : "border-white/20"
              } text-white placeholder-gray-200 focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-400" : "focus:ring-indigo-400"
              } transition-all duration-300 hover:bg-white/10`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (submitted)
                  setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            {submitted && errors.email && (
              <p className="mt-2 text-sm text-red-300">{errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
          >
            Send OTP
          </button>
        </form>
      )}

      {/* STEP 2: OTP */}
      {isEmailSent && !isOtpSubmitted && (
        <form onSubmit={onSubmitOTP} className="space-y-6" noValidate>
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Enter OTP
          </h2>
          <p className="text-center text-gray-200 text-sm">
            Check your email and input the 6-digit code below.
          </p>
          <p className="text-center text-sm text-gray-300">
            OTP expires in: {formatTime(otpTimer)}
          </p>

          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-10 h-12 text-center text-xl rounded-lg bg-white/5 border ${
                    otpError ? "border-red-400" : "border-white/20"
                  } text-white focus:outline-none focus:ring-2 ${
                    otpError ? "focus:ring-red-400" : "focus:ring-indigo-400"
                  }`}
                />
              ))}
          </div>
          {otpError && (
            <p className="mt-2 text-sm text-red-300 text-center">{otpError}</p>
          )}
          <button
            type="submit"
            disabled={otpTimer === 0}
            className={`w-full py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 ${
              otpTimer === 0
                ? "bg-gray-600 cursor-not-allowed text-white"
                : "bg-blue-900 hover:bg-blue-800 text-white"
            }`}
          >
            Submit OTP
          </button>
          {/* Resend OTP Button */}
          <button
            type="button"
            onClick={onResendOtp}
            disabled={resendCooldown > 0}
            className={`w-full py-2 rounded-lg transition-all duration-300 ${
              otpTimer === 0
                ? "bg-blue-900 hover:bg-blue-800 text-white"
                : resendCooldown > 0
                  ? "bg-gray-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            {resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
              : "Resend OTP"}
          </button>
        </form>
      )}

      {/* STEP 3: NEW PASSWORD */}
      {isEmailSent && isOtpSubmitted && (
        <form onSubmit={onSubmitNewPassword} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Create New Password
          </h2>
          <div className="text-center text-gray-200 text-sm space-y-1">
            <p className="font-bold">Choose a strong and secure password</p>
            <ul className="list-disc list-inside text-left inline-block">
              <li>At least 8 characters</li>
              <li>1 uppercase letter</li>
              <li>1 lowercase letter</li>
              <li>1 number</li>
              <li>1 special character</li>
            </ul>
          </div>
          <div>
            <input
              type="password"
              placeholder="New password"
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                errors.newPassword ? "border-red-400" : "border-white/20"
              } text-white placeholder-gray-200 focus:outline-none focus:ring-2 ${
                errors.newPassword
                  ? "focus:ring-red-400"
                  : "focus:ring-indigo-400"
              } transition-all duration-300 hover:bg-white/10`}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (submitted)
                  setErrors((prev) => ({ ...prev, newPassword: undefined }));
              }}
            />
            {submitted && errors.newPassword && (
              <p className="mt-2 text-sm text-red-300">{errors.newPassword}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm new password"
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                errors.confirmPassword ? "border-red-400" : "border-white/20"
              } text-white placeholder-gray-200 focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "focus:ring-red-400"
                  : "focus:ring-indigo-400"
              } transition-all duration-300 hover:bg-white/10`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (submitted)
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
              }}
            />
            {submitted && errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-300">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
};

export default FormPanelResetPassword;
