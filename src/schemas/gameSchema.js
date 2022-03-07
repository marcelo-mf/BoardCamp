import joi from 'joi';

const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().uri(),
    stockTotal: joi.number().integer().greater(0).required(),
    categoryId: joi.number().integer().required(),
    pricePerDay: joi.number().greater(0).required()
})

export default gameSchema;