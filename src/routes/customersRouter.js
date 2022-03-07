import { Router } from "express";
import { getCustomers, getCustomersById, insertCustomer, updateCustomer } from "../controllers/customersController.js";
import { validadeCustomer } from "../middlewares/validateCustomer.js";

const customersRouter = Router();

customersRouter.post('/customers', validadeCustomer, insertCustomer)
customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getCustomersById)
customersRouter.put('/customers/:id', validadeCustomer, updateCustomer)

export default customersRouter;