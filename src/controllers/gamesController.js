import connection from "../database.js";
import gameSchema from "../schemas/gameSchema.js";

export async function getGames(req, res) {

    try{

        const games = await connection.query(`

            SELECT games.*, categories.name AS "categoryName" 
            FROM games JOIN categories 
            ON games."categoryId"=categories.id

        `);
        
        res.send(games.rows);

    } catch(error) {
        console.log(error);
    }
}

export async function postGame(req, res) {

    const game = req.body;
    const validation = gameSchema.validate(game);
    const stock = parseInt(game.stockTotal);
    const pricePerDay = parseFloat(game.pricePerDay);
    let id;

    try{

        const gameExists = await connection.query(`SELECT name FROM games WHERE name = $1`, [game.name])
        if(gameExists.rows.length > 0) {
            res.sendStatus(409);
            return
        }

        const categoryExists = await connection.query(`SELECT name FROM categories WHERE id = $1`, [game.categoryId])
        if(validation.error || categoryExists.rows.length === 0){
            res.sendStatus(400);
            return
        }

        const games = await connection.query(`SELECT * FROM games;`);
        if(games.rows.length > 0) {
            id = games.rows[games.rows.length - 1].id + 1;
        } else {
            id = 1;
        }

        await connection.query(`
        
            INSERT INTO games (id, name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1, $2, $3, $4, $5, $6)`, [id, game.name, game.image, stock, game.categoryId, pricePerDay]
            
        )

        res.send('ok');

    } catch(error) {
        console.log(error);
    }
}