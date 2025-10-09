import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Loader2 } from "lucide-react"; // 👈 Spinner icon
import { assets } from "../assets/assets";

const FormPanelEmailVerify = ({ backendUrl, userData, getUserData }) => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [otpTimer, setOtpTimer] = useState(3 * 60);
  const [otpExpired, setOtpExpired] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resetOtpTimerTrigger, setResetOtpTimerTrigger] = useState(0);
  const [loading, setLoading] = useState(false); // 👈 NEW loading state

  // OTP countdown timer
  useEffect(() => {
    if (!userData) return;

    setOtpTimer(3 * 60);
    setOtpExpired(false);
    setResendCooldown(30);

    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtpExpired(true);
          toast.error("OTP expired. Please request a new one.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userData, resetOtpTimerTrigger]);

  // Resend cooldown countdown
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  const handleInput = (e, index) => {
    e.target.value = e.target.value.replace(/\D/, ""); // Allow only digits
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

  const validateOtp = () => {
    const errs = {};
    const otpArray = inputRefs.current.map((el) => el.value.trim());
    const otp = otpArray.join("");

    if (otp.length !== 6 || otpArray.some((d) => !d)) {
      errs.otp = "Please enter the full 6-digit OTP.";
    }
    return { errs, otp };
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrors({});
    setLoading(true); // 👈 show loading

    if (otpTimer === 0) {
      setLoading(false);
      return toast.error("OTP has expired. Please resend a new one.");
    }

    const { errs, otp } = validateOtp();
    if (Object.keys(errs).length) {
      setLoading(false);
      return setErrors(errs);
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { userId: userData._id, otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error verifying OTP: " + error.message);
    } finally {
      setLoading(false); // 👈 hide loading after done
    }
  };

  const sendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      if (!userData) return;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        { userId: userData._id }
      );
      if (data.success) {
        toast.success("OTP sent to your email");
        setOtpTimer(3 * 60);
        setOtpExpired(false);
        inputRefs.current.forEach((input) => (input.value = ""));
        setErrors({});
        inputRefs.current[0]?.focus();
        setResendCooldown(30);
        setResetOtpTimerTrigger((prev) => prev + 1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error sending OTP: " + error.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/50 relative">
      <button
        onClick={() => navigate("/dashboard")}
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

      <form onSubmit={onSubmitHandler} className="space-y-6" noValidate>
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Enter OTP
        </h2>
        <p className="text-center text-gray-200 text-sm">
          Input the 6-digit code sent to your registered email.
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
                disabled={otpExpired}
                className={`w-10 h-12 text-center text-xl rounded-lg bg-white/5 border ${
                  errors.otp ? "border-red-400" : "border-white/20"
                } text-white focus:outline-none focus:ring-2 ${
                  errors.otp ? "focus:ring-red-400" : "focus:ring-indigo-400"
                }`}
              />
            ))}
        </div>

        {errors.otp && (
          <p className="mt-2 text-sm text-red-300 text-center">{errors.otp}</p>
        )}

        {/* Verify Button */}
        <button
          type="submit"
          disabled={otpExpired || loading}
          className={`w-full py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            otpExpired || loading
              ? "bg-gray-600 cursor-not-allowed text-white"
              : "bg-blue-900 hover:bg-blue-800 text-white"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </button>

        {/* Resend OTP Button */}
        <button
          type="button"
          onClick={sendOtp}
          disabled={resendCooldown > 0}
          className={`w-full py-2 rounded-lg transition-all duration-300 ${
            otpExpired
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
    </div>
  );
};

export default FormPanelEmailVerify;
