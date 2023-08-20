import React, { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { http, httpApi } from "./_helpers/http";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "./_context/AuthContext";

const Login = () => {
   const auth = useContext(AuthContext);
   const _navigate = useNavigate();
   const [alert, setAlert] = useState({
      open: false,
      severity: "error",
      content: "",
   });
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
         email: data.get("email"),
         password: data.get("password"),
      });

      setLoading(true);
      try {
         const result = await http.post("/Account/SignIn", {
            username: data.get("username"),
            password: data.get("password"),
         });

         console.log(result);
         if (result.status === 200) {
            setAlert((x) => ({
               ...x,
               open: true,
               severity: "success",
               content: "Successfuly login. Redirecting...",
            }));

            const signToken = await httpApi().post("/generate-token", { session: result.data });
            console.log(signToken, "signToken");
            if (signToken.data?.token) {
               window.localStorage.setItem("_token", signToken.data?.token);
               await auth.VerifyJwt();
            }
            _navigate("/");
         }
      } catch (err) {
         if (err?.response?.status === 404) {
            setAlert((x) => ({ ...x, open: true, content: err.response?.data?.message }));
         }
         console.log(err, "err");
      }
      setLoading(false);
   };

   if (auth.session.userLogin) {
      return <Navigate to={"/"} />;
   }

   return (
      <Container component="main" maxWidth="xs">
         <CssBaseline />
         <Box
            sx={{
               marginTop: 8,
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
            }}
         >
            <Avatar className="m-3">
               <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
               Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
               {alert.open && (
                  <Alert
                     variant="filled"
                     severity={alert.severity}
                     action={
                        <IconButton
                           aria-label="close"
                           color="inherit"
                           size="small"
                           onClick={() => {
                              setAlert((x) => ({ ...x, open: false }));
                           }}
                        >
                           <CloseIcon fontSize="inherit" />
                        </IconButton>
                     }
                  >
                     {alert.content}
                  </Alert>
               )}
               <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Username"
                  name="username"
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
               />
               <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="off"
                  spellCheck="false"
               />
               <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
               <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                  {loading && <CircularProgress size={24} color="inherit" />}
               </Button>
            </Box>
         </Box>
      </Container>
   );
};

export default Login;
