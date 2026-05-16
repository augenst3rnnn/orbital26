//run "npm run dev"
//creates the server, listens for requests, defines routes

import express from "express";
import "dotenv/config"; //to use .env file
import { ENV } from "./config/env.js";

const app = express();  
const PORT = ENV.PORT || 8001; 

app.get("/api/health", (req, res) => {
    res.status(200).json({ sucess:true });
});

app.listen(PORT, () => {  //start backend server, listen for requests on this port
    console.log("Server running on PORT:", PORT); 
}); 