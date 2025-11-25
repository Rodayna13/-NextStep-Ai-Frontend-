import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        getValues,
    } = useForm();
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
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
                    const errorMessage = result.message || "Login failed. Please check your credentials.";
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
            toast.success("Login successful! Welcome back!", {
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
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // For dark mode, add 'dark' to login-root if needed
    return (
        <div className="login-root">
            <header className="login-header">
                <div className="login-logo">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                        <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
                    </svg>
                </div>
                <h2 className="login-title">User Login</h2>
            </header>
            <main className="login-main">
                <div className="login-card">
                    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                        <h1>Welcome Back</h1>
                        <p>Log in to access your account</p>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="login-label" htmlFor="email">Email Address</label>
                            <input
                                autoComplete="email"
                                className="login-input"
                                id="email"
                                placeholder="Enter your email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                            />
                            {errors.email && (
                                <span className="login-error">{errors.email.message}</span>
                            )}
                        </div>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <label className="login-label" htmlFor="password">Password</label>
                                <button
                                    type="button"
                                    className="login-label"
                                    style={{ color: "#4A90E2", fontWeight: 500, fontSize: "0.875rem", textDecoration: "underline", cursor: "pointer", background: 'transparent', border: 'none', padding: 0 }}
                                    onClick={async () => {
                                        const email = getValues('email')?.trim();
                                        if (!email) {
                                            setError('email', { type: 'manual', message: 'Please enter your email address' });
                                            toast.error('Please enter your email address', { position: 'top-right', autoClose: 3000 });
                                            return;
                                        }

                                        try {
                                            setIsForgotLoading(true);
                                            const resp = await fetch('/api/Auth/forgot-password', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ email })
                                            });
                                            const json = await resp.json();

                                            const message = json?.message || (resp.ok ? 'If the email exists, a reset link has been sent' : 'Request failed');
                                            toast.success(message, { position: 'top-right', autoClose: 4000 });
                                        } catch (err) {
                                            console.error('Forgot password error:', err);
                                            toast.error('Network error. Please try again.', { position: 'top-right', autoClose: 3000 });
                                        } finally {
                                            setIsForgotLoading(false);
                                        }
                                    }}
                                    disabled={isForgotLoading}
                                >
                                    {isForgotLoading ? 'Sending...' : 'Forgot Password?'}
                                </button>
                            </div>
                            <div className="login-form-row">
                                <input
                                    autoComplete="current-password"
                                    className="login-input"
                                    id="password"
                                    placeholder="Enter your password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", { required: "Password is required" })}
                                />
                                <button
                                    className="login-password-toggle"
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 24, userSelect: "none" }}>
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                            {errors.password && (
                                <span className="login-error">{errors.password.message}</span>
                            )}
                        </div>
                        {errors.root && (
                            <span className="login-error">{errors.root.message}</span>
                        )}
                        <button className="login-btn" type="submit" disabled={isLoading}>
                            {isLoading ? "Logging In..." : "Log In"}
                        </button>
                    </form>
                    <div className="login-divider">
                        <div className="login-divider-line"></div>
                        <div className="login-divider-text">Or log in with</div>
                    </div>
                    <div className="login-socials">
                        <button className="login-social-btn" type="button">
                            <svg aria-hidden="true" className="" style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                <path d="M1 1h22v22H1z" fill="none"></path>
                            </svg>
                            <span>Google</span>
                        </button>
                        <button className="login-social-btn" type="button">
                            <svg aria-hidden="true" className="" style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.1,3H3.9C3.4,3,3,3.4,3,3.9v16.2C3,20.6,3.4,21,3.9,21h16.2c0.5,0,0.9-0.4,0.9-0.9V3.9C21,3.4,20.6,3,20.1,3z M8.3,18.3H5.6V9.7h2.7V18.3z M7,8.6C6.1,8.6,5.4,7.9,5.4,7c0-0.9,0.7-1.6,1.6-1.6c0.9,0,1.6,0.7,1.6,1.6C8.6,7.9,7.9,8.6,7,8.6z M18.4,18.3h-2.7v-4.5c0-1.1,0-2.5-1.5-2.5c-1.5,0-1.8,1.2-1.8,2.4v4.6h-2.7V9.7h2.6v1.2h0c0.4-0.7,1.3-1.4,2.5-1.4c2.7,0,3.2,1.8,3.2,4.1V18.3z" fill="#0A66C2"></path>
                            </svg>
                            <span>LinkedIn</span>
                        </button>
                    </div>
                </div>
                <p className="login-footer">
                    Don't have an account?{' '}
                    <a href="#" onClick={() => navigate("/signup")}>Sign Up</a>
                </p>
            </main>
        </div>
    );
};

export default Login;