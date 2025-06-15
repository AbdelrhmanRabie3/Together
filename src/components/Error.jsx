import { useNavigate } from "react-router";
import { Button } from "./ui/Button";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in-up">
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-violet-600 dark:from-violet-600 dark:to-purple-700 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <AlertCircle className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-700 dark:from-violet-400 dark:to-purple-600">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best explorers get lost sometimes!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="group flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-violet-500 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-violet-700 dark:from-violet-600 dark:to-purple-800 hover:from-blue-600 hover:to-violet-800 dark:hover:from-violet-700 dark:hover:to-purple-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-xs mx-auto">
          <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
          <div className="h-2 bg-gradient-to-r from-violet-400 to-violet-600 rounded-full animate-pulse delay-75"></div>
          <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse delay-150"></div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            "Not all those who wander are lost... but this page definitely is!" 
            <span className="ml-2">🧭</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Error;