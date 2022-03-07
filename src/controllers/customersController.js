import connection from "../database.js";
import dayjs from "dayjs";

export async function insertCustomer(req, res) {

    const customer = req.body;
    let id;

    try{

        const validBirthday = dayjs().isAfter(customer.birthday);
        if(!validBirthday){
            res.sendStatus(400);
            return
        }

        const cpfExists = await connection.query(`SELECT cpf FROM customers WHERE cpf = $1`, [customer.cpf])
        console.log(cpfExists.rows);
        if(cpfExists.rows.length > 0) {
            res.sendStatus(409);
            return
        }

        const customers = await connection.query(`SELECT * FROM customers ORDER BY id;`);
        if(customers.rows.length > 0) {
            id = customers.rows[customers.rows.length - 1].id + 1;
        } else {
            id = 1;
        }
        console.log(id);

        await connection.query(`
        
        INSERT INTO customers (id, name, phone, cpf, birthday) 
        VALUES ( $1, $2, $3, $4, $5)
        `, [id, customer.name, customer.phone, customer.cpf, customer.birthday])

        res.sendStatus(201);

    } catch(error) {
        console.log(error);
    }
}

export async function getCustomers(req, res) {

    try{

       const customers = await connection.query(`SELECT * FROM customers`)

        res.send(customers.rows);

    } catch(error) {
        console.log(error);
    }
}

export async function getCustomersById(req, res) {

    const id = req.params.id;

    try{

        

       const customer = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id]);

       if(customer.rows.length === 0) {
           res.sendStatus(404);
           return
       }

        res.send(customer.rows);

    } catch(error) {
        console.log(error);
    }
}

export async function updateCustomer(req, res) {

    const customer = req.body;
    const id = req.params.id;

    try{

        const validBirthday = dayjs().isAfter(customer.birthday);
        if(!validBirthday){
            res.sendStatus(400);
            return
        }

        const customerEdited = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id])
        const cpfExists = await connection.query(`SELECT * FROM customers WHERE cpf = $1`, [customer.cpf])
        if(cpfExists.rows.length > 0 && cpfExists.rows[0].cpf !== customerEdited.rows[0].cpf) {
            res.sendStatus(409);
            return
        }

        await connection.query(`
        
        UPDATE customers 
        SET name = $1, phone = $2, cpf = $3, birthday = $4
        WHERE id = $5 
        `, [customer.name, customer.phone, customer.cpf, customer.birthday, id])

        res.send('ok');

    } catch(error) {
        console.log(error);
    }
}