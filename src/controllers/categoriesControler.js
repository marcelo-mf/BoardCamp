import connection from "../database.js";
import categorySchema from "../schemas/categorieSchema.js";

export async function getCategories(req, res) {

    try{

        const categories = await connection.query(`SELECT * FROM categories;`)

        res.send(categories.rows);

    } catch(error) {
        console.log(error);
    }
}

export async function insertCategory(req, res) {


    const validation = categorySchema.validate(req.body);
    const name = req.body.name;

    try{

        const categories = await connection.query(`SELECT * FROM categories;`)
        let id

        if(categories.rows.length > 0) {
            id = categories.rows[categories.rows.length - 1].id + 1;
        } else {
            id = 1;
        }

        if(validation.error) {
            res.sendStatus(400);
            return
        }

        const categoryExists = await connection.query(`SELECT name FROM categories WHERE name = $1`, [name])

        if(categoryExists.rows.length > 0) {
            res.sendStatus(409);
            return
        }

        await connection.query(`INSERT INTO categories (id, name) VALUES ($1, $2);`, [id, name]);
        
        console.log(name); 
        console.log(id);
        res.send(name);

    } catch(error) {
        console.log(error);
    }
}