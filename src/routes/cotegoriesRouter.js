import { Router } from "express";
import { getCategories, insertCategory } from "../controllers/categoriesControler.js";

const categoriesRouter = Router();

categoriesRouter.post('/categories', insertCategory)
categoriesRouter.get('/categories', getCategories)

export default categoriesRouter;