import React, { useState } from "react";
import { toast } from "react-toastify";

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
  errorMessage?: string; // This you can remove if you want solely toast
  onSwitchToSignUp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,

  onSwitchToSignUp,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(username.trim(), password.trim());
      // Optionally show success toast after login if you want:
      // toast.success("Logged in successfully!");
    } catch (err) {
      const message = (err as Error).message || "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-black dark:text-gray-100 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            autoFocus
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            disabled={isLoading}
          />
          {/* Removed inline error display since using toast now */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition ${
              isLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-700 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            className="text-black hover:underline dark:text-gray-200 font-semibold focus:outline-none"
            onClick={onSwitchToSignUp}
            type="button"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
