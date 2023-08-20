import React, { useEffect, useState, useContext } from "react";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, useNavigate } from "react-router-dom";
//functions
import { http } from "./_helpers/http";
import { AuthContext } from "./_context/AuthContext";

const Home = () => {
   const auth = useContext(AuthContext);
   const navigate = useNavigate();
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);

   const GetData = async () => {
      setLoading(true);
      const result = await http.get("/Territories/All");
      console.log(result);
      const value = result?.data.data.map((val) => {
         return { ...val, open: false };
      });
      setData(value);
      setLoading(false);
   };

   const checkIfhasChild = (id) => {
      return data.filter((x) => x.parent === id).length === 0 ? false : true;
   };

   const Enumerate = (id) => {
      return (
         <List component="nav">
            {data.map((value, idx) => {
               if (id === value.parent) {
                  return (
                     <div key={idx}>
                        <ListItemButton
                           style={{ paddingLeft: value.id.length * 30 }}
                           onClick={() => {
                              if (!checkIfhasChild(value.id)) return;
                              setData(
                                 data.map((current) => {
                                    if (current.id === value.id) return { ...current, open: !current.open };
                                    return current;
                                 })
                              );
                           }}
                        >
                           <ListItemText primary={value.name} />
                           {checkIfhasChild(value.id) ? value.open ? <ExpandLess /> : <ExpandMore /> : null}
                        </ListItemButton>
                        <Collapse in={value.open} timeout="auto" unmountOnExit>
                           {Enumerate(value.id)}
                        </Collapse>
                     </div>
                  );
               }
            })}
         </List>
      );
   };

   useEffect(() => {
      GetData();
   }, []);

   if (!auth.session.userLogin) {
      return <Navigate to={"/account/login"} />;
   }

   return (
      <>
         <CssBaseline />
         <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color="inherit" />
         </Backdrop>
         <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
               <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                     Netzwelt
                  </Typography>
                  <Button
                     color="inherit"
                     onClick={async () => {
                        window.localStorage.removeItem("_token");
                        await auth.VerifyJwt();
                        navigate("/");
                     }}
                  >
                     Logout
                  </Button>
               </Toolbar>
            </AppBar>
         </Box>
         <Toolbar />
         <div className="p-5">
            <Typography variant="h6">Territories</Typography>
            <Typography variant="subtitle1">Here are the list of territories</Typography>
            <Card sx={{ width: "100%", maxWidth: 500, marginTop: 3 }}>{Enumerate(null)}</Card>
         </div>
      </>
   );
};

export default Home;
