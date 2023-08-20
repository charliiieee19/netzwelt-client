import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import AuthProvider from "./_context/AuthContext";

const Login = lazy(() => import("./Login"));
const Home = lazy(() => import("./Home"));

const RouteLists = () => {
   return (
      <>
         <AuthProvider>
            <BrowserRouter>
               <Suspense
                  fallback={
                     <>
                        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                           <CircularProgress color="inherit" />
                        </Backdrop>
                     </>
                  }
               >
                  <Routes>
                     <Route path="/" element={<Home />} />
                     <Route path="/home/index" element={<Home />} />
                     <Route path="/home" element={<Home />} />
                     <Route path="/account/login" element={<Login />} />
                     <Route path="*" element={<h1>404 NOT FOUND</h1>} />
                  </Routes>
               </Suspense>
            </BrowserRouter>
         </AuthProvider>
      </>
   );
};

export default RouteLists;
