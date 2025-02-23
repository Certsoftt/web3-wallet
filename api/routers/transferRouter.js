import { db } from "../../db.js";

export const transfer = async(req, res)=>{
    try{
        await db.connect()
        .then(async(response)=>{
            console.log(response, 'DB Connected Succesfully!')
            const result = await db.query("SELECT * FROM account")
            if(result.rows.length !== 0){
                console.log(result.rows)
                res.json({data: result.rows})
            }
        })
        .catch(error=>{
            console.log(error.message, 'DB Failed to connect')
        })
    }finally{
        await db.end()
    }
}