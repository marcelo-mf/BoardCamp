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

        const openRents = await connection.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null`, [req.body.gameId]);
        const stock = await connection.query(`SELECT "stockTotal" FROM games WHERE id = $1`, [req.body.gameId]);

        if(openRents.rows.length >= stock.rows[0].stockTotal) {
            res.sendStatus(400);
            return
        }

        const pricePerDay = await connection.query(`SELECT "pricePerDay" FROM games WHERE id = $1`, [req.body.gameId]);
        const originalPrice = pricePerDay.rows[0].pricePerDay * req.body.daysRented;
        const rentDate = dayjs().locale('pt-br').format('YYYY-MM-DD');
        let id;

        const rentals = await connection.query(`SELECT * FROM rentals ORDER BY id;`);
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

       const dados = await connection.query(`
       
       SELECT rentals.*, customers.id AS "customerId", customers.name AS "customerName", games.id AS "gameId", games.name AS "gameName", games."categoryId" 
            FROM rentals 
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id`       
    );

    const receitas = dados.rows.map(dado => ({
        id: dado.id,
        customerId: dado.customerId,
        gameId: dado.gameId,
        rentDate: dado.rentDate,
        daysRented: dado.daysRented,
        returnDate: dado.returnDate,
        originalprice: dado.originalPrice,
        delayFee: dado.delayFee,
        customer: {
            id: dado.customerId,
            name: dado.customerName
        },
        game: {
            id: dado.gameId,
            name: dado.gameName,
            categoryId: dado.categoryId
        }
    }))
       

       res.send(receitas);

    } catch (error) {
        console.log(error)
    }
}

export async function returnRentals(req, res) {

    const id = req.params.id;
    const returnDate = dayjs().locale('pt-br').format('YYYY-MM-DD');
    
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

        const gameId = await connection.query(`SELECT "gameId" FROM rentals WHERE id = $1`, [id]);
        const pricePerDay = await connection.query(`SELECT "pricePerDay" FROM games WHERE id = $1`, [gameId.rows[0].gameId]);
        const daysRented = await connection.query(`SELECT "daysRented" FROM rentals WHERE id = $1`, [id]);
        const rentDateString = await connection.query(`SELECT "rentDate" FROM rentals WHERE id = $1`, [id]);
        const date1 = dayjs(rentDateString.rows[0].rentDate)
        const date2 = dayjs(returnDate)
        const daysFromRentDate = date2.diff(date1, 'day');
        const returnDelay = daysFromRentDate - daysRented.rows[0].daysRented;
        const delayFee = returnDelay * pricePerDay.rows[0].pricePerDay;

        if(returnDelay >= 0) {
            await connection.query(`
        
            UPDATE rentals 
            SET "returnDate" = $1, "DelayFee" = $2
            WHERE id = $3
            `, [returnDate, delayFee, id])

        } else {
            await connection.query(`UPDATE rentals SET "returnDate" = $1 WHERE id = $2 `, [returnDate,  id])
        }

        res.sendStatus(200);

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

       await connection.query(`DELETE FROM rentals WHERE id = $1`, [id]);

       res.sendStatus(200);

    } catch (error) {
        console.log(error)
    }
}