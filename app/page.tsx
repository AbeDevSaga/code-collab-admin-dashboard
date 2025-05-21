"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.token !== null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
          Welcome to Code Collab
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl">
          Collaborate on code in real-time with your team. The ultimate platform for pair programming and code reviews.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/auth/login")}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center"
        >
          <span>Login</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/auth/register")}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center"
        >
          <span>Sign Up</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl"
      >
        {[
          { icon: "👨‍💻", text: "Real-time Collaboration" },
          { icon: "📝", text: "Code Review" },
          { icon: "⚡", text: "Fast Execution" },
          { icon: "🔒", text: "Secure" },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 flex flex-col items-center text-center"
          >
            <span className="text-3xl mb-2">{feature.icon}</span>
            <p className="text-gray-300">{feature.text}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LandingPage;