// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import FormPanelLogin from "../components/FormPanelLogin";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaValue, setCaptchaValue] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.email) {
      errs.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.password) errs.password = "Password is required.";
    return errs;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length)
      return setErrors(validationErrors);

    // If captcha required but not solved
    if (failedAttempts >= 3 && !captchaValue) {
      return toast.error("Please complete the captcha to continue.");
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, form, {
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
        navigate("/dashboard");
      } else {
        toast.error(data.message);
        setFailedAttempts((prev) => prev + 1);
      }
    } catch (err) {
      toast.error(err.message);
      setFailedAttempts((prev) => prev + 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitted) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

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
            Welcome Back
          </h1>
          <p className="opacity-90 text-base leading-relaxed">
            Sign in to your employee account and contribute to smarter road
            management in Quezon City.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <FormPanelLogin
          form={form}
          errors={errors}
          submitted={submitted}
          handleChange={handleChange}
          onSubmitHandler={onSubmitHandler}
          failedAttempts={failedAttempts}
          captchaValue={captchaValue}
          setCaptchaValue={setCaptchaValue}
        />
      </div>
    </div>
  );
};

export default Login;
