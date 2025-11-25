import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const illustrationUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuA7gNjvMQKFDRQUZDe3cUZsZEOtf8_4KRjmCRB1C4z9PAI4H9Z9lTjA7UnooiRunVB0cm3-g8nAOj6Mwe1806m5PzXjBcdZ-6w9YUVezKZ4n7b42XvD9GxTJR2z7J8APWnmD34-oS-YvOQzQCi2HB-DbIABOv2-Z1WAGPnxe0IoIfZd9rHF70UvbuKF0xjtcOfZ2trrAjV3YXIG9xKmAj6aj_lCz7Btr4n-os7Kv9AN36zT0ZfnKvF-EgKrCF-BzFaehGOKWpA1ruru";

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/Auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    role: 1, // JobSeeker role
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle error response
                if (result.errors) {
                    // Handle validation errors from API
                    Object.keys(result.errors).forEach((key) => {
                        setError(key.toLowerCase(), {
                            type: "server",
                            message: result.errors[key][0],
                        });
                    });
                    toast.error("Please fix the errors in the form", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                } else {
                    const errorMessage = result.message || "Registration failed. Please try again.";
                    setError("root", {
                        type: "server",
                        message: errorMessage,
                    });
                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
                return;
            }

            // Success - store tokens and user data
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);
            localStorage.setItem("user", JSON.stringify(result.user));

            // Show success toast
            toast.success("Registration successful! Welcome to CV Builder!", {
                position: "top-right",
                autoClose: 3000,
            });

            // Redirect to home page after a short delay
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            const errorMessage = "Network error. Please check your connection and try again.";
            setError("root", {
                type: "server",
                message: errorMessage,
            });
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            });
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };

  
    // For dark mode, add 'dark' to signup-root if needed
    return (
        <div className="signup-root">
            <div className="signup-layout">
                <header className="signup-header">
                    <div className="signup-header-left">
                        <div className="signup-logo">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: "-10px" }}>
                                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"></path>
                                <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="signup-title">Welcome to Next Step AI</h2>
                    </div>
                    <div className="signup-header-right">
                        <p className="signup-header-login-text">Already have an account?</p>
                        <button className="signup-header-login-btn" type="button">
                            <span className="truncate" onClick={() => {
                                navigate("/login");
                            }}>Log In</span>
                        </button>
                    </div>
                </header>
                <main className="signup-main">
                    <div className="signup-content">
                        <div className="signup-illustration" style={{ background: undefined }}>
                            <div
                                className="signup-illustration-img"
                                style={{ backgroundImage: `url('${illustrationUrl}')` }}
                                data-alt="Abstract graphic illustration of building blocks representing career growth"
                            ></div>
                            <div className="signup-illustration-title">Build Your Professional Future</div>
                            <div className="signup-illustration-desc">
                                Join thousands of professionals who land their dream jobs with our easy-to-use CV builder.
                            </div>
                        </div>
                        <div className="signup-form-container">
                            <div className="signup-form-title" style={{ display: "none" }}>
                                Create Your Account
                            </div>
                            <div className="signup-form-desc" style={{ display: "none" }}>
                                Get started for free.
                            </div>
                            <button className="signup-social-btn" type="button">
                                <svg className="" style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.5777 12.2541C22.5777 11.4541 22.5077 10.6636 22.3877 9.89091H12.2277V14.2818H18.1777C17.9177 15.8909 17.0277 17.2909 15.6877 18.2545V20.9455H19.5377C21.5477 19.1273 22.5777 16.0364 22.5777 12.2541Z" fill="#4285F4"></path>
                                    <path d="M12.2276 23.0002C15.3476 23.0002 17.9776 22.0184 19.5376 20.9457L15.6876 18.2548C14.6776 18.9184 13.5176 19.3366 12.2276 19.3366C9.8876 19.3366 7.8976 17.8457 7.1876 15.7639H3.2176V18.5457C5.0276 21.2639 8.3576 23.0002 12.2276 23.0002Z" fill="#34A853"></path>
                                    <path d="M7.1875 15.7634C7.0375 15.318 6.9475 14.8452 6.9475 14.3725C6.9475 13.8998 7.0375 13.427 7.1875 12.9816V10.1998H3.2175C2.4275 11.6634 1.9975 13.2816 1.9975 14.3725C1.9975 15.4634 2.4275 17.0816 3.2175 18.5452L7.1875 15.7634Z" fill="#FBBC05"></path>
                                    <path d="M12.2276 9.40891C13.8676 9.40891 15.0276 10.0271 15.5476 10.5271L19.6176 6.55436C17.9676 5.03618 15.3476 4 12.2276 4C8.3576 4 5.0276 5.73618 3.2176 8.45436L7.1876 11.2362C7.8976 9.15436 9.8876 9.40891 12.2276 9.40891Z" fill="#EA4335"></path>
                                </svg>
                                <span>Sign up with Google</span>
                            </button>
                            <div className="signup-divider">
                                <div className="signup-divider-line"></div>
                                <span className="signup-divider-text">OR</span>
                                <div className="signup-divider-line"></div>
                            </div>
                            <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                                <div className="signup-name-row">
                                    <label className="signup-label">
                                        <span className="signup-label-text">First Name</span>
                                        <input
                                            className="signup-input"
                                            placeholder="Enter your first name"
                                            {...register("firstName", { required: "First name is required" })}
                                        />
                                        {errors.firstName && (
                                            <span className="signup-error">{errors.firstName.message}</span>
                                        )}
                                    </label>
                                    <label className="signup-label">
                                        <span className="signup-label-text">Last Name</span>
                                        <input
                                            className="signup-input"
                                            placeholder="Enter your last name"
                                            {...register("lastName", { required: "Last name is required" })}
                                        />
                                        {errors.lastName && (
                                            <span className="signup-error">{errors.lastName.message}</span>
                                        )}
                                    </label>
                                </div>
                                <label className="signup-label">
                                    <span className="signup-label-text">Phone Number</span>
                                    <input
                                        className="signup-input"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        {...register("phoneNumber", { required: "Phone number is required" })}
                                    />
                                    {errors.phoneNumber && (
                                        <span className="signup-error">{errors.phoneNumber.message}</span>
                                    )}
                                </label>
                                <label className="signup-label">
                                    <span className="signup-label-text">Email Address</span>
                                    <input
                                        className="signup-input"
                                        type="email"
                                        placeholder="Enter your email address"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <span className="signup-error">{errors.email.message}</span>
                                    )}
                                </label>
                                <label className="signup-label">
                                    <span className="signup-label-text">Password</span>
                                    <div className="signup-password-row">
                                        <input
                                            className="signup-input signup-password-input"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            {...register("password", {
                                                required: "Password is required",
                                                validate: {
                                                    minLength: (value) =>
                                                        value.length >= 8 || "Password must be at least 8 characters long",
                                                    hasUpperCase: (value) =>
                                                        /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                                                    hasNumber: (value) =>
                                                        /[0-9]/.test(value) || "Password must contain at least one number",
                                                    hasSpecialChar: (value) =>
                                                        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                                        "Password must contain at least one special character",
                                                },
                                            })}
                                        />
                                        <button
                                            className="signup-password-toggle"
                                            type="button"
                                            tabIndex={-1}
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: 20, userSelect: "none" }}>
                                                {showPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <span className="signup-error">{errors.password.message}</span>
                                    )}
                                </label>
                                <div className="signup-checkbox-row">
                                    <input
                                        className="signup-checkbox"
                                        id="terms"
                                        type="checkbox"
                                        {...register("agree", { required: "You must agree to the terms" })}
                                    />
                                    <label className="signup-checkbox-label" htmlFor="terms">
                                        I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                                    </label>
                                </div>
                                {errors.agree && (
                                    <span className="signup-error">{errors.agree.message}</span>
                                )}
                                {errors.root && (
                                    <span className="signup-error">{errors.root.message}</span>
                                )}
                                <button className="signup-submit-btn" type="submit" disabled={isLoading}>
                                    <span className="truncate">{isLoading ? "Creating Account..." : "Create Account"}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Signup;