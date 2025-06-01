import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState(""); // State to store email
  const [password, setPassword] = useState(""); // State to store password
  const [loading, setLoading] = useState(false); // Loading state to indicate login in progress
  const [error, setError] = useState(""); // Error message state
  const navigate = useNavigate(); // Hook to navigate between pages

  // Redirect to the chat page if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from local storage
    if (token) {
      navigate("/chat"); // Redirect to chat if the token exists
    }
  }, [navigate]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading to true when the login starts
    setError(""); // Clear any previous error messages

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Send JSON content
        },
        body: JSON.stringify({ email, password }), // Send the email and password in the request body
      });

      const data = await response.json(); // Get the response as JSON

      if (response.ok && data.token) {
        // If login is successful, store the token in localStorage
        localStorage.setItem("token", data.token);
        setEmail(""); // Clear the email input
        setPassword(""); // Clear the password input
        navigate("/chat"); // Redirect to the chat page
      } else {
        setError(data.message || "Login failed. Please try again."); // Show error if login fails
      }
    } catch (error) {
      setError("An error occurred. Please try again."); // Show error if network issues occur
    }
    setLoading(false); // Set loading to false after the login attempt
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state on input change
            required
          />
          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            required
          />
          {/* Error message display */}
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          {/* Submit button */}
          <button
            type="submit"
            className={`w-full p-2 rounded ${loading ? "bg-gray-400" : "bg-blue-600"} text-white hover:bg-blue-700`}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : "Login"} {/* Show loading text while logging in */}
          </button>
        </form>
        {/* Sign up link */}
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")} // Navigate to the sign-up page
            className="text-blue-600 cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
