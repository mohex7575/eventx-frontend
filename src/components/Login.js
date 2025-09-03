import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", loginData);
      const { token, role, name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", name);

      if (onLogin) onLogin();
      navigate(role === "admin" ? "/admin" : "/events");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/register", {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userName", response.data.name);

      if (onLogin) onLogin();
      navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* خلفية صورة */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80"
          alt="Event Background"
          className="w-full h-full object-cover"
        />
        {/* طبقة داكنة فوق الصورة */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      {/* صندوق تسجيل الدخول */}
      <div className="relative z-10 bg-gray-900/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-700">
        {/* شعار */}
        <h1 className="text-4xl font-extrabold text-center text-purple-500 mb-6">
          Event<span className="text-blue-400">X</span>
        </h1>

        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {isLogin ? "Welcome Back 👋" : "Create Your Account 🚀"}
        </h2>

        {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
          className="space-y-4"
        >
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={registerData.name}
              onChange={handleRegisterChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          )}

          <input
            type="email"
            name="email"
            value={isLogin ? loginData.email : registerData.email}
            onChange={isLogin ? handleLoginChange : handleRegisterChange}
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="password"
            name="password"
            value={isLogin ? loginData.password : registerData.password}
            onChange={isLogin ? handleLoginChange : handleRegisterChange}
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition duration-200 disabled:opacity-50"
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Creating account..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          {isLogin ? "Don’t have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-purple-400 font-semibold hover:underline ml-1"
          >
            {isLogin ? "Register now" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
