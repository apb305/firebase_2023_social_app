import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import ErrorPage from "./pages/ErrorPage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import '../src/Index.css';
import AppNav from "./components/layout/Navbar";


function App() {
  return (
    <>
    <BrowserRouter>
      <AuthProvider>
        <AppNav />
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Feed />} />
          </Route>
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/account-settings" element={<PrivateRoute />}>
            <Route path="/account-settings" element={<AccountSettings />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    <ToastContainer autoClose={1500} hideProgressBar={true} />
    </>
  );
}

export default App;
