import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import {CrmTask} from "./Router/Routes.js";
dotenv.config();
const app=express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

//database connected 
async function CreateConnection (){
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("mongodb is connected");
    return client;
};
export const client = await CreateConnection();


app.use("/", CrmTask);
app.listen(PORT,()=>console.log(`the server start in ${PORT}`));