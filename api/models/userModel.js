import { db } from "../../db";

//a user can have many account

db.connect()
.then(response=>{
    console.log(response, 'DB Connected Succesfully!')
})
.catch(error=>{
    console.log(error.message, 'DB Failed to connect')
})

db.query(`
    CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(50),
    privateKey VARCHAR(50),
    address VARCHAR(50),
    mnmonic VARCHAR(50)
    )
`)