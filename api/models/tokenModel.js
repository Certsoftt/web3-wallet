import { db } from "../../db";

//a user can have many account

db.connect()
.then(response=>{
    console.log(response, 'DB Connected Succesfully!')
})
.catch(error=>{
    console.log(error.message, 'DB Failed to connect')
})

db.query(
    `CREATE TABLE token(
    id INTEGER REFERENCES account(id) UNIQUE,
    name VARCHAR(50),
    address VARCHAR(50),
    symbol VARCHAR(50)
    )`
)