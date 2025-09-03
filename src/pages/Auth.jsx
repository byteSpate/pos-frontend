import React, { useEffect, useState } from "react";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import KacchiExpressLogo from "../components/ui/Logo";

const Auth = () => {
  useEffect(() => {
    document.title = "Kacchi Express | Auth";
  }, []);

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 items-center justify-center p-12 overflow-hidden">
        {/* Animated Glass Morphism Background */}
        <div className="absolute inset-0">
          {/* Floating Glass Bubbles */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 backdrop-blur-xl rounded-3xl rotate-12 animate-float shadow-xl border border-white/30"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/15 backdrop-blur-lg rounded-full animate-float-delayed shadow-lg border border-white/20"></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/25 backdrop-blur-md rounded-xl rotate-45 animate-float-slow shadow-md border border-white/40"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full animate-bounce-slow shadow-lg border border-white/30"></div>

          {/* Large Glass Panel */}
          <div className="absolute top-10 right-10 w-40 h-60 bg-white/10 backdrop-blur-2xl rounded-2xl rotate-6 animate-tilt shadow-2xl border border-white/20"></div>

          {/* Animated Grid pattern */}
          <div className="absolute inset-0 bg-white/5 animate-pulse-slow"
            style={{
              backgroundImage: `
                   linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                 `,
              backgroundSize: '60px 60px',
              animation: 'gridSlide 20s linear infinite'
            }}>
          </div>

          {/* Shimmering Light Effects */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-twinkle-delayed"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-twinkle-slow"></div>
          </div>
        </div>

        <div className="relative z-10 text-center text-white max-w-lg">
          {/* Modern Icon/Illustration */}
          <div className="mb-12">
            <div className="w-32 h-32 mx-auto mb-8 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                Kacchi Express
              </h1>
              <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
            </div>

            <p className="text-2xl text-white/90 font-light leading-relaxed">
              Modern POS System for<br />
              <span className="font-semibold text-orange-100">Exceptional Dining</span>
            </p>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <svg className="w-8 h-8 text-orange-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-sm text-orange-100 font-medium">Fast Orders</p>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <svg className="w-8 h-8 text-orange-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm text-orange-100 font-medium">Smart Analytics</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-orange-100 italic leading-relaxed">
                "Streamlining restaurant operations with cutting-edge technology"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 bg-gray-50 min-h-screen">
        <div className="w-full max-w-md">
          {/* Mobile Logo Section */}
          <div className="lg:hidden text-center mb-8 pt-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <KacchiExpressLogo size="md" />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">Kacchi Express</h1>
                <p className="text-sm text-gray-500 font-medium">POS System</p>
              </div>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Desktop Logo Section */}
          <div className="hidden lg:block text-center mb-10">
            <div className="inline-flex items-center gap-4 mb-6">
              <KacchiExpressLogo size="lg" />
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900">Kacchi Express</h1>
                <p className="text-sm text-gray-500 font-medium">POS System</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 text-lg">
              {isRegister
                ? "Join our restaurant management platform"
                : "Sign in to your account to continue"
              }
            </p>
          </div>

          {/* Mobile Welcome Text */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600">
              {isRegister
                ? "Join our restaurant management platform"
                : "Sign in to your account to continue"
              }
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-6">
            {isRegister ? (
              <Register setIsRegister={setIsRegister} />
            ) : (
              <Login />
            )}
          </div>

          {/* Toggle Auth Mode */}
          <div className="text-center pb-8">
            <p className="text-sm text-gray-600 mb-4">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors duration-200 underline underline-offset-4"
            >
              {isRegister ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;