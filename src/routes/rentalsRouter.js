import { Router } from "express";
import { deleteRentals, getRentals, postRentals, returnRentals } from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.post('/rentals', postRentals);
rentalsRouter.get('/rentals', getRentals);
rentalsRouter.delete('/rentals/:id', deleteRentals);
rentalsRouter.post('/rentals/:id/return', returnRentals);

export default rentalsRouter;