import React, { useState } from "react";

interface SignUpPageProps {
  onSignUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  errorMessage?: string;
  onSwitchToLogin: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSignUp,

  onSwitchToLogin,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError("Username and password are required.");
      return;
    }

    if (password !== passwordConfirm) {
      setLocalError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await onSignUp(username.trim(), email.trim(), password);
    } catch (err) {
      setLocalError((err as Error).message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Food Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50">
        {/* Floating Food Icons */}
        <div
          className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        >
          🥑
        </div>
        <div
          className="absolute top-20 right-16 text-5xl opacity-15 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        >
          🥕
        </div>
        <div
          className="absolute bottom-20 left-20 text-4xl opacity-25 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        >
          🥬
        </div>
        <div
          className="absolute bottom-32 right-10 text-5xl opacity-20 animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        >
          🍎
        </div>
        <div
          className="absolute top-1/2 left-5 text-4xl opacity-15 animate-bounce"
          style={{ animationDelay: "1.5s", animationDuration: "3s" }}
        >
          🍓
        </div>
        <div
          className="absolute top-1/3 right-5 text-6xl opacity-10 animate-bounce"
          style={{ animationDelay: "2.5s", animationDuration: "4s" }}
        >
          🥒
        </div>
        <div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-4xl opacity-20 animate-bounce"
          style={{ animationDelay: "1.8s", animationDuration: "3.8s" }}
        >
          🍇
        </div>
        <div
          className="absolute top-5 left-1/3 text-5xl opacity-15 animate-bounce"
          style={{ animationDelay: "0.8s", animationDuration: "4.2s" }}
        >
          🥦
        </div>
        <div
          className="absolute top-1/4 right-1/4 text-4xl opacity-18 animate-bounce"
          style={{ animationDelay: "1.2s", animationDuration: "3.7s" }}
        >
          🍊
        </div>
        <div
          className="absolute bottom-1/4 left-1/4 text-5xl opacity-12 animate-bounce"
          style={{ animationDelay: "2.2s", animationDuration: "4.1s" }}
        >
          🥝
        </div>

        {/* Subtle Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-200/50 p-8 border border-slate-100/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <span className="text-2xl">🌱</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Create Account
            </h2>
            <p className="text-slate-500">Join our fresh food community</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3.5 pl-12 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-slate-300"
                  disabled={isLoading}
                  autoFocus
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  👤
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 pl-12 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-slate-300"
                  disabled={isLoading}
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  📧
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pl-12 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-slate-300"
                  disabled={isLoading}
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  🔐
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="passwordConfirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-3.5 pl-12 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-slate-300"
                  disabled={isLoading}
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  🔒
                </span>
              </div>
            </div>

            {/* Error Message */}
            {localError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-700 text-sm font-medium">
                  {localError}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className={`w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25 ${
                isLoading ? "opacity-70 cursor-not-allowed transform-none" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🌟</span>
                  Create Account
                </div>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm"></div>
          </div>

          <p className="text-center text-slate-600">
            Already have an account?{" "}
            <button
              className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline focus:outline-none transition-colors duration-200"
              onClick={onSwitchToLogin}
              type="button"
            >
              Sign in
            </button>
          </p>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Welcome to LunchBox - Eat together. Split together.
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
