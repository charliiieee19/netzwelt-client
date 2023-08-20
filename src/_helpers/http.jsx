import axios from "axios";

export const http = axios.create({
   baseURL: "https://netzwelt-devtest.azurewebsites.net",
   headers: {
      "Content-Type": "application/json",
   },
});

export const httpApi = () => {
   const token = window.localStorage.getItem("_token") || "";
   return axios.create({
      baseURL: "http://localhost:3000/api",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
   });
};
