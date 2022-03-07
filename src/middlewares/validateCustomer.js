import customerSchema from "../schemas/customerSchema.js";

export function validadeCustomer(req, res, next) {

    const validation = customerSchema.validate(req.body);

    if(validation.error) {
        return res.sendStatus(400);
    }

    next();
}