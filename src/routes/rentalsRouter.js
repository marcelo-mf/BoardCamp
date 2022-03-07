import { Router } from "express";
import { deleteRentals, getRentals, postRentals, returnRentals } from "../controllers/rentalsController.js";
import { verifyRentalExistsOrCompleted } from "../middlewares/verifyingRentals.js";

const rentalsRouter = Router();

rentalsRouter.post('/rentals', postRentals);
rentalsRouter.get('/rentals', getRentals);
rentalsRouter.delete('/rentals/:id', verifyRentalExistsOrCompleted, deleteRentals);
rentalsRouter.post('/rentals/:id/return', verifyRentalExistsOrCompleted, returnRentals);

export default rentalsRouter;