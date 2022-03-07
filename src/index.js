import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoriesRouter from './routes/cotegoriesRouter.js';
import gamesRouter from './routes/gamesRouter.js';
import customersRouter from './routes/customersRouter.js';
import rentalsRouter  from  './routes/rentalsRouter.js';
dotenv.config();

const server = express();
server.use(cors());
server.use(json());

server.use(categoriesRouter);
server.use(gamesRouter);
server.use(customersRouter);
server.use(rentalsRouter);

server.listen(4000);