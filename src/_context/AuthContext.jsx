import React, { createContext, useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { httpApi } from "../_helpers/http";

export const AuthContext = createContext();

const AuthProvider = (props) => {
   const [loading, setLoading] = useState(true);
   const [session, setSession] = useState({
      userLogin: false,
   });

   const VerifyJwt = async () => {
      setLoading(true);
      try {
         const result = await httpApi().post("/verify-token");
         console.log(result, "VerifyJwt");
         if (result.data?.data) {
            setSession((x) => ({ ...x, userLogin: true }));
         } else {
            setSession((x) => ({ ...x, userLogin: false }));
         }
      } catch (err) {
         console.log(err);
         setSession((x) => ({ ...x, userLogin: false }));
      }
      setLoading(false);
   };

   useEffect(() => {
      VerifyJwt();
   }, []);

   const value = {
      session,
      VerifyJwt,
   };

   if (loading) {
      return (
         <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
         </Backdrop>
      );
   }

   return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export default AuthProvider;
