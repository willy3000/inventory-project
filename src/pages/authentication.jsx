"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AuthGuardLogin from "@/components/auth/auth-guard-login";

function MainComponent() {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = React.useState({});
  const [isLogin, setIsLogin] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [signupSuccess, setSignupSuccess] = React.useState(false);
  const [loginSuccess, setLoginSuccess] = React.useState(null);
  const [loginError, setLoginError] = React.useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...formErrors };
    switch (name) {
      case "username":
        if (!value) {
          errors.username = "Username is required";
        } else if (value.length < 3) {
          errors.username = "Username must be at least 3 characters long";
        } else {
          delete errors.username;
        }
        break;
      case "email":
        if (!value) {
          errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors.email = "Email address is invalid";
        } else {
          delete errors.email;
        }
        break;
      case "password":
        if (!value) {
          errors.password = "Password is required";
        } else if (value.length < 6) {
          errors.password = "Password must be at least 6 characters long";
        } else {
          delete errors.password;
        }
        break;
      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = "Confirm Password is required";
        } else if (value !== formData.password) {
          errors.confirmPassword = "Passwords do not match";
        } else {
          delete errors.confirmPassword;
        }
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const handleSubmit = async (e) => {
    console.log("handling");
    e.preventDefault();
    if (Object.keys(formErrors).length === 0) {
      setIsLoading(true);
      await setTimeout(async () => {
        if (!isLogin) {
          try {
            const url = "http://localhost:5000/api/auth/signUp";
            const res = await axios.post(url, {
              username: formData.username,
              email: formData.email,
              password: formData.password,
            });
            if (res.data.success) {
              setSignupSuccess(true);
              localStorage.setItem("user", JSON.stringify(res.data.user));
              localStorage.setItem("token", res.data.token);
            }
          } catch (err) {
            console.log(err);
          }
          setIsLoading(false);
        } else {
          try {
            const url = "http://localhost:5000/api/auth/logIn";
            const res = await axios.post(url, {
              email: formData.email,
              password: formData.password,
            });
            if (res.data.success) {
              setLoginSuccess(true);
              localStorage.setItem("user", JSON.stringify(res.data.user));
              localStorage.setItem("token", res.data.token);
              setTimeout(() => {
                router.push("dashboard");
              }, 1500);
            } else {
              setLoginSuccess(false);
              console.log("error", res.data.message);
              setLoginError(res.data.message);
            }
          } catch (err) {
            setLoginSuccess(false);
            setLoginError(err);
            console.log(err);
          }
          setIsLoading(false);
        }
      }, 2000);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormErrors({});
    setLoginSuccess(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <AuthGuardLogin>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {!signupSuccess ? (
          <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                {isLogin ? "Log In" : "Sign Up"}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                {isLogin ? "Welcome back" : "Manage your inventory with ease"}
              </p>
              {isLogin && loginSuccess === true && (
                <div
                  className="bg-green-500 text-white px-4 py-3 rounded relative mt-4"
                  role="alert"
                >
                  <strong className="font-bold">Success!</strong>
                  <span className="block sm:inline">
                    You have successfully logged in.
                  </span>
                </div>
              )}
              {isLogin && loginSuccess === false && loginError && (
                <div
                  className="bg-red-500 text-white px-4 py-3 rounded relative mt-4"
                  role="alert"
                >
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline">{loginError}</span>
                </div>
              )}
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="username" className="sr-only">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                        formErrors.username
                          ? "border-red-500"
                          : "border-gray-700"
                      } placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.username}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      formErrors.email ? "border-red-500" : "border-gray-700"
                    } placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border ${
                      formErrors.password ? "border-red-500" : "border-gray-700"
                    } placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 z-10"
                    onClick={togglePasswordVisibility}
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      } text-gray-400`}
                    ></i>
                  </button>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.password}
                    </p>
                  )}
                </div>
                {!isLogin && (
                  <div className="relative">
                    <label htmlFor="confirm-password" className="sr-only">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className={`appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border ${
                        formErrors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-700"
                      } placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 z-10"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      <i
                        className={`fas ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        } text-gray-400`}
                      ></i>
                    </button>
                    {formErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || Object.keys(formErrors).length > 0}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    isLoading || Object.keys(formErrors).length > 0
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      {isLogin ? "Logging In..." : "Signing Up..."}
                    </span>
                  ) : (
                    <span>{isLogin ? "Log In" : "Sign Up"}</span>
                  )}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <a
                  href="#"
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                  onClick={toggleForm}
                >
                  {isLogin ? "Sign up" : "Log in"}
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
            <div
              className="bg-green-500 text-white px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">
                {" "}
                Your account has been created.
              </span>
            </div>
            <button
              className="group relative w-full flex justify-center
           items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md
            text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2
             focus:ring-indigo-500 transition duration-150 ease-in-out"
              onClick={() => {
                router.push("dashboard");
              }}
            >
              Go to inventory <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        )}
      </div>
    </AuthGuardLogin>
  );
}

export default MainComponent;
