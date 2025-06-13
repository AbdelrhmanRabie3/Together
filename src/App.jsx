import { Route, Routes } from "react-router";
import Feed from "./Pages/Feed";
import SignIn from "./Pages/SignIn";
import { ThemeProvider } from "./components/context/Theme-provider";
import SignUp from "./Pages/SignUp";
import ForgetPassword from "./Pages/ForgetPassword";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Routes>
      </ThemeProvider>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
