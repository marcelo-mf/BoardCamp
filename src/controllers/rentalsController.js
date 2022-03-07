import connection from "../database.js";
import rentalsSchema from "../schemas/rentalsSchema.js";
import dayjs from "dayjs";

export async function postRentals(req, res) {

    const validation = rentalsSchema.validate(req.body);
    
    try{

        if(validation.error) {
            res.sendStatus(400);
            return
        }

        const customerExists = await connection.query(`SELECT * FROM customers WHERE id = $1`, [req.body.customerId]);
        if(customerExists.rows.length === 0) {
            res.sendStatus(400);
            return
        }

        const gameExists = await connection.query(`SELECT * FROM games WHERE id = $1`, [req.body.gameId]);
        if(gameExists.rows.length === 0) {
            res.sendStatus(400);
            return
        }

        const openRents = await connection.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" = $2`, [req.body.gameId, null]);
        const stock = await connection.query(`SELECT "stockTotal" FROM games WHERE id = $1`, [req.body.gameId]);

        if(openRents.rows.length >= stock.rows[0].stockTotal) {
            res.sendStatus(400);
            return
        }

        const pricePerDay = await connection.query(`SELECT "pricePerDay" FROM games WHERE id = $1`, [req.body.gameId]);
        const originalPrice = pricePerDay.rows[0].pricePerDay * req.body.daysRented;
        const rentDate = dayjs().locale('pt-br').format('YYYY-MM-DD');
        let id;

        const rentals = await connection.query(`SELECT * FROM rentals;`);
        if(rentals.rows.length > 0) {
            id = rentals.rows[rentals.rows.length - 1].id + 1;
        } else {
            id = 1;
        }
        
        await connection.query(`

            INSERT INTO rentals (id, "customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [id, req.body.customerId, req.body.gameId, rentDate, req.body.daysRented, null, originalPrice, null]
        )

        
            res.sendStatus(200);

    } catch (error) {
        console.log(error)
    }
}

export async function getRentals(req, res) {
    
    try{

       const rentals = await connection.query(`SELECT * FROM rentals`);

       res.send(rentals.rows);

    } catch (error) {
        console.log(error)
    }
}

export async function returnRentals(req, res) {

    const id = req.params.id;
    
    try{


    } catch (error) {
        console.log(error)
    }
}

export async function deleteRentals(req, res) {

    const id = req.params.id;
    
    try{

        const rentalExists = await connection.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if(rentalExists.rows.length === 0) {
            res.sendStatus(404);
            return
        }

        const isCompleted = await connection.query(`SELECT "returnDate" FROM rentals WHERE id = $1`, [id]);
        if(isCompleted.rows[0].returnDate !== null) {
            res.sendStatus(400);
            return
        }

        res.send('ok');
       //await connection.query(`DELETE FROM rentals WHERE id = $1`, [id]);

    } catch (error) {
        console.log(error)
    }
}