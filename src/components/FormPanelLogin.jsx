// src/components/FormPanelLogin.jsx
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { assets } from "../assets/assets";
import { Eye, EyeOff } from "lucide-react"; // eye icons

const FormPanelLogin = ({
  form,
  errors,
  submitted,
  handleChange,
  onSubmitHandler,
  failedAttempts,
  captchaValue,
  setCaptchaValue,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={onSubmitHandler}
      noValidate
      className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/50 space-y-6 opacity-0 animate-fade-in-delay-4"
    >
      <div className="flex justify-center mb-6">
        <img
          src={assets.qcde_logo}
          alt="QCDE Logo"
          className="h-24 md:h-28 object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      <h2 className="text-3xl font-bold text-center text-white mb-8">
        QCDE Employee Login
      </h2>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
            submitted && errors.email ? "border-red-400" : "border-white/20"
          } text-white placeholder-gray-200 focus:outline-none focus:ring-2 ${
            submitted && errors.email
              ? "focus:ring-red-400"
              : "focus:ring-indigo-400"
          } transition-all duration-300 hover:bg-white/10`}
        />
        {submitted && errors.email && (
          <p className="mt-2 text-sm text-red-300">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={`w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border ${
              submitted && errors.password
                ? "border-red-400"
                : "border-white/20"
            } text-white placeholder-gray-200 focus:outline-none focus:ring-2 ${
              submitted && errors.password
                ? "focus:ring-red-400"
                : "focus:ring-indigo-400"
            } transition-all duration-300 hover:bg-white/10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-white select-none focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {submitted && errors.password && (
          <p className="mt-2 text-sm text-red-300">{errors.password}</p>
        )}
      </div>

      {/* Forgot Password */}
      <div className="text-right">
        <button
          type="button"
          className="text-sm text-indigo-200 hover:text-white transition-colors duration-200"
          onClick={() => (window.location.href = "/reset-password")}
        >
          Forgot Password?
        </button>
      </div>

      {/* Captcha */}
      {failedAttempts >= 3 && (
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(value) => setCaptchaValue(value)}
          />
        </div>
      )}

      {/* Login Button */}
      <button
        type="submit"
        className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
      >
        Login
      </button>
    </form>
  );
};

export default FormPanelLogin;
