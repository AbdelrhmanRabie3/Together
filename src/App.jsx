import { Route, Routes } from "react-router";
import Feed from "./Pages/Feed";
import SignIn from "./Pages/SignIn";
import { ThemeProvider } from "./components/context/ThemeContextProvider";
import SignUp from "./Pages/SignUp";
import ForgetPassword from "./Pages/ForgetPassword";
import { Toaster } from "sonner";
import NavBar from "./components/ui/NavBar";
import AuthContextProvider from "./components/context/AuthContextProvider";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./components/protectedRoute";
import Error from "./components/Error";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="*" element={<Error />}/>
          </Routes>
        </AuthContextProvider>
      </ThemeProvider>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
