import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoriesRouter from './routes/cotegoriesRouter.js';
dotenv.config();

const server = express();
server.use(cors());
server.use(json());

server.use(categoriesRouter);

server.listen(4000);