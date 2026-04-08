import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import News from "./components/News/News";

import Footer from "./components/Footer";
import Resume from "./components/Resume/ResumeNew";
import Airdrop from "./components/InfoProject/Airdrop/airdrop";
import Testnet from "./components/InfoProject/Testnet/Testnet";

import PostPage from "./components/PostPage";
import LoginPage from "./components/LoginPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
}

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Preloader load={load} />
        <div className="App" id={load ? "no-scroll" : "scroll"}>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            
            <Route path="/resume" element={<Resume />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/InfoProject/airdrop" element={<Airdrop />} />
            <Route path="/InfoProject/testnet" element={<Testnet />} />
            <Route
              path="/post"
              element={
                <RequireAuth>
                  <PostPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
