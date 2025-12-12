import Link from "next/link";
import { MessageCircle, Sparkles, Lock, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 text-cyan-500">ConvoFlow</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Modern real-time chat application with AI-powered features
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/auth/signin"
              className="px-8 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700"
            >
              Sign Up
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <MessageCircle className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">
                Real-time Messaging
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Instant message delivery with Socket.IO websockets
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <Sparkles className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Smart reply suggestions and message improvements
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <Lock className="h-12 w-12 text-green-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">
                Secure Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                JWT-based authentication with NextAuth
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <Zap className="h-12 w-12 text-yellow-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Built with Next.js 15 for optimal performance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            Built by{" "}
            <a
              href="https://github.com/jayaramuday"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Jayaram Uday
            </a>
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <a
              href="https://github.com/jayaramuday"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              GitHub
            </a>
            <span>•</span>
            <a
              href="https://linkedin.com/in/jayaramuday"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
