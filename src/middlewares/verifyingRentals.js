import connection from "../database.js";

export async function verifyRentalExistsOrCompleted(req, res, next) {

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


    } catch (error) {
        console.log(error)
    }

    next();
}